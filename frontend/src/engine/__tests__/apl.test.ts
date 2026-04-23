import { calcAPL } from '../apl'

describe('calcAPL', () => {
  it('proprio → toujours 0', () => {
    expect(calcAPL(900, 'A', 'proprio', 30000)).toBe(0)
  })

  it('loyer 900, zone A, revenus 0 → plafonné à 450', () => {
    expect(calcAPL(900, 'A', 'prive', 0)).toBe(450)
  })

  it('revenus élevés → 0', () => {
    expect(calcAPL(900, 'A', 'prive', 200000)).toBe(0)
  })

  it('loyer faible → 0 si loyer < p (seuil zone)', () => {
    // Zone A, p=125. Loyer 100 → 100 - 125 - 0 = négatif → 0
    expect(calcAPL(100, 'A', 'prive', 0)).toBe(0)
  })
})
