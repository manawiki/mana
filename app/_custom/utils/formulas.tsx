export function calculateStat(
  level: number,
  base: number,
  adv: number,
  growth: number,
  divisor: number
): number {
  return Math.floor(base + adv + ((level - 1) * growth) / (10000 / divisor));
}

export function calculateEngineMainstat(base: number, level_growth: number, star_growth: number): number {
  return Math.floor(base * (level_growth / 10000 + 1 + star_growth / 10000));
}

export function calculateEngineSubstat(base: number, secondary_growth: number): number {
  return (base * (1 + secondary_growth / 10000)).toFixed(1);
}
