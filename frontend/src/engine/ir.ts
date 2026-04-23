import {
  BAREME_IR_2026,
  ABATT_MIN,
  ABATT_MAX,
  ABATT_RETRAITE_MAX,
  PLAFOND_DEMI_PART,
  DECOTE_SEUL,
  DECOTE_COUPLE,
} from './bareme'

export function calcAbattement(net: number, isRetraite: boolean): number {
  if (isRetraite) {
    return Math.min(ABATT_RETRAITE_MAX, Math.max(ABATT_MIN, net * 0.10))
  }
  return Math.min(ABATT_MAX, Math.max(ABATT_MIN, net * 0.10))
}

export function calcIRBareme(ri: number): number {
  let impot = 0
  let prev = 0
  for (const t of BAREME_IR_2026) {
    const tx = Math.min(ri, t.max) - prev
    if (tx > 0) impot += tx * t.taux
    prev = t.max
    if (ri <= t.max) break
  }
  return impot
}

export function calcDecote(ir: number, isCouple: boolean): number {
  const cfg = isCouple ? DECOTE_COUPLE : DECOTE_SEUL
  if (ir < cfg.seuil) {
    return Math.max(0, cfg.base - 0.4545 * ir)
  }
  return 0
}

export function calcIR(
  revenuNet: number,
  parts: number,
  isCouple: boolean,
  isRetraite: boolean,
): number {
  const abatt = calcAbattement(revenuNet, isRetraite)
  const ri = Math.max(0, revenuNet - abatt)
  const quotient = ri / parts
  const irParPart = calcIRBareme(quotient)
  let irBrut = irParPart * parts

  // Plafonnement du quotient familial
  if (parts > 1) {
    const irRef = calcIRBareme(ri)
    const avantage = irRef - irBrut
    const plafond = (parts - 1) * 2 * PLAFOND_DEMI_PART
    if (avantage > plafond) irBrut = irRef - plafond
  }

  const decote = calcDecote(irBrut, isCouple)
  return Math.max(0, Math.round(irBrut - decote))
}

export function getTMB(revenuImposable: number, parts: number): number {
  const ri = Math.max(0, revenuImposable - Math.min(ABATT_MAX, Math.max(ABATT_MIN, revenuImposable * 0.10)))
  const quotient = ri / parts
  for (const t of BAREME_IR_2026) {
    if (quotient <= t.max) return t.taux
  }
  return 0.45
}
