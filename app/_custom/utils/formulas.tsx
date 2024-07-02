export function calculateAgentStat(
  level: number,
  base: number,
  adv: number,
  growth: number,
  divisor: number
): number {
  return Math.floor(base + adv + ((level - 1) * growth) / (10000 / divisor));
}
