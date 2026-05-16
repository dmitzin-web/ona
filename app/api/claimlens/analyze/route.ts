import Anthropic from "@anthropic-ai/sdk";
import * as Sentry from "@sentry/nextjs";
import { claimLensSystemPrompt } from "@/lib/claimlens/prompts";
import {
  documentCategories,
  claimTypes,
  propertyStates,
  userRoles,
  severityLevels,
  confidenceLevels,
  MAX_CLAIMS_PER_24H,
  MAX_FILE_BYTES,
  MAX_FILES_PER_CLAIM,
  type ClaimReport,
  type DocumentCategory,
  type ClaimType,
  type PropertyState,
  type UserRole,
} from "@/lib/claimlens/config";
import {
  classifyFile,
  extractPdfText,
  extractPlainText,
  type FileKind,
} from "@/lib/claimlens/parse";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/claimlens/analyze (multipart/form-data)
//
// Auth-required. Accepts the user's claim documents inline as multipart
// form data, parses them, stores everything in Supabase (claims +
// claim_files + claim_reports tables, claim-files Storage bucket), runs
// Claude analysis, and returns { claimId } so the client can navigate to
// /claimlens/report/<id>.
//
// Multipart fields:
//   - meta:      JSON string with { claimType, propertyState, role, carrierName, notes }
//   - categories: JSON string with [{ name, category }] mapping each file to a document category
//   - file:      one or more File parts (one per uploaded document)
//
// If ANTHROPIC_API_KEY is missing, the route still works but writes a
// deterministic mock report — useful for local dev when the user wants to
// exercise the storage + DB flow without burning API credits.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_NOTES_LENGTH = 4000;
const MAX_CARRIER_LENGTH = 120;
// Per-claim total byte budget. Even with MAX_FILES_PER_CLAIM at 20 and
// MAX_FILE_BYTES at 25MB each, we cap the aggregate so a runaway upload
// can't blow up memory or token costs.
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

type MetaPayload = {
  claimType: ClaimType;
  propertyState: PropertyState;
  role: UserRole;
  carrierName: string | null;
  notes: string;
};

type CategoryMapping = { name: string; category: DocumentCategory }[];

