export function calculateAgentStat(
  level: number,
  base: number,
  adv: number,
  growth: number,
  divisor: number
): number {
  return Math.floor(base + adv + ((level - 1) * growth) / (10000 / divisor));
}

export function calculateEngineSubstat(base: any, secondary_growth: any) {
  return (base * (1 + secondary_growth / 10000)).toFixed(1);
}
