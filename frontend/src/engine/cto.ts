import type { CtoState, CtoResult } from './types'

export function calcFiscaliteCTO(cto: CtoState, tmb: number): CtoResult {
  const pvNette = Math.max(0, cto.plusValuesBrutes - cto.moinsValuesCumul)

  if (!cto.optionBareme) {
    const impotPV = pvNette * 0.30
    const impotDiv = cto.dividendesBruts * 0.30
    return {
      regime: 'pfu',
      impotPV,
      impotDiv,
      totalImpot: impotPV + impotDiv,
      tauxEffectifPV: 0.30,
      tauxEffectifDiv: 0.30,
    }
  }

  // Option barème IR
  const divApresAbatt = cto.dividendesBruts * 0.60 // abattement 40%
  const impotPV = pvNette * (tmb + 0.172)
  const impotDiv = divApresAbatt * (tmb + 0.172)
  const totalBareme = impotPV + impotDiv
  const totalPfu = pvNette * 0.30 + cto.dividendesBruts * 0.30
  const economieVsPfu = totalPfu - totalBareme

  return {
    regime: 'bareme',
    impotPV,
    impotDiv,
    totalImpot: totalBareme,
    tauxEffectifPV: tmb + 0.172,
    tauxEffectifDiv: (tmb + 0.172) * 0.60,
    economieVsPfu,
    conseilOption: economieVsPfu > 0,
  }
}
