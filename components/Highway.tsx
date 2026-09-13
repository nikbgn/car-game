"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import {
  DESPAWN_Z,
  GROUND_TOTAL_WIDTH,
  GROUND_Y,
  ROAD_SEGMENT_COUNT,
  ROAD_SEGMENT_LENGTH,
  ROAD_SEGMENT_OVERLAP,
  ROAD_WIDTH,
  ROAD_Y,
} from "@/lib/constants";

type HighwayProps = {
  scrollSpeed: number;
  speedRef?: React.RefObject<number>;
};

const step = ROAD_SEGMENT_LENGTH - ROAD_SEGMENT_OVERLAP;
const segLen = ROAD_SEGMENT_LENGTH + ROAD_SEGMENT_OVERLAP;
const LANE_LINE_LEFT = -0.675;
const LANE_LINE_RIGHT = 0.675;
const laneLineX = [LANE_LINE_LEFT, LANE_LINE_RIGHT] as const;

function RoadSegment({ index }: { index: number }) {
  return (
    <group position={[0, 0, -index * step]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} receiveShadow>
        <planeGeometry args={[GROUND_TOTAL_WIDTH, segLen]} />
        <meshStandardMaterial color="#3d9145" roughness={0.95} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROAD_Y, 0]} receiveShadow>
        <planeGeometry args={[ROAD_WIDTH, segLen]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.88} metalness={0.05} />
      </mesh>

      {laneLineX.map((x) => (
        <mesh
          key={x}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, ROAD_Y + 0.012, 0]}
        >
          <planeGeometry args={[0.055, segLen]} />
          <meshStandardMaterial
            color="#f0f0f0"
            emissive="#d8d8d8"
            emissiveIntensity={0.2}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Highway({ scrollSpeed, speedRef }: HighwayProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const speed = speedRef?.current ?? scrollSpeed;
    if (speed <= 0 || !groupRef.current) return;

    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      children[i].position.z += speed * delta;
    }

    let minZ = Infinity;
    for (let i = 0; i < children.length; i++) {
      minZ = Math.min(minZ, children[i].position.z);
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.position.z > DESPAWN_Z) {
        child.position.z = minZ - step;
        minZ = child.position.z;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: ROAD_SEGMENT_COUNT }, (_, index) => (
        <RoadSegment key={index} index={index} />
      ))}
    </group>
  );
}
