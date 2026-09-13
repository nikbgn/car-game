"use client";

type LaneHintsProps = {
  visible: boolean;
};

export function LaneHints({ visible }: LaneHintsProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-between px-6 sm:bottom-12 sm:px-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 text-2xl text-white/80 backdrop-blur-sm sm:h-14 sm:w-14">
        ←
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 text-2xl text-white/80 backdrop-blur-sm sm:h-14 sm:w-14">
        →
      </div>
    </div>
  );
}
