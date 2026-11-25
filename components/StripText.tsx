"use client";

import { useEffect, useState } from "react";

// The strip's one line. By day it says what's in content/chrome.json →
// statusStrip.text; between 10 p.m. and 6 a.m. Pacific it says the time
// ("It's 2:14 a.m. — a person still answers"), set after the page loads so
// the server-rendered day text and the browser agree on first paint.
export function StripText({ day, night }: { day: string; night: string }) {
  const [text, setText] = useState(day);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "America/Los_Angeles" }).format(now)) % 24;
      if (h >= 22 || h < 6) {
        const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" })
          .format(now).replace(" AM", " a.m.").replace(" PM", " p.m.");
        setText(night.replace("{time}", time));
      } else setText(day);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [day, night]);
  return <p className="eyebrow whitespace-nowrap text-white">{text}</p>;
}
