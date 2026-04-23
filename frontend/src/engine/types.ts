export type Statut =
  | 'apprenti'
  | 'cdi'
  | 'cdd'
  | 'etudiant'
  | 'freelance'
  | 'chomage'
  | 'retraite'

export type ZoneAPL = 'A' | 'B1' | 'B2' | 'C'
export type TypeLogement = 'prive' | 'crous' | 'proprio'
export type MicroRegime = 'micro_service' | 'micro_vente' | 'reel'
export type InteressMode = 'percu' | 'pee'

export interface PersonState {
  name: string
  age: number
  statut: Statut
  // Apprenti
  apprentNet: number
  apprentMois: number
  apprentFinMois: number
  ensuiteCdi: boolean
  cdiType: 'cdi' | 'cdd'
  cdiBrut: number
  cdiDebut: number
  // CDI/CDD
  salBrut: number
  salDebut: number
  salFin: number
  // Freelance
  caAnnuel: number
  microRegime: MicroRegime
  netDeclare: number
  // Chomage
  chomMensuel: number
  chomMois: number
  // Retraite
  pensionBrut: number
  // Primes & épargne
  primeInteress: number
  interessMode: InteressMode
  primeParticip: number
  participMode: InteressMode
  primeExcep: number
  perVersement: number
  // Étudiant
  rattacheParents: boolean
  bourseCrous: boolean
}

export interface PeaState {
  dateOuverture: string
  versementTotal: number
  valeurActuelle: number
  simulerRetrait: boolean
  montantRetrait: number
}

export interface CtoState {
  plusValuesBrutes: number
  moinsValuesCumul: number
  dividendesBruts: number
  optionBareme: boolean
}

export interface AppState {
  A: PersonState
  B: PersonState
  loyer: number
  zone: ZoneAPL
  typeLogement: TypeLogement
  nbEnfants: number
  pacsOn: boolean
  pea: PeaState
  cto: CtoState
}

export interface Tranche {
  max: number
  taux: number
}

export interface ComputeResult {
  revA2026: number
  revB2026: number
  revA2027: number
  revB2027: number
  irSepA2026: number
  irSepB2026: number
  irSep2026: number
  irPacs2026: number
  irSepA2027: number
  irSepB2027: number
  irSep2027: number
  irPacs2027: number
  gain2026: number
  gain2027: number
  apl2026: number
  apl2027: number
  aplApprentPhase: number
  aplCdiPhase: number
  aplAnn2026: number
  ppaApprentPhase: number
  ppaCdiPhase: number
  ppaAnn2026: number
  ppa2027: number
  ndSep2026: number
  ndPacs2026: number
  ndSep2027: number
  ndPacs2027: number
  partsPacs: number
  partsSepA: number
  partsSepB: number
  monthlyA: number[]
  monthlyB: number[]
  // TMB du foyer PACS 2026 (pour conseil CTO)
  tmbPacs2026: number
}

export interface PeaResult {
  annees: number
  exonereIR: boolean
  plusValue: number
  tauxEffectif: number
  gainFiscalVs30Pct: number
  impotSiRetrait: number
  statut: 'optimal' | 'bientot_optimal' | 'immature'
}

export interface CtoResult {
  regime: 'pfu' | 'bareme'
  impotPV: number
  impotDiv: number
  totalImpot: number
  tauxEffectifPV: number
  tauxEffectifDiv: number
  economieVsPfu?: number
  conseilOption?: boolean
}
