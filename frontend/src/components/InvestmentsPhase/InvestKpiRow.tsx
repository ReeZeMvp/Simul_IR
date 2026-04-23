import React from 'react'
import type { PeaState, CtoState } from '@/engine/types'
import { calcFiscalitePEA, calcFiscaliteCTO } from '@/engine'
import { fmt, fmtPct } from '@/engine'

interface Props {
  pea: PeaState
  cto: CtoState
  tmb: number
  annee?: number
}

export default function InvestKpiRow({ pea, cto, tmb, annee = 2026 }: Props) {
  const peaResult = calcFiscalitePEA(pea, annee)
  const ctoResult = calcFiscaliteCTO(cto, tmb)

  const totalImpotPlacements = peaResult.impotSiRetrait + ctoResult.totalImpot
  const gainFiscalPeaVsCto = peaResult.gainFiscalVs30Pct

  const kpis = [
    {
      label: 'Impôt total placements',
      value: fmt(totalImpotPlacements),
      cls: totalImpotPlacements === 0 ? 'success' : '',
    },
    {
      label: 'Gain fiscal PEA vs CTO',
      value: gainFiscalPeaVsCto > 0 ? '+' + fmt(gainFiscalPeaVsCto) : fmt(0),
      cls: gainFiscalPeaVsCto > 0 ? 'success' : 'neutral',
    },
    {
      label: 'TMB foyer (PACS)',
      value: fmtPct(tmb),
      cls: 'primary',
    },
    {
      label: 'Conseil option IR (CTO)',
      value: ctoResult.regime === 'bareme'
        ? (ctoResult.conseilOption ? 'Oui ✅' : 'Non ⚠️')
        : 'Non calculé (PFU)',
      cls: ctoResult.conseilOption ? 'success' : 'neutral',
    },
  ]

  const clsColors: Record<string, string> = {
    success: 'var(--success)',
    error: 'var(--error)',
    neutral: 'var(--text-m)',
    primary: 'var(--primary)',
    '': 'var(--text)',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      {kpis.map((k, i) => (
        <div key={k.label} className={`fade-up d${i + 1}`} style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-s)',
          borderRadius: 'var(--r)', padding: '14px 16px', boxShadow: 'var(--shadow-s)',
        }}>
          <div style={{ fontSize: '.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-t)', marginBottom: 3 }}>
            {k.label}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: clsColors[k.cls] }}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  )
}
