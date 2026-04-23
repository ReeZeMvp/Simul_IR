import React from 'react'
import type { ComputeResult } from '@/engine/types'
import { fmt } from '@/engine'

interface Props {
  result: ComputeResult
  pacsOn: boolean
  nameA: string
  nameB: string
}

export default function KpiRow({ result, pacsOn, nameA, nameB }: Props) {
  const {
    irPacs2026, irSep2026, apl2026, aplCdiPhase,
    ppaApprentPhase, ppaCdiPhase, gain2026, partsPacs, partsSepA, partsSepB,
  } = result

  const activeIR = pacsOn ? irPacs2026 : irSep2026

  const kpis = [
    {
      label: 'IR 2026 (foyer)',
      icon: '🧾',
      value: activeIR,
      cls: activeIR === 0 ? 'success' : '',
      display: activeIR === 0 ? '0 € ✓' : fmt(activeIR),
      sub: activeIR === 0 ? 'Non imposable ✓' : pacsOn ? `${partsPacs} parts (PACS)` : `${partsSepA}+${partsSepB} parts`,
    },
    {
      label: 'APL / mois',
      icon: '🏠',
      value: apl2026,
      cls: apl2026 > 0 ? 'success' : 'neutral',
      display: fmt(apl2026),
      sub: aplCdiPhase !== apl2026 ? `${fmt(aplCdiPhase)}/m après CDI` : '',
    },
    {
      label: 'PPA / mois',
      icon: '💶',
      value: ppaApprentPhase,
      cls: ppaApprentPhase > 0 ? 'success' : 'neutral',
      display: fmt(ppaApprentPhase),
      sub: ppaCdiPhase !== ppaApprentPhase ? `${fmt(ppaCdiPhase)}/m phase CDI` : '',
    },
    {
      label: 'Gain PACS 2026',
      icon: '📈',
      value: gain2026,
      cls: gain2026 > 0 ? 'success' : gain2026 < 0 ? 'error' : 'neutral',
      display: (gain2026 > 0 ? '+' : '') + fmt(gain2026),
      sub: gain2026 > 0 ? "d'économie IR" : gain2026 === 0 ? 'Pas de différence' : 'Surcoût PACS',
    },
  ]

  const clsColors: Record<string, string> = {
    success: 'var(--success)',
    error: 'var(--error)',
    neutral: 'var(--text-m)',
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
            {k.icon} {k.label}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums lining-nums', color: clsColors[k.cls] }}>
            {k.display}
          </div>
          <div style={{ fontSize: '.7rem', color: 'var(--text-t)', marginTop: 2 }}>{k.sub}</div>
        </div>
      ))}
    </div>
  )
}
