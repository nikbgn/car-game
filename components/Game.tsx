"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "@/components/Scene";
import { CAMERA_FOV, CAMERA_OFFSET } from "@/lib/constants";

export function Game() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 1.5]}
      camera={{
        position: [CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z],
        fov: CAMERA_FOV,
        near: 0.1,
        far: 90,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
