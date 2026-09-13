"use client";

import { useEffect, useState } from "react";
import { SCROLL_SPEED_BASE, SCROLL_SPEED_MAX } from "@/lib/constants";
import { getRunSpeed, getSpeedMultiplier, subscribeRunSpeed } from "@/lib/runSpeed";

type HUDProps = {
  score: number;
  bestScore: number;
};

export function HUD({ score, bestScore }: HUDProps) {
  const [speed, setSpeed] = useState(getRunSpeed);

  useEffect(() => subscribeRunSpeed(setSpeed), []);

  const multiplier = getSpeedMultiplier(speed);
  const speedPercent = Math.round(
    ((speed - SCROLL_SPEED_BASE) / (SCROLL_SPEED_MAX - SCROLL_SPEED_BASE)) * 100,
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center pt-5">
      <p className="text-4xl font-black tabular-nums text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl">
        {score}
      </p>
      {bestScore > 0 && (
        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/75">
          Best {bestScore}
        </p>
      )}
      {multiplier > 1.02 && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
          Speed ×{multiplier.toFixed(1)}
        </p>
      )}
      <div className="mt-1.5 h-1 w-20 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-amber-300/90 transition-[width] duration-300"
          style={{ width: `${Math.max(4, speedPercent)}%` }}
        />
      </div>
    </div>
  );
}
