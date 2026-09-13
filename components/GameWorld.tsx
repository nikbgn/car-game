"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { CoinMesh } from "@/components/CoinMesh";
import { ObstacleSlot, type ObstacleEntity } from "@/components/ObstacleSlot";
import {
  COIN_POOL_SIZE,
  COIN_SPAWN_CHANCE,
  DESPAWN_Z,
  DOUBLE_OBSTACLE_CHANCE,
  LANE_X,
  OBSTACLE_POOL_SIZE,
  PLAYER_Z,
  PLAYER_Y,
  SPAWN_INTERVAL_MAX,
  SPAWN_INTERVAL_MIN,
  SPAWN_Z,
  SPAWN_Z_VARIANCE,
  type ObstacleKind,
} from "@/lib/constants";
import { lanesOverlap } from "@/lib/collision";
import { INITIAL_LAYOUT } from "@/lib/initialLayout";
import {
  pickFreeLane,
  pickObstacleLanes,
  randomObstacleKind,
  randomSpawnInterval,
} from "@/lib/spawner";

type CoinEntity = {
  active: boolean;
  lane: number;
  z: number;
};

type GameWorldProps = {
  playing: boolean;
  lane: number;
  speedRef: React.RefObject<number>;
  onCoin: () => void;
  onCrash: () => void;
};

function createObstaclePool(): ObstacleEntity[] {
  return Array.from({ length: OBSTACLE_POOL_SIZE }, () => ({
    active: false,
    lane: 0,
    z: SPAWN_Z,
    kind: "delivery" as ObstacleKind,
  }));
}

function createCoinPool(): CoinEntity[] {
  return Array.from({ length: COIN_POOL_SIZE }, () => ({
    active: false,
    lane: 0,
    z: SPAWN_Z,
  }));
}

export function GameWorld({
  playing,
  lane,
  speedRef,
  onCoin,
  onCrash,
}: GameWorldProps) {
  const obstacles = useRef(createObstaclePool());
  const coins = useRef(createCoinPool());
  const obstacleGroups = useRef<(THREE.Group | null)[]>([]);
  const coinGroups = useRef<(THREE.Group | null)[]>([]);
  const spawnTimer = useRef(0);
  const crashed = useRef(false);
  const obstacleCursor = useRef(0);
  const coinCursor = useRef(0);

  const acquireObstacle = () => {
    const pool = obstacles.current;
    for (let i = 0; i < pool.length; i++) {
      const idx = (obstacleCursor.current + i) % pool.length;
      if (!pool[idx].active) {
        obstacleCursor.current = (idx + 1) % pool.length;
        return pool[idx];
      }
    }
    return null;
  };

  const acquireCoin = () => {
    const pool = coins.current;
    for (let i = 0; i < pool.length; i++) {
      const idx = (coinCursor.current + i) % pool.length;
      if (!pool[idx].active) {
        coinCursor.current = (idx + 1) % pool.length;
        return pool[idx];
      }
    }
    return null;
  };

  const seedInitialLayout = useCallback(() => {
    for (const row of INITIAL_LAYOUT) {
      for (const laneIdx of row.obstacleLanes) {
        const slot = acquireObstacle();
        if (!slot) break;
        slot.active = true;
        slot.lane = laneIdx;
        slot.z = row.z;
        slot.kind = row.kind ?? randomObstacleKind();
      }
      if (row.coinLane !== null) {
        const coinSlot = acquireCoin();
        if (coinSlot) {
          coinSlot.active = true;
          coinSlot.lane = row.coinLane;
          coinSlot.z = row.z - 0.5;
        }
      }
    }
  }, []);

  const resetPools = useCallback(() => {
    obstacles.current.forEach((o) => {
      o.active = false;
    });
    coins.current.forEach((c) => {
      c.active = false;
    });
    spawnTimer.current = randomSpawnInterval(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_MAX,
    );
    crashed.current = false;
    obstacleCursor.current = 0;
    coinCursor.current = 0;
    seedInitialLayout();
  }, [seedInitialLayout]);

  useEffect(() => {
    if (playing) {
      resetPools();
    }
  }, [playing, resetPools]);

  const spawnWave = () => {
    const useDouble = Math.random() < DOUBLE_OBSTACLE_CHANCE;
    const blockedLanes = pickObstacleLanes(useDouble ? 2 : 1);

    for (const blockedLane of blockedLanes) {
      const slot = acquireObstacle();
      if (!slot) break;
      slot.active = true;
      slot.lane = blockedLane;
      slot.z = SPAWN_Z - Math.random() * SPAWN_Z_VARIANCE;
      slot.kind = randomObstacleKind();
    }

    if (Math.random() < COIN_SPAWN_CHANCE) {
      const coinLane = pickFreeLane(blockedLanes);
      const coinSlot = acquireCoin();
      if (coinLane !== null && coinSlot) {
        coinSlot.active = true;
        coinSlot.lane = coinLane;
        coinSlot.z = SPAWN_Z - 1 - Math.random() * SPAWN_Z_VARIANCE;
      }
    }
  };

  useFrame((_, delta) => {
    if (!playing) return;
    if (crashed.current) return;

    const speed = speedRef.current;

    spawnTimer.current -= delta;
    if (spawnTimer.current <= 0) {
      spawnWave();
      spawnTimer.current = randomSpawnInterval(
        SPAWN_INTERVAL_MIN,
        SPAWN_INTERVAL_MAX,
      );
    }

    for (let i = 0; i < obstacles.current.length; i++) {
      const obstacle = obstacles.current[i];
      const group = obstacleGroups.current[i];
      if (!obstacle.active) {
        if (group) group.visible = false;
        continue;
      }

      obstacle.z += speed * delta;
      if (group) {
        group.visible = true;
        group.position.set(LANE_X[obstacle.lane], 0, obstacle.z);
      }

      if (lanesOverlap(lane, obstacle.lane, PLAYER_Z, obstacle.z)) {
        crashed.current = true;
        onCrash();
        return;
      }

      if (obstacle.z > DESPAWN_Z) {
        obstacle.active = false;
      }
    }

    for (let i = 0; i < coins.current.length; i++) {
      const coin = coins.current[i];
      const group = coinGroups.current[i];
      if (!coin.active) {
        if (group) group.visible = false;
        continue;
      }

      coin.z += speed * delta;
      if (group) {
        group.visible = true;
        group.position.set(LANE_X[coin.lane], PLAYER_Y + 0.7, coin.z);
      }

      if (lanesOverlap(lane, coin.lane, PLAYER_Z, coin.z)) {
        coin.active = false;
        onCoin();
      }

      if (coin.z > DESPAWN_Z) {
        coin.active = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: OBSTACLE_POOL_SIZE }, (_, index) => (
        <ObstacleSlot
          key={`obstacle-slot-${index}`}
          index={index}
          poolRef={obstacles}
          groupRef={obstacleGroups}
        />
      ))}
      {coins.current.map((_, index) => (
        <group
          key={`coin-${index}`}
          ref={(node) => {
            coinGroups.current[index] = node;
          }}
          visible={false}
        >
          <CoinMesh />
        </group>
      ))}
    </group>
  );
}
