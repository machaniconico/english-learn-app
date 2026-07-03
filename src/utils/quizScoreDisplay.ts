export function percentage(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function scoreBarColor(pct: number): string {
  return pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500';
}

export function scoreEmoji(pct: number): string {
  return pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
}
