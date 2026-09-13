"use client";

type GameOverProps = {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onMenu: () => void;
};

export function GameOver({
  score,
  bestScore,
  onRestart,
  onMenu,
}: GameOverProps) {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55 px-6 text-center text-white backdrop-blur-[2px]">
      <h2 className="text-3xl font-black">Crashed!</h2>
      {isNewBest && (
        <p className="mt-2 text-sm font-semibold text-amber-300">New best score!</p>
      )}
      <p className="mt-4 text-5xl font-bold tabular-nums">{score}</p>
      <p className="mt-2 text-sm text-white/75">Best: {bestScore}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-900 transition hover:bg-amber-300 active:scale-95"
        >
          Play Again
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="rounded-full border border-white/30 px-8 py-3 font-semibold transition hover:bg-white/10 active:scale-95"
        >
          Menu
        </button>
      </div>
    </div>
  );
}
