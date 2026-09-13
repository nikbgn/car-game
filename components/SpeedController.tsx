"use client";

import { useFrame } from "@react-three/fiber";
import { SCROLL_SPEED_BASE } from "@/lib/constants";
import { getScrollSpeed } from "@/lib/speed";

type SpeedControllerProps = {
  playing: boolean;
  speedRef: React.MutableRefObject<number>;
  elapsedRef: React.MutableRefObject<number>;
};

export function SpeedController({
  playing,
  speedRef,
  elapsedRef,
}: SpeedControllerProps) {
  useFrame((_, delta) => {
    if (!playing) {
      elapsedRef.current = 0;
      speedRef.current = SCROLL_SPEED_BASE;
      return;
    }

    elapsedRef.current += delta;
    speedRef.current = getScrollSpeed(elapsedRef.current);
  });

  return null;
}
