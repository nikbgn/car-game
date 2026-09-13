"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";
import { ObstacleModel } from "@/components/ObstacleModel";
import type { ObstacleKind } from "@/lib/constants";

export type ObstacleEntity = {
  active: boolean;
  lane: number;
  z: number;
  kind: ObstacleKind;
};

type ObstacleSlotProps = {
  index: number;
  poolRef: React.RefObject<ObstacleEntity[]>;
  groupRef: React.MutableRefObject<(THREE.Group | null)[]>;
};

export function ObstacleSlot({ index, poolRef, groupRef }: ObstacleSlotProps) {
  const [visibleKind, setVisibleKind] = useState<ObstacleKind | null>(null);
  const lastKind = useRef<ObstacleKind | null>(null);
  const wasActive = useRef(false);

  useFrame(() => {
    const entity = poolRef.current[index];
    if (!entity) return;

    if (!entity.active) {
      if (wasActive.current) {
        wasActive.current = false;
        lastKind.current = null;
        setVisibleKind(null);
      }
      return;
    }

    wasActive.current = true;

    if (entity.kind !== lastKind.current) {
      lastKind.current = entity.kind;
      setVisibleKind(entity.kind);
    }
  });

  return (
    <group
      ref={(node) => {
        groupRef.current[index] = node;
      }}
      visible={visibleKind !== null}
    >
      {visibleKind !== null && <ObstacleModel kind={visibleKind} />}
    </group>
  );
}
