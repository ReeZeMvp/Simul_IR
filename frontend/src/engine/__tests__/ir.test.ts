import { calcIRBareme, calcDecote, calcIR, calcAbattement } from '../ir'

describe('calcIRBareme', () => {
  it('revenu nul → 0', () => {
    expect(calcIRBareme(0)).toBe(0)
  })

  it('revenu sous première tranche → 0', () => {
    expect(calcIRBareme(10000)).toBe(0)
  })

  it('11 497 → 0 (seuil premier taux)', () => {
    expect(calcIRBareme(11497)).toBe(0)
  })

  it('29 315 → tranche 11%', () => {
    // (29315 - 11497) * 0.11 = 1959.98
    expect(calcIRBareme(29315)).toBeCloseTo(1959.98, 1)
  })
})

describe('calcDecote', () => {
  it('IR = 0 → décote maximale (seul)', () => {
    expect(calcDecote(0, false)).toBe(858)
  })

  it('IR ≥ seuil seul → pas de décote', () => {
    expect(calcDecote(1888, false)).toBe(0)
  })

  it('IR = 0 → décote maximale (couple)', () => {
    expect(calcDecote(0, true)).toBe(1444)
  })

  it('IR ≥ seuil couple → pas de décote', () => {
    expect(calcDecote(3128, true)).toBe(0)
  })
})

describe('calcAbattement', () => {
  it('revenu 0 → abattement minimum', () => {
    expect(calcAbattement(0, false)).toBe(495)
  })

  it('revenu 50000 → 10% = 5000', () => {
    expect(calcAbattement(50000, false)).toBe(5000)
  })

  it('revenu 200000 → plafonné à 14171', () => {
    expect(calcAbattement(200000, false)).toBe(14171)
  })

  it('retraite revenu 60000 → plafonné à 4321', () => {
    expect(calcAbattement(60000, true)).toBe(4321)
  })
})

describe('calcIR — cas de référence', () => {
  it('étudiant sans revenu → 0', () => {
    expect(calcIR(0, 1, false, false)).toBe(0)
  })

  it('apprenti sous SMIC annuel → 0 ou très faible', () => {
    // 1823.03 * 9 mois ≈ 16407 brut → exo → revenu taxable ≈ 0
    const ir = calcIR(0, 1, false, false)
    expect(ir).toBe(0)
  })
})
