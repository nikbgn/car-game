"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type CoinMeshProps = {
  position?: [number, number, number];
};

export function CoinMesh({ position = [0, 0, 0] }: CoinMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Y-up cylinder, rotated so the coin face points toward the player */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.55}
          metalness={1}
          roughness={0.12}
        />
      </mesh>
    </group>
  );
}
