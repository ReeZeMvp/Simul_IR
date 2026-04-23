import { SMIC_MENSUEL, CSG_RATE } from './bareme'
import type { PersonState } from './types'

export function getRevenuPro(p: PersonState, year: 2026 | 2027): number {
  const s = p.statut
  let net = 0

  if (s === 'apprenti') {
    if (year === 2026) {
      const apprentTotal = p.apprentNet * p.apprentMois
      const exo = SMIC_MENSUEL * p.apprentMois
      net += Math.max(0, apprentTotal - exo)
      if (p.ensuiteCdi) {
        const cdiMois = 12 - p.cdiDebut
        net += p.cdiBrut * 0.78 * (cdiMois / 12)
      }
    } else {
      if (p.ensuiteCdi) net += p.cdiBrut * 0.78
    }
  } else if (s === 'cdi' || s === 'cdd') {
    if (year === 2026) {
      const mois = p.salFin - p.salDebut + 1
      net += p.salBrut * 0.78 * (mois / 12)
    } else {
      net += p.salBrut * 0.78
    }
  } else if (s === 'etudiant') {
    net = 0
  } else if (s === 'freelance') {
    if (p.microRegime === 'reel') {
      net = p.netDeclare
    } else {
      const abatt = p.microRegime === 'micro_vente' ? 0.71 : 0.34
      net = p.caAnnuel * (1 - abatt)
    }
  } else if (s === 'chomage') {
    if (year === 2026) {
      net = p.chomMensuel * p.chomMois
    }
    // 2027 : plus de chômage supposé
  } else if (s === 'retraite') {
    // La pension brute = revenu fiscal (cotisations déduites par la caisse)
    net = p.pensionBrut * 12
  }

  // Primes taxables
  if (s !== 'etudiant') {
    if (p.primeInteress > 0 && p.interessMode === 'percu') {
      net += p.primeInteress * (1 - CSG_RATE)
    }
    if (p.primeParticip > 0 && p.participMode === 'percu') {
      net += p.primeParticip * (1 - CSG_RATE)
    }
    net += p.primeExcep
  }

  return net
}

export function getMonthlyNetPro(p: PersonState, month: number): number {
  const s = p.statut
  if (s === 'apprenti') {
    if (month < p.apprentMois) return p.apprentNet
    if (p.ensuiteCdi && month >= p.cdiDebut) return (p.cdiBrut * 0.78) / 12
    return 0
  }
  if (s === 'cdi' || s === 'cdd') {
    if (month >= p.salDebut && month <= p.salFin) return (p.salBrut * 0.78) / 12
    return 0
  }
  if (s === 'freelance') {
    const abatt = p.microRegime === 'micro_vente' ? 0.71 : 0.34
    const rev =
      p.microRegime === 'reel' ? p.netDeclare : p.caAnnuel * (1 - abatt)
    return rev / 12
  }
  if (s === 'chomage') {
    return month < p.chomMois ? p.chomMensuel : 0
  }
  if (s === 'retraite') return p.pensionBrut
  return 0
}
