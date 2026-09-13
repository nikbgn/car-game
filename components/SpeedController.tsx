"use client";

import { useFrame } from "@react-three/fiber";
import { SCROLL_SPEED_BASE } from "@/lib/constants";
import { setRunSpeed } from "@/lib/runSpeed";
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
      setRunSpeed(SCROLL_SPEED_BASE);
      return;
    }

    elapsedRef.current += delta;
    const nextSpeed = getScrollSpeed(elapsedRef.current);
    speedRef.current = nextSpeed;
    setRunSpeed(nextSpeed);
  });

  return null;
}
