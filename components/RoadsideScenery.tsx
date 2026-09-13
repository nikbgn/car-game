"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  DESPAWN_Z,
  GROUND_TOTAL_WIDTH,
  ROAD_HALF_WIDTH,
  ROAD_SEGMENT_LENGTH,
  ROAD_SEGMENT_OVERLAP,
  SCENERY_POOL_SIZE,
} from "@/lib/constants";

type SceneryKind = "tree" | "bush" | "lamp" | "barrier";

type ScenerySlot = {
  active: boolean;
  kind: SceneryKind;
  side: -1 | 1;
  z: number;
  scale: number;
};

type RoadsideSceneryProps = {
  scrollSpeed: number;
  speedRef?: React.RefObject<number>;
};

const step = ROAD_SEGMENT_LENGTH - ROAD_SEGMENT_OVERLAP;
const SHOULDER_CENTER_X = ROAD_HALF_WIDTH + (GROUND_TOTAL_WIDTH - ROAD_HALF_WIDTH * 2) * 0.42;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickKind(rng: () => number): SceneryKind {
  const roll = rng();
  if (roll < 0.42) return "tree";
  if (roll < 0.68) return "bush";
  if (roll < 0.84) return "lamp";
  return "barrier";
}

function Tree({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.42, 6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <coneGeometry args={[0.28, 0.72, 7]} />
        <meshStandardMaterial color="#2a6b38" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <coneGeometry args={[0.2, 0.45, 7]} />
        <meshStandardMaterial color="#358a47" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Bush({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#3d8f4a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.14, 0.1, 0.05]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#469a52" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.12, 0.08, -0.04]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#3a8446" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Lamp({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 1.1, 6]} />
        <meshStandardMaterial color="#6a6a72" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.12, 1.05, 0]} rotation={[0, 0, -Math.PI / 2.8]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.35, 6]} />
        <meshStandardMaterial color="#6a6a72" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.28, 1.02, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color="#fff4d0"
          emissive="#ffcc66"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Barrier({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.36, 0.7]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.72]} />
        <meshStandardMaterial color="#e8a020" roughness={0.5} />
      </mesh>
    </group>
  );
}

function SceneryProp({ kind, scale }: { kind: SceneryKind; scale: number }) {
  switch (kind) {
    case "tree":
      return <Tree scale={scale} />;
    case "bush":
      return <Bush scale={scale} />;
    case "lamp":
      return <Lamp scale={scale} />;
    case "barrier":
      return <Barrier scale={scale} />;
  }
}

function createPool(): ScenerySlot[] {
  const pool: ScenerySlot[] = [];
  const spacing = step * 1.15;

  for (let i = 0; i < SCENERY_POOL_SIZE; i++) {
    const rng = mulberry32(i * 7919 + 13);
    const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
    pool.push({
      active: true,
      kind: pickKind(rng),
      side,
      z: -i * spacing - rng() * 1.5,
      scale: 0.85 + rng() * 0.45,
    });
  }

  return pool;
}

export function RoadsideScenery({ scrollSpeed, speedRef }: RoadsideSceneryProps) {
  const pool = useMemo(() => createPool(), []);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, delta) => {
    const speed = speedRef?.current ?? scrollSpeed;
    if (speed <= 0) return;

    let minZ = Infinity;
    for (let i = 0; i < pool.length; i++) {
      pool[i].z += speed * delta;
      minZ = Math.min(minZ, pool[i].z);

      const group = groupRefs.current[i];
      if (group) {
        group.position.set(
          pool[i].side * SHOULDER_CENTER_X,
          0,
          pool[i].z,
        );
        group.visible = true;
      }
    }

    for (let i = 0; i < pool.length; i++) {
      if (pool[i].z > DESPAWN_Z) {
        const rng = mulberry32(i * 7919 + Math.floor(minZ * 100));
        pool[i].z = minZ - step * (0.8 + rng() * 0.6);
        pool[i].kind = pickKind(rng);
        pool[i].side = rng() > 0.5 ? 1 : -1;
        pool[i].scale = 0.85 + rng() * 0.45;
        minZ = Math.min(minZ, pool[i].z);
      }
    }
  });

  return (
    <group>
      {pool.map((slot, index) => (
        <group
          key={index}
          ref={(node) => {
            groupRefs.current[index] = node;
          }}
          position={[slot.side * SHOULDER_CENTER_X, 0, slot.z]}
        >
          <SceneryProp kind={slot.kind} scale={slot.scale} />
        </group>
      ))}
    </group>
  );
}
