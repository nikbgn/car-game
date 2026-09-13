"use client";

import { useRef } from "react";
import { ChaseCamera } from "@/components/ChaseCamera";
import { GameWorld } from "@/components/GameWorld";
import { Highway } from "@/components/Highway";
import { PlayerCar } from "@/components/PlayerCar";
import { SpeedController } from "@/components/SpeedController";
import {
  COIN_POINTS,
  FOG_DENSITY,
  IDLE_SCROLL_SPEED,
  SCROLL_SPEED_BASE,
  SKY_COLOR,
} from "@/lib/constants";
import { useGame } from "@/context/GameContext";

export function Scene() {
  const { status, lane, addScore, endGame } = useGame();
  const playing = status === "playing";
  const speedRef = useRef(SCROLL_SPEED_BASE);
  const elapsedRef = useRef(0);

  const menuScrollSpeed = status === "menu" ? IDLE_SCROLL_SPEED : 0;

  return (
    <>
      <color attach="background" args={[SKY_COLOR]} />
      <fogExp2 attach="fog" args={[SKY_COLOR, FOG_DENSITY]} />

      <ambientLight intensity={0.62} />
      <directionalLight
        position={[8, 16, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight
        args={["#c8e8ff", "#3d7a3f", 0.45]}
        position={[0, 40, 0]}
      />

      <SpeedController
        playing={playing}
        speedRef={speedRef}
        elapsedRef={elapsedRef}
      />

      <Highway scrollSpeed={menuScrollSpeed} speedRef={speedRef} />
      <PlayerCar lane={lane} />

      <GameWorld
        playing={playing}
        lane={lane}
        speedRef={speedRef}
        onCoin={() => addScore(COIN_POINTS)}
        onCrash={endGame}
      />

      <ChaseCamera />
    </>
  );
}
