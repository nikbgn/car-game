"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  CAR_SCALE,
  LANE_SWITCH_DURATION,
  LANE_X,
  PLAYER_Y,
  PLAYER_Z,
} from "@/lib/constants";

useGLTF.preload("/models/player/hatchback-sports.glb");

type PlayerCarProps = {
  lane: number;
};

export function PlayerCar({ lane }: PlayerCarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/player/hatchback-sports.glb");
  const carModel = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  const targetX = useRef(LANE_X[lane]);
  const currentX = useRef(LANE_X[lane]);

  useFrame((_, delta) => {
    targetX.current = LANE_X[lane];
    const t = Math.min(1, delta / LANE_SWITCH_DURATION);
    currentX.current = THREE.MathUtils.lerp(
      currentX.current,
      targetX.current,
      t,
    );
    if (groupRef.current) {
      groupRef.current.position.x = currentX.current;
    }
  });

  return (
    <group ref={groupRef} position={[LANE_X[lane], PLAYER_Y, PLAYER_Z]}>
      <primitive
        object={carModel}
        scale={CAR_SCALE}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}
