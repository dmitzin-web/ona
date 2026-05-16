// Document text extraction for Vvon.
//
// V0 supports:
//   - PDF with a text layer (carrier estimates, contractor scopes, denial
//     letters that were generated digitally). Scanned PDFs that are pure
//     image will return mostly empty text — those need OCR, which is a
//     follow-up task.
//   - Plain text and CSV — straight UTF-8 decode.
//
// Images (JPG/PNG) are not parsed here. They are passed directly to
// Claude's vision API as content blocks by the API route.
//
// DOCX/XLSX/ESX are explicitly out of scope for v0. The API route logs
// a warning and includes the file by name only.

import { extractText, getDocumentProxy } from "unpdf";

const MAX_EXTRACTED_CHARS = 80_000; // soft cap per document to control token cost

export type ParseResult = {
  ok: boolean;
  text: string;
  pageCount?: number;
  reason?: string;
};

export async function extractPdfText(buffer: Uint8Array): Promise<ParseResult> {
  try {
    const pdf = await getDocumentProxy(buffer);
    // With mergePages: true, unpdf returns text as a single string.
    const { text, totalPages } = await extractText(pdf, { mergePages: true });
    const trimmed = (typeof text === "string" ? text : "").trim();

    if (!trimmed) {
      return {
        ok: false,
        text: "",
        pageCount: totalPages,
        reason:
          "PDF appears to be a scan with no text layer. OCR is not enabled in this build — try uploading a text-based PDF.",
      };
    }

    return {
      ok: true,
      text: clamp(trimmed),
      pageCount: totalPages,
    };
  } catch (err) {
    return {
      ok: false,
      text: "",
      reason: `PDF parse failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export function extractPlainText(buffer: Uint8Array): ParseResult {
  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer).trim();
    if (!text) return { ok: false, text: "", reason: "Empty file." };
    return { ok: true, text: clamp(text) };
  } catch (err) {
    return {
      ok: false,
      text: "",
      reason: `Text decode failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

function clamp(s: string): string {
  return s.length > MAX_EXTRACTED_CHARS
    ? s.slice(0, MAX_EXTRACTED_CHARS) + "\n\n…[truncated for length]"
    : s;
}

// Classify what a file is from its mime + filename. Used by the API route
// to pick the right parser (and to decide whether to ship the file to
// Claude vision as an image).
export type FileKind = "pdf" | "image" | "text" | "office" | "unknown";

export function classifyFile(name: string, mime: string): FileKind {
  const lowerName = name.toLowerCase();
  const lowerMime = mime.toLowerCase();
  if (lowerMime === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (lowerMime.startsWith("image/")) return "image";
  if (
    lowerMime === "text/plain" ||
    lowerMime === "text/csv" ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".csv")
  ) {
    return "text";
  }
  if (
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".xlsx") ||
    lowerMime.includes("officedocument")
  ) {
    return "office";
  }
  return "unknown";
}
