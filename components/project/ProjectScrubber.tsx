"use client";

// ──────────────────────────────────────────────────────────────
// Project File — interactive timeline scrubber
// ──────────────────────────────────────────────────────────────
// This is the page's centerpiece. The homeowner can move
// through every day of the project and see exactly what
// changed: moisture readings, equipment on site, photos
// taken, documents filed.
//
// Why a scrubber instead of a static log:
//   - the static log buries the *process*. People skim and
//     bounce. The scrubber forces engagement with one phase
//     at a time, which is closer to how a real Project File
//     is consumed on a phone.
//   - moisture readings actually tell the drying story when
//     you can see them drop day-over-day in the "vs prior"
//     column. That's the moment of "they really show me the
//     whole process".
//
// Interaction model:
//   - default active phase = today (or nearest past phase)
//   - click any node on the rail to jump
//   - ← / → keyboard arrows scrub (skipped if a form field
//     is focused, so it never hijacks intended keystrokes)
//   - Home / End jump to first / last phase
//   - "Jump to today" button resets to the live phase
//
// Honesty guardrails:
//   - phases marked `estimated` are visibly tagged "Projected"
//     and never show fabricated moisture readings or photos
//   - the moisture "vs prior" delta is computed from the prior
//     phase in the array — no fictional intermediate readings
//   - this is rendered inside a page that ALSO carries the
//     "Sample" banner, so the data is honestly framed

import { useCallback, useEffect, useMemo, useState } from "react";

export type MoistureReading = {
  location: string;
  pct: number;
};

export type Phase = {
  day: string; // human label, e.g. "Day 1"
  dayNumber: number; // ordering key, e.g. 1
  date: string; // "May 18" — short month + day, no year
  title: string;
  body: string;
  moisture?: MoistureReading[];
  equipment?: string[];
  photosAdded?: number;
  docsAdded?: string[];
  changeNotes?: string[];
  estimated?: boolean; // true for projected/future phases
};

