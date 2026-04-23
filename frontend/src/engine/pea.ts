import type { PeaState, PeaResult } from './types'

export function calcFiscalitePEA(pea: PeaState, anneeSimulation: number): PeaResult {
  const annees = anneeSimulation - new Date(pea.dateOuverture).getFullYear()
  const plusValue = Math.max(0, pea.valeurActuelle - pea.versementTotal)
  const exonereIR = annees >= 5

  const tauxIR = exonereIR ? 0 : 0.128
  const tauxPS = 0.172
  const tauxTotal = tauxIR + tauxPS

  const impotSiRetrait = pea.simulerRetrait && pea.valeurActuelle > 0
    ? Math.max(
        0,
        (pea.montantRetrait / pea.valeurActuelle) * plusValue * tauxTotal,
      )
    : 0

  const gainFiscalVs30Pct = exonereIR ? plusValue * 0.128 : 0

  let statut: PeaResult['statut']
  if (annees >= 5) statut = 'optimal'
  else if (annees >= 4) statut = 'bientot_optimal'
  else statut = 'immature'

  return {
    annees,
    exonereIR,
    plusValue,
    tauxEffectif: tauxTotal,
    gainFiscalVs30Pct,
    impotSiRetrait,
    statut,
  }
}
