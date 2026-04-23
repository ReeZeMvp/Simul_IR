import React from 'react'
import type { AppState, ComputeResult } from '@/engine/types'
import { STATUTS_LABELS } from '@/engine/bareme'
import { fmt } from '@/engine'
import SliderField from '../SetupPhase/fields/SliderField'

interface Props {
  state: AppState
  result: ComputeResult
  onBack: () => void
  onPacsToggle: () => void
  onLoyerChange: (v: number) => void
  onEnfantsChange: (v: number) => void
}

export default function Sidebar({ state, result, onBack, onPacsToggle, onLoyerChange, onEnfantsChange }: Props) {
  const { revA2026, revB2026 } = result
  const { A, B, pacsOn } = state

  return (
    <aside style={{
      width: 380, minWidth: 360, background: 'var(--surface)',
      borderRight: '1px solid var(--border-s)', overflowY: 'auto',
      padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        padding: '8px 20px', borderRadius: 'var(--r-s)', border: '1px solid var(--border)',
        background: 'var(--surface-2)', color: 'var(--text-m)', fontFamily: 'var(--font)',
        fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
        alignItems: 'center', gap: 6, transition: 'all .2s',
      }}>
        ← Modifier les profils
      </button>

      {/* PACS toggle */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 14, boxShadow: 'var(--shadow-s)' }}>
        <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-t)', marginBottom: 10 }}>
          Simulation PACS
        </div>
        <div
          onClick={onPacsToggle}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 'var(--r)',
            border: `2px solid ${pacsOn ? 'var(--primary)' : 'var(--border)'}`,
            background: pacsOn ? 'var(--primary-l)' : 'var(--surface)',
            cursor: 'pointer', transition: 'all .25s',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '.92rem' }}>{pacsOn ? 'PACS activé' : 'PACS désactivé'}</div>
            <div style={{ fontSize: '.72rem', color: pacsOn ? 'var(--primary)' : 'var(--text-m)', marginTop: 2 }}>
              {pacsOn ? 'Déclaration commune, 2 parts' : 'Déclarations séparées'}
            </div>
          </div>
          <div style={{
            width: 42, height: 22, borderRadius: 11,
            background: pacsOn ? 'var(--primary)' : 'var(--border)',
            position: 'relative', transition: 'background .25s',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: pacsOn ? 23 : 3,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.15)',
              transition: 'left .25s',
            }} />
          </div>
        </div>
      </div>

      {/* Profil summary */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 14, boxShadow: 'var(--shadow-s)' }}>
        <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-t)', marginBottom: 10 }}>
          Profils
        </div>
        <div style={{ fontSize: '.82rem', lineHeight: 1.7 }}>
          <strong>{A.name}</strong> : {STATUTS_LABELS[A.statut]}<br />
          Revenu net imposable 2026 : {fmt(revA2026)}<br />
          <strong>{B.name}</strong> : {STATUTS_LABELS[B.statut]}<br />
          Revenu net imposable 2026 : {fmt(revB2026)}
        </div>
      </div>

      {/* Quick adjustments */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 14, boxShadow: 'var(--shadow-s)' }}>
        <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-t)', marginBottom: 10 }}>
          Ajustements rapides
        </div>
        <SliderField
          label="Loyer"
          value={state.loyer}
          min={300} max={3000} step={25}
          onChange={onLoyerChange}
        />
        <div>
          <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Enfants à charge</div>
          <select value={state.nbEnfants} onChange={e => onEnfantsChange(+e.target.value)}>
            {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
    </aside>
  )
}
