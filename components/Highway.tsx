"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import {
  DESPAWN_Z,
  GROUND_TOTAL_WIDTH,
  GROUND_Y,
  ROAD_HALF_WIDTH,
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
const SHOULDER_WIDTH = (GROUND_TOTAL_WIDTH - ROAD_WIDTH) / 2;
const DASH_LEN = 1.1;
const DASH_GAP = 0.75;
const DASH_WIDTH = 0.05;

function LaneDashes({ x, segmentLength }: { x: number; segmentLength: number }) {
  const dashes = useMemo(() => {
    const items: number[] = [];
    const cycle = DASH_LEN + DASH_GAP;
    const start = -segmentLength / 2 + DASH_LEN / 2;
    for (let z = start; z < segmentLength / 2; z += cycle) {
      items.push(z);
    }
    return items;
  }, [segmentLength]);

  return (
    <>
      {dashes.map((z) => (
        <mesh
          key={`${x}-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, ROAD_Y + 0.012, z]}
        >
          <planeGeometry args={[DASH_WIDTH, DASH_LEN]} />
          <meshStandardMaterial
            color="#f5f5f5"
            emissive="#e8e8e8"
            emissiveIntensity={0.25}
            roughness={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

function RoadSegment({ index }: { index: number }) {
  return (
    <group position={[0, 0, -index * step]}>
      {/* Grass bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} receiveShadow>
        <planeGeometry args={[GROUND_TOTAL_WIDTH, segLen]} />
        <meshStandardMaterial color="#2d6b38" roughness={0.95} />
      </mesh>

      {/* Darker grass strip along road edge */}
      {[-1, 1].map((side) => (
        <mesh
          key={`verge-${side}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (ROAD_HALF_WIDTH + SHOULDER_WIDTH * 0.35), GROUND_Y + 0.002, 0]}
          receiveShadow
        >
          <planeGeometry args={[SHOULDER_WIDTH * 0.55, segLen]} />
          <meshStandardMaterial color="#265c30" roughness={0.96} />
        </mesh>
      ))}

      {/* Asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROAD_Y, 0]} receiveShadow>
        <planeGeometry args={[ROAD_WIDTH, segLen]} />
        <meshStandardMaterial color="#2f2f33" roughness={0.82} metalness={0.08} />
      </mesh>

      {/* Road shoulders */}
      {[-1, 1].map((side) => (
        <mesh
          key={`shoulder-${side}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (ROAD_HALF_WIDTH - 0.12), ROAD_Y + 0.003, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.22, segLen]} />
          <meshStandardMaterial color="#3a3a3e" roughness={0.9} />
        </mesh>
      ))}

      {/* Solid edge lines */}
      {[-1, 1].map((side) => (
        <mesh
          key={`edge-${side}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (ROAD_HALF_WIDTH - 0.02), ROAD_Y + 0.014, 0]}
        >
          <planeGeometry args={[0.07, segLen]} />
          <meshStandardMaterial
            color="#f8f8f8"
            emissive="#e0e0e0"
            emissiveIntensity={0.3}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Dashed lane dividers */}
      {laneLineX.map((x) => (
        <LaneDashes key={x} x={x} segmentLength={segLen} />
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
