const BEST_SCORE_KEY = "lane-rush-best-score";

export function getBestScore(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(BEST_SCORE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function saveBestScore(score: number): number {
  const current = getBestScore();
  if (score > current) {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    return score;
  }
  return current;
}
