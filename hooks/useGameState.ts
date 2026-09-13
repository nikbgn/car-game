"use client";

import { useCallback, useState } from "react";
import { audioManager } from "@/lib/audio";
import { getBestScore, saveBestScore } from "@/lib/storage";
import type { GameStatus } from "@/lib/constants";

export function useGameState() {
  const [status, setStatus] = useState<GameStatus>("menu");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lane, setLane] = useState(1);

  const refreshBest = useCallback(() => {
    setBestScore(getBestScore());
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setLane(1);
    setStatus("playing");
    audioManager.stopAll();
  }, []);

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
    audioManager.playCoin();
  }, []);

  const endGame = useCallback(() => {
    setStatus("gameover");
    audioManager.playCrash();
    setScore((currentScore) => {
      const nextBest = saveBestScore(currentScore);
      setBestScore((prev) => Math.max(prev, nextBest, currentScore));
      return currentScore;
    });
  }, []);

  const goToMenu = useCallback(() => {
    setStatus("menu");
    setScore(0);
    setLane(1);
    refreshBest();
  }, [refreshBest]);

  const moveLane = useCallback((direction: -1 | 1) => {
    setLane((prev) => Math.min(2, Math.max(0, prev + direction)));
  }, []);

  return {
    status,
    score,
    bestScore,
    lane,
    setLane,
    startGame,
    addScore,
    endGame,
    goToMenu,
    moveLane,
    refreshBest,
  };
}
