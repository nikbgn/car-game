"use client";

import { useState } from "react";
import { AssetsCredits } from "@/components/UI/AssetsCredits";

type StartScreenProps = {
  onStart: () => void;
  bestScore: number;
};

export function StartScreen({ onStart, bestScore }: StartScreenProps) {
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-black/55 via-black/15 to-transparent px-6 pb-16 text-center text-white">
        <h1 className="text-4xl font-black tracking-tight drop-shadow-lg sm:text-5xl">
          Lane Rush
        </h1>
        <p className="mt-2 max-w-sm text-sm text-white/90 sm:text-base">
          Dodge traffic · Collect coins · Beat your best
        </p>
        {bestScore > 0 && (
          <p className="mt-3 text-sm font-semibold text-amber-300">
            Best score: {bestScore}
          </p>
        )}
        <button
          type="button"
          onClick={onStart}
          className="mt-6 rounded-full bg-amber-400 px-12 py-3.5 text-lg font-bold text-slate-900 shadow-lg transition hover:bg-amber-300 active:scale-95"
        >
          Tap to Play
        </button>
        <p className="mt-4 text-xs text-white/75">
          ← → or swipe to change lanes
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
          <button
            type="button"
            onClick={() => setCreditsOpen(true)}
            className="underline-offset-2 transition hover:text-white/85 hover:underline"
          >
            Assets Credits
          </button>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/nikbgn/car-game"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition hover:text-white/85 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
      <AssetsCredits open={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </>
  );
}
