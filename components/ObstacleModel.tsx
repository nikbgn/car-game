"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { ObstacleKind } from "@/lib/constants";
import { OBSTACLE_SCALE } from "@/lib/constants";

const MODEL_PATH: Record<ObstacleKind, string> = {
  delivery: "/models/obstacles/delivery.glb",
  taxi: "/models/obstacles/taxi.glb",
  truck: "/models/obstacles/truck.glb",
  cone: "/models/obstacles/cone.glb",
};

useGLTF.preload(MODEL_PATH.delivery);
useGLTF.preload(MODEL_PATH.taxi);
useGLTF.preload(MODEL_PATH.truck);
useGLTF.preload(MODEL_PATH.cone);

type ObstacleModelProps = {
  kind: ObstacleKind;
};

export function ObstacleModel({ kind }: ObstacleModelProps) {
  const { scene } = useGLTF(MODEL_PATH[kind]);
  const model = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  const y = kind === "cone" ? 0.05 : 0.14;
  const scale = kind === "cone" ? OBSTACLE_SCALE * 0.92 : OBSTACLE_SCALE;

  return (
    <primitive
      object={model}
      scale={scale}
      position={[0, y, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