export async function POST(req: Request) {
  // ---------------------------------------------------------------------
  // 1. Auth
  // ---------------------------------------------------------------------
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return Response.json(
      { error: "Sign in to analyze a claim." },
      { status: 401 },
    );
  }

  // ---------------------------------------------------------------------
  // 1b. Rate limit — count claims this user created in the last 24h.
  // RLS scopes `claims` to the signed-in user so the count is naturally
  // user-specific. Counts drafts/errors too — otherwise a user could
  // bypass the limit by spamming failing requests.
  // ---------------------------------------------------------------------
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recentClaims, error: countErr } = await supabase
    .from("claims")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if (countErr) {
    console.error("[claimlens/analyze] rate-limit count failed", countErr);
    return Response.json(
      { error: "Could not check rate limit. Try again." },
      { status: 500 },
    );
  }
  if ((recentClaims ?? 0) >= MAX_CLAIMS_PER_24H) {
    // Compute when the oldest in-window claim expires from the window, so
    // we can tell the user when to try again. The header is informational
    // — clients are not forced to back off, but our upload form respects it.
    const { data: oldestRow } = await supabase
      .from("claims")
      .select("created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    const retrySeconds = oldestRow
      ? Math.max(
          60,
          Math.ceil(
            (new Date(oldestRow.created_at).getTime() + 24 * 60 * 60 * 1000 - Date.now()) /
              1000,
          ),
        )
      : 60 * 60;
    return Response.json(
      {
        error: `You've reached the daily limit of ${MAX_CLAIMS_PER_24H} analyses. Try again in about ${formatRetryWindow(retrySeconds)}.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retrySeconds),
          "X-RateLimit-Limit": String(MAX_CLAIMS_PER_24H),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // ---------------------------------------------------------------------
  // 2. Parse multipart
  // ---------------------------------------------------------------------
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const metaRaw = form.get("meta");
  const categoriesRaw = form.get("categories");
  if (typeof metaRaw !== "string" || typeof categoriesRaw !== "string") {
    return Response.json(
      { error: "Missing meta or categories field." },
      { status: 400 },
    );
  }

  let meta: MetaPayload;
  let categories: CategoryMapping;
  try {
    meta = JSON.parse(metaRaw);
    categories = JSON.parse(categoriesRaw);
  } catch {
    return Response.json(
      { error: "meta / categories must be valid JSON." },
      { status: 400 },
    );
  }
  if (!isValidMeta(meta) || !isValidCategories(categories)) {
    return Response.json(
      { error: "Invalid meta or categories payload." },
      { status: 400 },
    );
  }

  const files = form.getAll("file").filter((v): v is File => v instanceof File);
  if (files.length > MAX_FILES_PER_CLAIM) {
    return Response.json(
      { error: `Maximum ${MAX_FILES_PER_CLAIM} files per claim.` },
      { status: 400 },
    );
  }
  let totalBytes = 0;
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: `File too large: ${f.name}` },
        { status: 413 },
      );
    }
    totalBytes += f.size;
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    return Response.json(
      { error: "Total upload size exceeds 100 MB." },
      { status: 413 },
    );
  }

  // ---------------------------------------------------------------------
  // 3. Insert claim row (user-scoped via RLS)
  // ---------------------------------------------------------------------
  const { data: claim, error: claimErr } = await supabase
    .from("claims")
    .insert({
      user_id: user.id,
      claim_type: meta.claimType,
      property_state: meta.propertyState === "other" ? null : meta.propertyState,
      carrier_name: meta.carrierName,
      notes: meta.notes,
      status: "analyzing",
    })
    .select("id")
    .single();
  if (claimErr || !claim) {
    console.error("[claimlens/analyze] claim insert failed", claimErr);
    return Response.json(
      { error: "Could not create claim record." },
      { status: 500 },
    );
  }
  const claimId = claim.id;

  // From here on, errors get persisted as status="error" so the user can
  // see what went wrong instead of staring at a 500.
  const adminSupabase = createAdminClient();

  try {
    // -------------------------------------------------------------------
    // 4. Upload each file to Storage, parse text, insert claim_files row
    // -------------------------------------------------------------------
    type ProcessedFile = {
      name: string;
      category: DocumentCategory;
      kind: FileKind;
      mime: string;
      sizeBytes: number;
      extractedText: string | null;
      parseNote: string | null;
      imageBase64: string | null; // for image files only — passed to Claude vision
      imageMediaType: string | null;
    };
    const processed: ProcessedFile[] = [];

    for (const file of files) {
      const category =
        categories.find((c) => c.name === file.name)?.category ?? "other";
      const kind = classifyFile(file.name, file.type);
      const buffer = new Uint8Array(await file.arrayBuffer());
      const storagePath = `${user.id}/${claimId}/${cryptoRandomId()}-${safeName(file.name)}`;

      // Upload to private bucket. Admin client bypasses RLS — we just
      // verified `user` above, so prefixing the path with user.id is the
      // ownership signal.
      const { error: uploadErr } = await adminSupabase.storage
        .from("claim-files")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (uploadErr) {
        throw new Error(`Storage upload failed for ${file.name}: ${uploadErr.message}`);
      }

      // Parse text where possible.
      let extractedText: string | null = null;
      let parseNote: string | null = null;
      let imageBase64: string | null = null;
      let imageMediaType: string | null = null;

      if (kind === "pdf") {
        const r = await extractPdfText(buffer);
        extractedText = r.text || null;
        if (!r.ok) parseNote = r.reason ?? "Could not parse PDF.";
      } else if (kind === "text") {
        const r = extractPlainText(buffer);
        extractedText = r.text || null;
        if (!r.ok) parseNote = r.reason ?? "Could not read text file.";
      } else if (kind === "image") {
        // Stream image bytes into Claude vision as a base64 content block.
        imageBase64 = Buffer.from(buffer).toString("base64");
        imageMediaType = file.type || "image/jpeg";
        parseNote = "Image — sent to vision model.";
      } else if (kind === "office") {
        parseNote = "DOCX/XLSX parsing not enabled in this build — file stored but content not analyzed.";
      } else {
        parseNote = "Unknown file type — file stored but content not analyzed.";
      }

      // Record the file row.
      const { error: fileRowErr } = await adminSupabase.from("claim_files").insert({
        claim_id: claimId,
        file_name: file.name,
        file_type: file.type || "application/octet-stream",
        document_category: category,
        storage_path: storagePath,
        size_bytes: file.size,
        extracted_text: extractedText,
      });
      if (fileRowErr) {
        throw new Error(`File row insert failed for ${file.name}: ${fileRowErr.message}`);
      }

      processed.push({
        name: file.name,
        category,
        kind,
        mime: file.type,
        sizeBytes: file.size,
        extractedText,
        parseNote,
        imageBase64,
        imageMediaType,
      });
    }

    // -------------------------------------------------------------------
    // 5. Call Claude (or mock if no key)
    // -------------------------------------------------------------------
    const apiKey = process.env.ANTHROPIC_API_KEY;
    let report: ClaimReport;
    let source: "ai" | "mock" | "mock-fallback" = "mock";

    if (!apiKey) {
      report = buildMockReport(meta, processed);
      source = "mock";
    } else {
      const result = await callClaude(apiKey, meta, processed);
      if (result.ok) {
        report = result.report;
        source = "ai";
      } else {
        console.error("[claimlens/analyze] Claude failed:", result.reason);
        report = buildMockReport(meta, processed);
        source = "mock-fallback";
      }
    }

    // -------------------------------------------------------------------
    // 6. Save report + flip claim status to complete
    // -------------------------------------------------------------------
    const { error: reportErr } = await adminSupabase.from("claim_reports").insert({
      claim_id: claimId,
      snapshot: report.snapshot,
      key_findings: report.keyFindings,
      missing_scope: report.missingScope,
      inconsistencies: report.inconsistencies,
      questions: report.questionsToAsk,
      checklist: report.documentationChecklist,
      source,
      disclaimer_acknowledged: true,
    });
    if (reportErr) {
      throw new Error(`Report insert failed: ${reportErr.message}`);
    }

    await adminSupabase
      .from("claims")
      .update({ status: "complete" })
      .eq("id", claimId);

    return Response.json(
      { claimId, source },
      {
        headers: {
          "X-ClaimLens-Source": source,
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err) {
    console.error("[claimlens/analyze] processing error", err);
    // Surface to Sentry. No-op when SENTRY_DSN is unset (dev).
    Sentry.captureException(err, {
      tags: { route: "claimlens.analyze", claim_id: claimId },
    });
    await adminSupabase
      .from("claims")
      .update({ status: "error" })
      .eq("id", claimId)
      .then(() => {}, () => {});
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Analysis failed — please try again.",
      },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Claude call
// ---------------------------------------------------------------------------

type ProcessedDoc = {
  name: string;
  category: DocumentCategory;
  kind: FileKind;
  mime: string;
  sizeBytes: number;
  extractedText: string | null;
  parseNote: string | null;
  imageBase64: string | null;
  imageMediaType: string | null;
};

type ClaudeResult =
  | { ok: true; report: ClaimReport }
  | { ok: false; reason: string };

async function callClaude(
  apiKey: string,
  meta: MetaPayload,
  docs: ProcessedDoc[],
): Promise<ClaudeResult> {
  const client = new Anthropic({ apiKey });

  // Build the user-content array: a leading text block with the claim
  // context + each document, interleaving image blocks for photos.
  const blocks: Anthropic.ContentBlockParam[] = [];

  const intro = [
    "A user has requested a ClaimLens review. Below are the claim context and every uploaded document. PDFs and text files have been extracted to text; photos are attached as images.",
    "",
    `Claim type: ${meta.claimType}`,
    `Property state: ${meta.propertyState}`,
    `User role: ${meta.role}`,
    `Carrier: ${meta.carrierName ?? "not provided"}`,
    "",
    "User notes:",
    meta.notes ? `"""${meta.notes}"""` : "(none)",
    "",
    `Documents (${docs.length}):`,
  ].join("\n");
  blocks.push({ type: "text", text: intro });

  for (const [i, doc] of docs.entries()) {
    const header = `\n--- Document ${i + 1}/${docs.length} ---\nName: ${doc.name}\nCategory: ${doc.category}\nType: ${doc.mime || "unknown"} (${doc.kind})\n`;
    if (doc.kind === "image" && doc.imageBase64 && doc.imageMediaType) {
      blocks.push({ type: "text", text: header + "\n(Image attached below)" });
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: doc.imageMediaType as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: doc.imageBase64,
        },
      });
    } else if (doc.extractedText) {
      blocks.push({
        type: "text",
        text: `${header}\nExtracted content:\n"""\n${doc.extractedText}\n"""`,
      });
    } else {
      blocks.push({
        type: "text",
        text: `${header}\n(No content extracted — ${doc.parseNote ?? "unknown reason"})`,
      });
    }
  }

  blocks.push({
    type: "text",
    text: "Return the report as strict JSON matching the schema in your instructions. No markdown, no prose outside the JSON.",
  });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: claimLensSystemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: blocks }],
    });
    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return { ok: false, reason: "Model returned no text block." };
    }
    const parsed = parseModelJson(text.text);
    if (!parsed) {
      return { ok: false, reason: "Model returned invalid JSON shape." };
    }
    return {
      ok: true,
      report: {
        ...parsed,
        generatedAt: new Date().toISOString(),
        source: "ai",
      },
    };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Validation + parsing helpers
// ---------------------------------------------------------------------------

function isValidMeta(v: unknown): v is MetaPayload {
  if (typeof v !== "object" || v === null) return false;
  const m = v as Record<string, unknown>;
  if (!claimTypes.some((c) => c.value === m.claimType)) return false;
  if (!propertyStates.some((s) => s.value === m.propertyState)) return false;
  if (!userRoles.some((r) => r.value === m.role)) return false;
  if (m.carrierName !== null && typeof m.carrierName !== "string") return false;
  if (typeof m.carrierName === "string" && m.carrierName.length > MAX_CARRIER_LENGTH) return false;
  if (typeof m.notes !== "string" || m.notes.length > MAX_NOTES_LENGTH) return false;
  return true;
}

function isValidCategories(v: unknown): v is CategoryMapping {
  if (!Array.isArray(v)) return false;
  for (const item of v) {
    if (typeof item !== "object" || item === null) return false;
    const it = item as Record<string, unknown>;
    if (typeof it.name !== "string") return false;
    if (!documentCategories.some((c) => c.value === it.category)) return false;
  }
  return true;
}

type ParsedReport = Omit<ClaimReport, "generatedAt" | "source">;

function parseModelJson(text: string): ParsedReport | null {
  let raw = text.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isParsedReport(parsed)) return null;
  return parsed;
}

function isParsedReport(value: unknown): value is ParsedReport {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.snapshot !== "object" || v.snapshot === null) return false;
  if (!Array.isArray(v.keyFindings)) return false;
  for (const f of v.keyFindings) {
    if (typeof f !== "object" || f === null) return false;
    const ff = f as Record<string, unknown>;
    if (typeof ff.label !== "string" || typeof ff.summary !== "string") return false;
    if (typeof ff.severity !== "string" || !severityLevels.includes(ff.severity as never)) return false;
  }
  if (!Array.isArray(v.missingScope)) return false;
  for (const m of v.missingScope) {
    if (typeof m !== "object" || m === null) return false;
    const mm = m as Record<string, unknown>;
    if (
      typeof mm.item !== "string" ||
      typeof mm.whyItMatters !== "string" ||
      typeof mm.evidenceReference !== "string" ||
      typeof mm.evidenceNeeded !== "string" ||
      typeof mm.recommendedQuestion !== "string"
    ) {
      return false;
    }
    if (typeof mm.confidence !== "string" || !confidenceLevels.includes(mm.confidence as never)) return false;
    if (typeof mm.severity !== "string" || !severityLevels.includes(mm.severity as never)) return false;
  }
  if (!Array.isArray(v.inconsistencies)) return false;
  for (const c of v.inconsistencies) {
    if (typeof c !== "object" || c === null) return false;
    const cc = c as Record<string, unknown>;
    if (typeof cc.title !== "string" || typeof cc.detail !== "string") return false;
    if (typeof cc.severity !== "string" || !severityLevels.includes(cc.severity as never)) return false;
  }
  if (!Array.isArray(v.questionsToAsk)) return false;
  for (const q of v.questionsToAsk) {
    if (typeof q !== "string") return false;
  }
  if (!Array.isArray(v.documentationChecklist)) return false;
  for (const c of v.documentationChecklist) {
    if (typeof c !== "object" || c === null) return false;
    const cc = c as Record<string, unknown>;
    if (typeof cc.label !== "string") return false;
    if (cc.hint !== undefined && typeof cc.hint !== "string") return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Mock fallback — same shape as before, now aware of processed docs
// ---------------------------------------------------------------------------

function buildMockReport(meta: MetaPayload, docs: ProcessedDoc[]): ClaimReport {
  const hasCarrierEst = docs.some((d) => d.category === "carrier-estimate");
  const hasContractorEst = docs.some((d) => d.category === "contractor-estimate");
  const hasPhotos = docs.some((d) => d.kind === "image");
  const hasPolicy = docs.some((d) => d.category === "policy");
  const hasMitigation = docs.some((d) => d.category === "mitigation-invoice");
  const hasDenial = docs.some((d) => d.category === "denial-letter");
  const claimLabel = claimTypes.find((c) => c.value === meta.claimType)?.label ?? meta.claimType;

  const keyFindings: ClaimReport["keyFindings"] = [];
  if (!hasCarrierEst) {
    keyFindings.push({
      label: "Carrier estimate not provided",
      severity: "needs-documentation",
      summary: "Without the carrier estimate, scope-gap detection is limited.",
    });
  }
  if (!hasPolicy) {
    keyFindings.push({
      label: "Policy language not provided",
      severity: "needs-documentation",
      summary: "Coverage, exclusions, and limitations could not be reviewed.",
    });
  }
  if (hasPhotos && hasCarrierEst) {
    keyFindings.push({
      label: "Documents loaded — review in progress",
      severity: "medium",
      summary: "Carrier estimate and photos are in the file. Cross-checks would compare line-item quantities to documented damage areas.",
    });
  }
  if (hasMitigation) {
    keyFindings.push({
      label: "Mitigation invoice requires line-by-line review",
      severity: "medium",
      summary: "Mitigation invoices commonly bill for equipment days and labor that should be tied to specific affected rooms.",
    });
  }
  if (hasDenial) {
    keyFindings.push({
      label: "Denial letter present",
      severity: "high",
      summary: "Cited policy provisions should be matched to the actual policy form when available.",
    });
  }

  return {
    snapshot: {
      claimType: claimLabel,
      documentsReviewed: docs.length,
      estimateTotal: hasCarrierEst ? "Not detected — text extraction returned no total line." : null,
      lossDate: null,
      carrier: meta.carrierName ?? null,
      propertyState: meta.propertyState === "other" ? null : meta.propertyState,
    },
    keyFindings,
    missingScope: [
      {
        item: "Baseboard paint touch-up after detach / reset",
        whyItMatters: "Detach/reset of baseboards typically requires touch-up paint where caulk lines were disturbed.",
        evidenceReference: hasCarrierEst ? "Uploaded carrier estimate" : "Would be reviewed against the carrier estimate when available",
        evidenceNeeded: "Photos of baseboards before and after reset.",
        confidence: hasCarrierEst ? "likely" : "needs-verification",
        severity: "medium",
        recommendedQuestion: "Could you confirm whether baseboard paint touch-up after detach and reset was included in the room scope?",
      },
      {
        item: "Texture match on patched drywall",
        whyItMatters: "Drywall patches on textured walls typically require texture matching before paint.",
        evidenceReference: hasPhotos ? "Uploaded photos" : "Would be confirmed against photos when available",
        evidenceNeeded: "Photo of wall texture pattern and adjacent surfaces.",
        confidence: hasPhotos ? "likely" : "possible",
        severity: "medium",
        recommendedQuestion: "Was a texture match line item considered for drywall patches on the affected wall?",
      },
    ],
    inconsistencies: hasCarrierEst
      ? [
          {
            title: "Detach/reset approved without related paint touch-up",
            detail: "A common gap on water and fire estimates — when trim is detached and reset, paint touch-up often does not appear on the same room scope.",
            severity: "medium",
          },
        ]
      : [
          {
            title: "Cross-document checks limited by missing inputs",
            detail: "Quantity and dependency checks become possible once both the carrier estimate and photos are uploaded.",
            severity: "needs-documentation",
          },
        ],
    questionsToAsk: [
      "Could you walk me through how the affected wall and floor areas were measured for line-item quantities?",
      "Was paint touch-up after baseboard detach and reset included in the room scope?",
      "Was a texture match line item considered for drywall patches on textured walls?",
      hasMitigation
        ? "Could you share the mitigation daily logs that support the equipment days on the invoice?"
        : "When a mitigation invoice is available, could you share the daily logs that support the equipment days billed?",
      "Is final cleaning included in the reconstruction scope?",
    ],
    documentationChecklist: [
      { label: "Photos of every affected room, before any cleanup if available" },
      { label: "Measurements of affected areas (length, width, ceiling height)" },
      { label: "Moisture readings from the mitigation crew" },
      { label: "Mitigation daily logs and equipment placement records" },
      { label: "Contractor scope of work and detailed line-item estimate" },
      { label: "Carrier estimate (most recent revision)" },
      { label: "Insurance policy declarations page and full policy form" },
      { label: "Any denial, partial-denial, or coverage clarification letters" },
      { label: "ITEL or material-matching documentation if discontinued materials are involved" },
    ],
    generatedAt: new Date().toISOString(),
    source: "mock",
  };
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function cryptoRandomId() {
  // Browser-compatible enough; Node's webcrypto exposes randomUUID on
  // globalThis.crypto from Node 19+.
  return globalThis.crypto.randomUUID();
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

// Human-readable "try again in X" message for the 429 response.
function formatRetryWindow(seconds: number): string {
  if (seconds < 60) return "a minute";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.round(seconds / 3600);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return "a day";
}
