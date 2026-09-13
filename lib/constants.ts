export const LANE_COUNT = 3;
export const LANE_X: readonly [number, number, number] = [-1.35, 0, 1.35];

export const SCROLL_SPEED_BASE = 8.5;
export const SCROLL_SPEED_MAX = 19;
/** +0.28 per second - clearly faster within ~15s, max speed around 37s */
export const SPEED_RAMP_PER_SECOND = 0.28;
/** @deprecated use getScrollSpeed() - kept for idle menu scroll */
export const SCROLL_SPEED = SCROLL_SPEED_BASE;
export const IDLE_SCROLL_SPEED = 2.2;
export const LANE_SWITCH_DURATION = 0.15;

export const PLAYER_Z = 0;
export const PLAYER_Y = 0.12;

/** Spawn inside visible band (closer camera = shorter range) */
export const SPAWN_Z = -22;
export const SPAWN_Z_VARIANCE = 2;
export const DESPAWN_Z = 18;
export const COLLISION_Z_THRESHOLD = 1.0;

export const ROAD_WIDTH = 4.6;
export const ROAD_HALF_WIDTH = ROAD_WIDTH / 2;
export const ROAD_SEGMENT_LENGTH = 4;
export const ROAD_SEGMENT_OVERLAP = 0.08;
export const ROAD_SEGMENT_COUNT = 36;
export const ROAD_Y = 0.005;
export const GROUND_Y = -0.01;

/** Full-width grass bed - fills screen edges when zoomed in */
export const GROUND_TOTAL_WIDTH = 6.2;

export const OBSTACLE_POOL_SIZE = 16;
export const COIN_POOL_SIZE = 20;

export const SPAWN_INTERVAL_MIN = 2.2;
export const SPAWN_INTERVAL_MAX = 3.2;
export const DOUBLE_OBSTACLE_CHANCE = 0.1;

export const COIN_POINTS = 10;
export const COIN_SPAWN_CHANCE = 0.5;

export const CAR_SCALE = 0.44;
export const OBSTACLE_SCALE = 0.58;

/** Close chase cam - road fills the screen like Subway Surfers */
export const CAMERA_OFFSET = { x: 0, y: 1.7, z: 2.15 };
export const CAMERA_LOOK_AT = { x: 0, y: 0.5, z: -5.5 };
export const CAMERA_FOV = 82;

export const SKY_COLOR = "#0e1520";
export const SKY_HORIZON_COLOR = "#1a2535";
/** Exponential fog - hides segment recycle / world edge */
export const FOG_DENSITY = 0.086;

/** Scrolling roadside props (trees, lamps, barriers) */
export const SCENERY_POOL_SIZE = 28;

export type GameStatus = "menu" | "playing" | "gameover";

export type ObstacleKind = "delivery" | "taxi" | "truck" | "cone";

export const OBSTACLE_KINDS: ObstacleKind[] = [
  "delivery",
  "taxi",
  "truck",
  "cone",
];
