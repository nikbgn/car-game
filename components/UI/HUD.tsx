"use client";

type HUDProps = {
  score: number;
  bestScore: number;
};

export function HUD({ score, bestScore }: HUDProps) {
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
    </div>
  );
}
