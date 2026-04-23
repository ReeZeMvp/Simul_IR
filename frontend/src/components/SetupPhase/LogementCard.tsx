import React from 'react'
import type { AppState } from '@/engine/types'
import { fmt } from '@/engine'
import SliderField from './fields/SliderField'

type LogementProps = Pick<AppState, 'loyer' | 'zone' | 'typeLogement' | 'nbEnfants'>

interface Props {
  values: LogementProps
  onChange: (updates: Partial<LogementProps>) => void
}

export default function LogementCard({ values, onChange }: Props) {
  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border-s)',
      borderRadius: 'var(--r-l)', padding: 20, boxShadow: 'var(--shadow-s)', marginTop: 20,
    }}>
      <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-t)', marginBottom: 12 }}>
        Logement du couple
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <SliderField
            label="Loyer mensuel"
            value={values.loyer}
            min={300} max={3000} step={25}
            onChange={v => onChange({ loyer: v })}
          />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Zone APL</div>
            <select value={values.zone} onChange={e => onChange({ zone: e.target.value as AppState['zone'] })}>
              <option value="A">Zone A (Île-de-France)</option>
              <option value="B1">Zone B1 (grandes agglo.)</option>
              <option value="B2">Zone B2 (villes moyennes)</option>
              <option value="C">Zone C (rural)</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Type de logement</div>
            <select value={values.typeLogement} onChange={e => onChange({ typeLogement: e.target.value as AppState['typeLogement'] })}>
              <option value="prive">Location privée</option>
              <option value="crous">Résidence CROUS</option>
              <option value="proprio">Propriétaires (pas d'APL)</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Enfants à charge (couple)</div>
            <select value={values.nbEnfants} onChange={e => onChange({ nbEnfants: +e.target.value })}>
              {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n === 4 ? '4+' : n}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
