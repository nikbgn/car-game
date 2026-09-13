import {
  SCROLL_SPEED_BASE,
  SCROLL_SPEED_MAX,
  SPEED_RAMP_PER_SECOND,
} from "./constants";

export function getScrollSpeed(elapsedSeconds: number): number {
  const ramped = SCROLL_SPEED_BASE + elapsedSeconds * SPEED_RAMP_PER_SECOND;
  return Math.min(SCROLL_SPEED_MAX, ramped);
}
