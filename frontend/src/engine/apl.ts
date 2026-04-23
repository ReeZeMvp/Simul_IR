import { APL_CFG } from './bareme'
import type { ZoneAPL, TypeLogement } from './types'

export function calcAPL(
  loyer: number,
  zone: ZoneAPL,
  typeLogement: TypeLogement,
  annualRes: number,
): number {
  if (typeLogement === 'proprio') return 0
  const cfg = APL_CFG[zone]
  const mensRes = annualRes / 12
  return Math.max(0, Math.min(cfg.cap, Math.round(loyer - cfg.p - 0.30 * mensRes)))
}
