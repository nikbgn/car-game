"use client";

import { ASSET_CREDITS, PROCEDURAL_CREDITS } from "@/lib/assetCredits";

type AssetsCreditsProps = {
  open: boolean;
  onClose: () => void;
};

export function AssetsCredits({ open, onClose }: AssetsCreditsProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex items-end justify-center bg-black/60 px-4 pb-8 pt-16 sm:items-center sm:pb-0"
      onClick={onClose}
    >
      <div
        className="max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-slate-900/95 p-5 text-left text-white shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Assets Credits</h2>
        <p className="mt-1 text-sm text-white/70">
          Thank you to the creators who shared these assets under open licenses.
        </p>

        <ul className="mt-4 space-y-4">
          {ASSET_CREDITS.map((credit) => (
            <li key={credit.name} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-amber-300">{credit.name}</p>
              <p className="text-sm text-white/85">
                by {credit.author} · {credit.license}
              </p>
              <p className="mt-1 text-xs text-white/65">{credit.usedFor}</p>
              <a
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-sky-300 underline-offset-2 hover:underline"
              >
                {credit.url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-white/55">
          {PROCEDURAL_CREDITS[0]}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full border border-white/20 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
