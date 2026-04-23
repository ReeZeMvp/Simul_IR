import React from 'react'
import type { PersonState } from '@/engine/types'
import type { ComputeResult } from '@/engine/types'
import { MOIS_NOMS } from '@/engine/bareme'
import { fmt } from '@/engine'

interface Props {
  personA: PersonState
  result: ComputeResult
}

export default function TimelineCard({ personA: A, result }: Props) {
  if (A.statut !== 'apprenti' || !A.ensuiteCdi) return null

  const { aplApprentPhase, aplCdiPhase, ppaApprentPhase, ppaCdiPhase } = result
  const moisFin = MOIS_NOMS[A.cdiDebut] ?? 'Octobre'

  const phaseStyle = (variant: 'before' | 'after'): React.CSSProperties => ({
    padding: 14,
    borderRadius: 'var(--r-s)',
    border: '1px solid var(--border-s)',
    background: variant === 'before'
      ? 'color-mix(in srgb,var(--warning) 6%,var(--surface-2))'
      : 'var(--primary-l)',
  })

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', padding: '3px 0' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 18, boxShadow: 'var(--shadow-s)' }}>
      <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: 14 }}>
        Ce qui change en {moisFin} 2026
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={phaseStyle('before')}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--warning)', marginBottom: 8 }}>
            Apprentissage ({A.apprentMois} mois)
          </div>
          <Row label="Salaire net/mois" value={fmt(A.apprentNet)} />
          <Row label="APL estimée/mois" value={fmt(aplApprentPhase)} />
          <Row label="PPA estimée/mois" value={fmt(ppaApprentPhase)} />
        </div>
        <div style={phaseStyle('after')}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--primary)', marginBottom: 8 }}>
            CDI à partir de {moisFin}
          </div>
          <Row label="Salaire net/mois" value={fmt((A.cdiBrut * 0.78) / 12)} />
          <Row label="APL estimée/mois" value={fmt(aplCdiPhase)} />
          <Row label="PPA estimée/mois" value={fmt(ppaCdiPhase)} />
        </div>
      </div>
    </div>
  )
}
