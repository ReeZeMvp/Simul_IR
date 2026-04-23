import type { AppState, ComputeResult } from './types'
import { getRevenuPro, getMonthlyNetPro } from './revenu'
import { calcIR, getTMB } from './ir'
import { calcAPL } from './apl'
import { calcPPA } from './ppa'

export { calcFiscalitePEA } from './pea'
export { calcFiscaliteCTO } from './cto'
export type { PeaResult, CtoResult } from './types'

export function compute(state: AppState): ComputeResult {
  const { A, B } = state
  const enfantParts = Math.min(state.nbEnfants, 4) * 0.5

  const isRetA = A.statut === 'retraite'
  const isRetB = B.statut === 'retraite'

  // Revenus nets imposables (après déduction PER)
  const revA2026 = Math.max(0, getRevenuPro(A, 2026) - A.perVersement)
  const revB2026 = Math.max(0, getRevenuPro(B, 2026) - B.perVersement)
  const revA2027 = Math.max(0, getRevenuPro(A, 2027) - A.perVersement)
  const revB2027 = Math.max(0, getRevenuPro(B, 2027) - B.perVersement)

  // Parts fiscales
  const partsA = A.statut === 'etudiant' && A.rattacheParents ? 0 : 1
  const partsB = B.statut === 'etudiant' && B.rattacheParents ? 0 : 1
  const partsPacs = 2 + enfantParts
  const partsSepA = partsA > 0 ? partsA + enfantParts : 0
  const partsSepB = partsB

  // ── Séparés ──────────────────────────────────────────────────────────────
  const irSepA2026 = partsA > 0
    ? calcIR(revA2026, Math.max(1, partsSepA), false, isRetA)
    : 0
  const irSepB2026 = partsB > 0
    ? calcIR(revB2026, Math.max(1, partsSepB), false, isRetB)
    : 0
  const irSep2026 = irSepA2026 + irSepB2026

  const irSepA2027 = partsA > 0
    ? calcIR(revA2027, Math.max(1, partsSepA), false, isRetA)
    : 0
  const irSepB2027 = partsB > 0
    ? calcIR(revB2027, Math.max(1, partsSepB), false, isRetB)
    : 0
  const irSep2027 = irSepA2027 + irSepB2027

  // ── PACS ─────────────────────────────────────────────────────────────────
  const revPacs2026 = revA2026 + revB2026
  const revPacs2027 = revA2027 + revB2027
  const irPacs2026 = calcIR(revPacs2026, partsPacs, true, isRetA || isRetB)
  const irPacs2027 = calcIR(revPacs2027, partsPacs, true, isRetA || isRetB)

  const gain2026 = irSep2026 - irPacs2026
  const gain2027 = irSep2027 - irPacs2027

  // ── APL ───────────────────────────────────────────────────────────────────
  const apl2026 = calcAPL(state.loyer, state.zone, state.typeLogement, revA2026 + revB2026)
  const apl2027 = calcAPL(state.loyer, state.zone, state.typeLogement, revA2027 + revB2027)
  const aplApprentPhase = calcAPL(state.loyer, state.zone, state.typeLogement, A.apprentNet * 12)
  const aplCdiPhase = calcAPL(
    state.loyer,
    state.zone,
    state.typeLogement,
    (A.ensuiteCdi ? A.cdiBrut * 0.78 : 0) + revB2026,
  )

  // ── PPA par mois ─────────────────────────────────────────────────────────
  const getPPAForMonth = (m: number) => {
    const netA = getMonthlyNetPro(A, m)
    const netB = getMonthlyNetPro(B, m)
    return calcPPA(netA + netB, netA, netB, true)
  }
  const ppaApprentPhase = getPPAForMonth(0)
  const ppaCdiPhase = A.statut === 'apprenti' && A.ensuiteCdi
    ? getPPAForMonth(11)
    : getPPAForMonth(6)
  const ppa2027 = calcPPA(
    (revA2027 + revB2027) / 12,
    revA2027 / 12,
    revB2027 / 12,
    true,
  )

  // ── Annualisation APL/PPA 2026 ────────────────────────────────────────────
  let aplAnn2026: number
  let ppaAnn2026: number
  if (A.statut === 'apprenti' && A.ensuiteCdi) {
    aplAnn2026 = aplApprentPhase * A.apprentMois + aplCdiPhase * (12 - A.apprentMois)
    ppaAnn2026 = Array.from({ length: 12 }, (_, m) => getPPAForMonth(m)).reduce(
      (a, b) => a + b,
      0,
    )
  } else {
    aplAnn2026 = apl2026 * 12
    ppaAnn2026 = ppaApprentPhase * 12
  }

  // ── Net disponible ────────────────────────────────────────────────────────
  const ndSep2026 = revA2026 + revB2026 - irSep2026 + aplAnn2026 + ppaAnn2026
  const ndPacs2026 = revA2026 + revB2026 - irPacs2026 + aplAnn2026 + ppaAnn2026
  const ndSep2027 = revA2027 + revB2027 - irSep2027 + apl2027 * 12 + ppa2027 * 12
  const ndPacs2027 = revA2027 + revB2027 - irPacs2027 + apl2027 * 12 + ppa2027 * 12

  // ── TMB foyer PACS 2026 (pour conseil CTO) ────────────────────────────────
  const tmbPacs2026 = getTMB(revPacs2026, partsPacs)

  // ── Données mensuelles (timeline) ────────────────────────────────────────
  const monthlyA = Array.from({ length: 12 }, (_, m) => getMonthlyNetPro(A, m))
  const monthlyB = Array.from({ length: 12 }, (_, m) => getMonthlyNetPro(B, m))

  return {
    revA2026, revB2026, revA2027, revB2027,
    irSepA2026, irSepB2026, irSep2026, irPacs2026,
    irSepA2027, irSepB2027, irSep2027, irPacs2027,
    gain2026, gain2027,
    apl2026, apl2027,
    aplApprentPhase, aplCdiPhase, aplAnn2026,
    ppaApprentPhase, ppaCdiPhase, ppaAnn2026, ppa2027,
    ndSep2026, ndPacs2026, ndSep2027, ndPacs2027,
    partsPacs, partsSepA, partsSepB,
    monthlyA, monthlyB,
    tmbPacs2026,
  }
}

export { getRevenuPro, getMonthlyNetPro }
export type { AppState, ComputeResult, PersonState, PeaState, CtoState } from './types'

export const fmt = (n: number): string =>
  n === 0
    ? '0 €'
    : new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(n))

export const fmtPct = (n: number): string =>
  !isFinite(n)
    ? '∞'
    : new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: 1,
      }).format(n)
