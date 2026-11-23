"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/*
  Live Vancouver time. The page is statically exported, so the server can't
  know the visitor's "now": render a same-width placeholder first and start
  ticking after mount (aligned to the second boundary so digits flip together).
*/
function useVancouverTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = window.setTimeout(tick, 1000 - date.getMilliseconds());
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return now;
}

type LocalClockProps = {
  variant: "inline" | "footer";
  className?: string;
};

export default function LocalClock({ variant, className = "" }: LocalClockProps) {
  const now = useVancouverTime();
  const time = now ? formatter.format(now) : "--:--:--";
  const iso = now?.toISOString();

  if (variant === "inline") {
    return (
      <p className={`font-pixel text-[16.5px] text-copy ${className}`}>
        Vancouver (PCT){" "}
        <time dateTime={iso} className="tabular-nums">
          {time}
        </time>
      </p>
    );
  }

  return (
    <p className={`flex flex-col items-end font-pixel text-[clamp(24px,2.3vw,35px)] leading-[normal] ${className}`}>
      <time dateTime={iso} className="text-amber-soft tabular-nums">
        {time}
      </time>
      <span className="text-amber">Vancouver (PCT)</span>
    </p>
  );
}
