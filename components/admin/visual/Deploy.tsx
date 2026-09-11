"use client";

import { useEffect, useState } from "react";
import { deployStatus } from "@/app/admin/editor-actions";
import type { DeployState } from "@/lib/admin/store-core";
import { useLang } from "./i18n";

// Follows a publish until it is actually on the site: saved (the commit
// exists) → building (Vercel) → live, or failed. Editors of git-based
// admins are otherwise left guessing whether "saved" means "live".

export function DeployTracker({
  commit,
  startedAt,
  path,
  onClose,
  onReload,
}: {
  commit: string;
  startedAt: number;
  path: string;
  onClose: () => void;
  onReload: () => void;
}) {
  const { t } = useLang();
  const [state, setState] = useState<DeployState>({ state: "pending" });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      if (stop) return;
      const s = await deployStatus(commit).catch(() => ({ state: "unknown" as const }));
      if (stop) return;
      setState(s);
      if (s.state === "pending" || s.state === "unknown") {
        if (Date.now() - startedAt < 10 * 60_000) setTimeout(tick, 4000);
      }
    };
    void tick();
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [commit, startedAt]);

  const secs = Math.floor((now - startedAt) / 1000);
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const pending = state.state === "pending" || state.state === "unknown";

  return (
    <div role="status" className="fixed bottom-4 left-4 z-30 w-[min(92vw,360px)] rounded-[2px] border border-line bg-charcoal p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <ol className="space-y-1 text-[14px]">
          <li className="text-teal">✓ {t.saved}</li>
          {state.state === "local" ? (
            <li className="text-teal">✓ {t.localSaved}</li>
          ) : (
            <>
              <li className={pending ? "font-medium" : "text-teal"}>
                {pending ? (
                  <>
                    <span className="mr-1 inline-block animate-spin">◌</span>
                    {t.building} <span className="font-mono text-[12px] text-warm-gray">{clock}</span>
                  </>
                ) : state.state === "failure" ? (
                  <span className="text-coral-deep">✕ {t.deployFailed}</span>
                ) : (
                  `✓ ${t.building.replace("…", "")}`
                )}
              </li>
              {state.state === "success" && <li className="font-semibold text-teal">✓ {t.live}</li>}
            </>
          )}
        </ol>
        {!pending && (
          <button type="button" onClick={onClose} className="text-warm-gray" aria-label={t.close}>
            ✕
          </button>
        )}
      </div>
      {(state.state === "success" || state.state === "local") && (
        <div className="mt-3 flex gap-3 text-[13px]">
          <button type="button" onClick={onReload} className="rounded-[2px] bg-brand px-3 py-1.5 font-semibold text-white">
            {t.reloadPreview}
          </button>
          <a href={path} target="_blank" rel="noopener" className="px-1 py-1.5 text-teal hover:underline">
            {t.view} ↗
          </a>
        </div>
      )}
    </div>
  );
}
