import { FORFAIT_SEUL, FORFAIT_COUPLE } from './bareme'

export function calcPPA(
  monthlyNetFoyer: number,
  monthlyNetProA: number,
  monthlyNetProB: number,
  isCouple: boolean,
): number {
  const forfait = isCouple ? FORFAIT_COUPLE : FORFAIT_SEUL
  const bonA = monthlyNetProA >= 800 ? Math.min(198, (monthlyNetProA - 800) * 0.32) : 0
  const bonB = monthlyNetProB >= 800 ? Math.min(198, (monthlyNetProB - 800) * 0.32) : 0
  const ppa = forfait + bonA + bonB - 0.808 * monthlyNetFoyer
  return Math.max(0, Math.round(ppa))
}
