import { calcPPA } from '../ppa'

describe('calcPPA', () => {
  it('revenu nul → forfait seul', () => {
    // FORFAIT_SEUL = 638.28, bonA/bonB = 0 (< 800), PPA = 638.28 - 0 = 638.28
    expect(calcPPA(0, 0, 0, false)).toBe(638)
  })

  it('couple, revenus nuls → forfait couple', () => {
    // FORFAIT_COUPLE = 957.42
    expect(calcPPA(0, 0, 0, true)).toBe(957)
  })

  it('revenus très élevés → 0', () => {
    // Si mensuel foyer > 957.42 / 0.808 ≈ 1185
    expect(calcPPA(5000, 2500, 2500, true)).toBe(0)
  })
})