export function ProjectScrubber({
  phases,
  currentDayNumber,
}: {
  phases: Phase[];
  currentDayNumber: number;
}) {
  // Default to the phase whose dayNumber === currentDayNumber.
  // If the current day falls between phases (e.g. day 4 in a
  // 1/2/3/5/6 schedule), pick the nearest past phase so the
  // panel never opens on something that hasn't happened.
  const todayIndex = useMemo(() => {
    const exact = phases.findIndex((p) => p.dayNumber === currentDayNumber);
    if (exact >= 0) return exact;
    const past = phases.reduce((acc, p, i) => {
      if (!p.estimated && p.dayNumber <= currentDayNumber) return i;
      return acc;
    }, 0);
    return past;
  }, [phases, currentDayNumber]);

  const [activeIndex, setActiveIndex] = useState(todayIndex);

  const goPrev = useCallback(
    () => setActiveIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const goNext = useCallback(
    () => setActiveIndex((i) => Math.min(phases.length - 1, i + 1)),
    [phases.length],
  );
  const goToday = useCallback(
    () => setActiveIndex(todayIndex),
    [todayIndex],
  );

  // Global keyboard scrub. Bail out if the user is typing in
  // a form field — we don't want to hijack arrow keys inside
  // inputs, textareas, contenteditable, etc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(phases.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, phases.length]);

  const phase = phases[activeIndex];
  // Walk back to the most recent prior phase that actually has
  // moisture readings — that's the right baseline for the
  // "vs prior" delta column, even if a couple of intervening
  // phases skipped readings.
  const prevMoisturePhase = useMemo(() => {
    for (let i = activeIndex - 1; i >= 0; i--) {
      if (phases[i].moisture?.length) return phases[i];
    }
    return null;
  }, [phases, activeIndex]);

  const isLivePhase =
    !phase.estimated && phase.dayNumber === currentDayNumber;

  return (
    <section aria-label="Project timeline">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="eyebrow text-ivory/75">Project timeline</h2>
          <p className="mt-2 text-[12px] text-ivory/50">
            Scrub through each day · ← → keys also work
          </p>
        </div>
        <button
          type="button"
          onClick={goToday}
          disabled={activeIndex === todayIndex}
          className="hidden text-[11px] uppercase tracking-wider text-ivory/55 transition hover:text-ivory disabled:cursor-default disabled:text-ivory/25 sm:block"
        >
          Jump to today →
        </button>
      </div>

      {/* Rail */}
      <div className="relative mt-8 pb-2">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-[11px] h-px bg-ivory/10" />
        {/* Filled portion to active */}
        <div
          className="absolute left-0 top-[11px] h-px bg-gold transition-[width] duration-300 ease-out"
          style={{
            width:
              phases.length > 1
                ? `${(activeIndex / (phases.length - 1)) * 100}%`
                : "0%",
          }}
        />
        <div className="relative flex justify-between">
          {phases.map((p, i) => {
            const isPast = i < activeIndex;
            const isActive = i === activeIndex;
            const isTodayPhase =
              !p.estimated && p.dayNumber === currentDayNumber;
            return (
              <button
                key={`${p.day}-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`${p.day} — ${p.title}`}
                aria-current={isActive ? "step" : undefined}
                className="group flex min-w-0 flex-col items-center gap-3 px-1"
              >
                <span className="relative inline-flex h-[22px] w-[22px] items-center justify-center">
                  {/* Pulse on the "today" node when it's not currently active */}
                  {isTodayPhase && !isActive ? (
                    <span className="ona-pulse absolute h-[18px] w-[18px] rounded-full bg-gold/25" />
                  ) : null}
                  <span
                    className={`relative rounded-full transition-all duration-200 ${
                      isActive
                        ? "h-[14px] w-[14px] bg-gold ring-4 ring-gold/15"
                        : isPast
                        ? "h-[10px] w-[10px] bg-ivory/65 group-hover:bg-ivory"
                        : p.estimated
                        ? "h-[10px] w-[10px] border border-dashed border-ivory/30 bg-charcoal group-hover:border-ivory/60"
                        : "h-[10px] w-[10px] border border-ivory/35 bg-charcoal group-hover:border-ivory/70"
                    }`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap text-[11px] tabular-nums transition ${
                    isActive
                      ? "text-ivory"
                      : "text-ivory/50 group-hover:text-ivory/80"
                  }`}
                >
                  {p.day}
                </span>
                <span
                  className={`hidden whitespace-nowrap text-[10px] tabular-nums transition sm:block ${
                    isActive ? "text-ivory/65" : "text-ivory/35"
                  }`}
                >
                  {p.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active phase panel — keyed on phase.day so React remounts
          and the ona-fade-in animation fires on every scrub. */}
      <div
        key={phase.day}
        className="ona-fade-in mt-12 grid gap-12 md:grid-cols-[1.15fr_1fr] md:gap-16"
      >
        {/* LEFT — narrative */}
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`eyebrow ${
                phase.estimated
                  ? "text-ivory/40"
                  : isLivePhase
                  ? "text-gold"
                  : "text-ivory/60"
              }`}
            >
              {phase.estimated
                ? "Projected"
                : isLivePhase
                ? "Live · today"
                : "Logged"}
            </span>
            {isLivePhase ? (
              <span
                aria-hidden="true"
                className="ona-pulse inline-block h-1.5 w-1.5 rounded-full bg-gold"
              />
            ) : null}
            <span className="text-[12px] text-ivory/45 tabular-nums">
              {phase.day} · {phase.date}
            </span>
          </div>

          <h3 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-ivory md:text-[32px]">
            {phase.title}
          </h3>
          <p className="mt-5 text-[15px] leading-relaxed text-ivory/75">
            {phase.body}
          </p>

          {phase.changeNotes?.length ? (
            <ul className="mt-7 space-y-3 text-[13px] text-ivory/75">
              {phase.changeNotes.map((n) => (
                <li key={n} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[5px] inline-block h-1 w-3 flex-shrink-0 select-none bg-gold/70"
                  />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* RIGHT — data panel */}
        <div className="space-y-9">
          {phase.moisture?.length ? (
            <div>
              <div className="flex items-baseline justify-between">
                <div className="eyebrow text-ivory/50">
                  Moisture readings
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ivory/35">
                  Dry &lt; 16% MC
                </div>
              </div>
              <table className="mt-3 w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ivory/10 text-left text-[10px] uppercase tracking-wider text-ivory/40">
                    <th className="pb-2 pr-3 font-normal">Location</th>
                    <th className="pb-2 px-3 text-right font-normal">
                      MC %
                    </th>
                    <th className="pb-2 pl-3 text-right font-normal">
                      vs prior
                    </th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {phase.moisture.map((m, i) => {
                    const prior = prevMoisturePhase?.moisture?.[i]?.pct;
                    const delta = prior !== undefined ? m.pct - prior : null;
                    const isDry = m.pct < 16;
                    return (
                      <tr
                        key={`${m.location}-${i}`}
                        className="border-b border-ivory/[0.06]"
                      >
                        <td className="py-2.5 pr-3 text-ivory/85">
                          {m.location}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-mono ${
                            isDry ? "text-gold" : "text-ivory"
                          }`}
                        >
                          {m.pct}%
                        </td>
                        <td
                          className={`py-2.5 pl-3 text-right font-mono text-[12px] ${
                            delta === null
                              ? "text-ivory/25"
                              : delta < 0
                              ? "text-ivory/65"
                              : delta > 0
                              ? "text-ivory/40"
                              : "text-ivory/30"
                          }`}
                        >
                          {delta === null
                            ? "—"
                            : delta > 0
                            ? `+${delta}`
                            : delta}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {phase.equipment?.length ? (
            <div>
              <div className="eyebrow text-ivory/50">On site</div>
              <ul className="mt-3 space-y-1.5 text-[13px] text-ivory/80">
                {phase.equipment.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {phase.photosAdded || phase.docsAdded?.length ? (
            <div className="grid grid-cols-2 gap-6 border-t border-ivory/10 pt-6">
              {phase.photosAdded ? (
                <div>
                  <div className="eyebrow text-ivory/50">Photos today</div>
                  <div className="mt-2 text-[26px] font-semibold tabular-nums leading-none text-ivory">
                    +{phase.photosAdded}
                  </div>
                </div>
              ) : null}
              {phase.docsAdded?.length ? (
                <div>
                  <div className="eyebrow text-ivory/50">Docs filed</div>
                  <ul className="mt-2 space-y-1 text-[13px] text-ivory/85">
                    {phase.docsAdded.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {phase.estimated &&
          !phase.moisture &&
          !phase.equipment &&
          !phase.docsAdded ? (
            <div className="rounded-lg border border-dashed border-ivory/15 p-5 text-[13px] text-ivory/55">
              Projected milestone — readings, photos and docs will
              populate here as the day is reached.
            </div>
          ) : null}
        </div>
      </div>

      {/* Nav controls */}
      <div className="mt-14 flex items-center justify-between border-t border-ivory/10 pt-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="text-[13px] text-ivory/65 transition hover:text-ivory disabled:cursor-default disabled:text-ivory/25"
        >
          ← Previous day
        </button>
        <div className="text-[11px] uppercase tracking-wider text-ivory/45 tabular-nums">
          {activeIndex + 1} of {phases.length}
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === phases.length - 1}
          className="text-[13px] text-ivory/65 transition hover:text-ivory disabled:cursor-default disabled:text-ivory/25"
        >
          Next day →
        </button>
      </div>
    </section>
  );
}
