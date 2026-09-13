import { SCROLL_SPEED_BASE } from "@/lib/constants";

let currentSpeed = SCROLL_SPEED_BASE;
const listeners = new Set<(speed: number) => void>();

export function getRunSpeed() {
  return currentSpeed;
}

export function setRunSpeed(speed: number) {
  currentSpeed = speed;
  listeners.forEach((listener) => listener(speed));
}

export function subscribeRunSpeed(listener: (speed: number) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSpeedMultiplier(speed: number) {
  return speed / SCROLL_SPEED_BASE;
}
