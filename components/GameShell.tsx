"use client";

import { useCallback } from "react";
import { Game } from "@/components/Game";
import { GameOver } from "@/components/UI/GameOver";
import { HUD } from "@/components/UI/HUD";
import { LaneHints } from "@/components/UI/LaneHints";
import { StartScreen } from "@/components/UI/StartScreen";
import { useGame } from "@/context/GameContext";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSwipe } from "@/hooks/useSwipe";

export function GameShell() {
  const {
    status,
    score,
    bestScore,
    startGame,
    goToMenu,
    moveLane,
  } = useGame();

  const controlsEnabled = status === "playing";

  const onLeft = useCallback(() => moveLane(-1), [moveLane]);
  const onRight = useCallback(() => moveLane(1), [moveLane]);

  useKeyboard(controlsEnabled, onLeft, onRight);
  useSwipe(controlsEnabled, onLeft, onRight);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-slate-900">
      <Game />
      {/* Cinematic darken + vignette — sits above 3D, below UI */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(4,8,16,0.38) 100%)",
            "linear-gradient(to bottom, rgba(6,10,18,0.3) 0%, transparent 25%, transparent 70%, rgba(4,8,16,0.4) 100%)",
          ].join(", "),
        }}
      />
      {status === "playing" && (
        <>
          <HUD score={score} bestScore={bestScore} />
          <LaneHints visible />
        </>
      )}
      {status === "menu" && (
        <StartScreen onStart={startGame} bestScore={bestScore} />
      )}
      {status === "gameover" && (
        <GameOver
          score={score}
          bestScore={bestScore}
          onRestart={startGame}
          onMenu={goToMenu}
        />
      )}
    </main>
  );
}
