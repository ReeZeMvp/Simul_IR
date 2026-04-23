import type { Tranche, ZoneAPL } from './types'

export const SMIC_MENSUEL = 1823.03
export const SMIC_NET_MENSUEL = 1426.30

export const BAREME_IR_2026: Tranche[] = [
  { max: 11497,    taux: 0.00 },
  { max: 29315,    taux: 0.11 },
  { max: 83823,    taux: 0.30 },
  { max: 180294,   taux: 0.41 },
  { max: Infinity, taux: 0.45 },
]

export const ABATT_MIN = 495
export const ABATT_MAX = 14171
export const ABATT_RETRAITE_MAX = 4321

export const PLAFOND_DEMI_PART = 1759

export const CSG_RATE = 0.097

export const PEE_CAP = 36045

export const FORFAIT_SEUL = 638.28
export const FORFAIT_COUPLE = 638.28 * 1.5

export const DECOTE_SEUL = { seuil: 1888, base: 858 }
export const DECOTE_COUPLE = { seuil: 3128, base: 1444 }

export const APL_CFG: Record<ZoneAPL, { p: number; cap: number }> = {
  A:  { p: 125, cap: 450 },
  B1: { p: 99,  cap: 380 },
  B2: { p: 89,  cap: 330 },
  C:  { p: 79,  cap: 280 },
}

export const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export const STATUTS_LABELS: Record<string, string> = {
  apprenti:  'Apprenti(e) / Alternant(e)',
  cdi:       'Salarié(e) CDI',
  cdd:       'Salarié(e) CDD',
  etudiant:  'Étudiant(e) sans revenu',
  freelance: 'Indépendant(e) / Freelance',
  chomage:   "Sans emploi / Demandeur d'emploi",
  retraite:  'Retraité(e)',
}
