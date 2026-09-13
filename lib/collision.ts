import { COLLISION_Z_THRESHOLD } from "./constants";

export function lanesOverlap(
  laneA: number,
  laneB: number,
  zA: number,
  zB: number,
): boolean {
  if (laneA !== laneB) return false;
  return Math.abs(zA - zB) < COLLISION_Z_THRESHOLD;
}
