import type { ObstacleKind } from "./constants";

export type SeedRow = {
  z: number;
  obstacleLanes: number[];
  coinLane: number | null;
  kind?: ObstacleKind;
};

/** Wider spacing at run start - time to orient before first dodge */
export const INITIAL_LAYOUT: SeedRow[] = [
  { z: -7, obstacleLanes: [], coinLane: 1 },
  { z: -12, obstacleLanes: [2], coinLane: 0, kind: "taxi" },
  { z: -17, obstacleLanes: [0], coinLane: 2, kind: "delivery" },
  { z: -22, obstacleLanes: [1], coinLane: null, kind: "truck" },
];
