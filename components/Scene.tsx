"use client";

import { useRef } from "react";
import { ChaseCamera } from "@/components/ChaseCamera";
import { GameWorld } from "@/components/GameWorld";
import { Highway } from "@/components/Highway";
import { PlayerCar } from "@/components/PlayerCar";
import { RoadsideScenery } from "@/components/RoadsideScenery";
import { SkyGradient } from "@/components/SkyGradient";
import { SpeedController } from "@/components/SpeedController";
import {
  COIN_POINTS,
  FOG_DENSITY,
  IDLE_SCROLL_SPEED,
  SCROLL_SPEED_BASE,
  SKY_COLOR,
  SKY_HORIZON_COLOR,
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
      <fogExp2 attach="fog" args={[SKY_HORIZON_COLOR, FOG_DENSITY]} />

      <SkyGradient />

      <ambientLight intensity={0.28} color="#8899bb" />
      <directionalLight
        position={[8, 20, 4]}
        intensity={0.72}
        color="#b8c8e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <hemisphereLight
        args={["#3a4a68", "#1a3a28", 0.32]}
        position={[0, 40, 0]}
      />

      <SpeedController
        playing={playing}
        speedRef={speedRef}
        elapsedRef={elapsedRef}
      />

      <Highway
        scrollSpeed={menuScrollSpeed}
        speedRef={playing ? speedRef : undefined}
      />
      <RoadsideScenery
        scrollSpeed={menuScrollSpeed}
        speedRef={playing ? speedRef : undefined}
      />
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
