import { LANE_COUNT, type ObstacleKind } from "./constants";

const VEHICLE_KINDS: ObstacleKind[] = ["delivery", "taxi", "truck"];

export function randomObstacleKind(): ObstacleKind {
  if (Math.random() < 0.18) return "cone";
  return VEHICLE_KINDS[Math.floor(Math.random() * VEHICLE_KINDS.length)]!;
}

export function pickObstacleLanes(count: 1 | 2 = 1): number[] {
  if (count === 1) {
    return [Math.floor(Math.random() * LANE_COUNT)];
  }

  const lanes = new Set<number>();
  while (lanes.size < 2) {
    lanes.add(Math.floor(Math.random() * LANE_COUNT));
  }
  return Array.from(lanes);
}

export function pickFreeLane(blockedLanes: number[]): number | null {
  const free = Array.from({ length: LANE_COUNT }, (_, i) => i).filter(
    (lane) => !blockedLanes.includes(lane),
  );
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)]!;
}

export function randomSpawnInterval(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
