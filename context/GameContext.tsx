"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useGameState } from "@/hooks/useGameState";

type GameContextValue = ReturnType<typeof useGameState> & {
  scoreRef: React.RefObject<number>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGameState();
  const scoreRef = useRef(game.score);

  useEffect(() => {
    scoreRef.current = game.score;
  }, [game.score]);

  useEffect(() => {
    game.refreshBest();
  }, [game.refreshBest]);

  const endGameStable = useCallback(() => {
    game.endGame();
  }, [game]);

  const value = useMemo(
    () => ({
      ...game,
      endGame: endGameStable,
      scoreRef,
    }),
    [game, endGameStable],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
