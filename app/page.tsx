"use client";

import { GameShell } from "@/components/GameShell";
import { GameProvider } from "@/context/GameContext";

export default function Home() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
