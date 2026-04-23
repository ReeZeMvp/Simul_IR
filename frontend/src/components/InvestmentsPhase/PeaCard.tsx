import React from 'react'
import type { PeaState } from '@/engine/types'
import { calcFiscalitePEA } from '@/engine'
import { fmt, fmtPct } from '@/engine'
import SliderField from '../SetupPhase/fields/SliderField'
import SwitchField from '../SetupPhase/fields/SwitchField'

interface Props {
  pea: PeaState
  onChange: (updates: Partial<PeaState>) => void
  annee?: number
}

export default function PeaCard({ pea, onChange, annee = 2026 }: Props) {
  const result = calcFiscalitePEA(pea, annee)

  const badgeStyle = (): React.CSSProperties => {
    if (result.statut === 'optimal') return { background: 'var(--success-l)', color: 'var(--success)', border: '1px solid var(--success)' }
    if (result.statut === 'bientot_optimal') return { background: 'var(--warning-l)', color: 'var(--warning-t)', border: '1px solid var(--warning-b)' }
    return { background: 'var(--error-l)', color: 'var(--error)', border: '1px solid var(--error)' }
  }

  const badge = result.statut === 'optimal'
    ? `✅ Optimal (≥ 5 ans) — exonéré IR`
    : result.statut === 'bientot_optimal'
    ? `⏳ ${5 - result.annees} an(s) restant(s) avant exonération`
    : `⚠️ < 5 ans : flat tax 30%`

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r-l)', padding: 20, boxShadow: 'var(--shadow-s)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: '.95rem', fontWeight: 700 }}>PEA — Plan d'Épargne en Actions</h3>
        <span style={{ ...badgeStyle(), fontSize: '.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
          {badge}
        </span>
      </div>

      <div style={{ background: 'var(--primary-l)', borderRadius: 'var(--r-s)', padding: '9px 12px', fontSize: '.78rem', color: 'var(--primary)', marginBottom: 16 }}>
        <strong>Fiscalité PEA :</strong> Exonéré d'IR après 5 ans (prélèvements sociaux 17,2% toujours dus).
        Plafond versements : 150 000 €.
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Date d'ouverture du PEA</div>
        <input
          type="date"
          value={pea.dateOuverture}
          onChange={e => onChange({ dateOuverture: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--r-s)', border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'var(--font)', fontSize: '.84rem', color: 'var(--text)', outline: 'none' }}
        />
      </div>

      <SliderField
        label="Montant total versé"
        value={pea.versementTotal}
        min={0} max={150000} step={1000}
        onChange={v => onChange({ versementTotal: v })}
        note="Plafond légal : 150 000 €"
      />
      <SliderField
        label="Valeur actuelle du portefeuille"
        value={pea.valeurActuelle}
        min={0} max={500000} step={1000}
        onChange={v => onChange({ valeurActuelle: v })}
      />

      <SwitchField
        label="Simuler un retrait cette année ?"
        value={pea.simulerRetrait}
        onChange={v => onChange({ simulerRetrait: v })}
      />
      {pea.simulerRetrait && (
        <SliderField
          label="Montant envisagé du retrait"
          value={pea.montantRetrait}
          min={0} max={pea.valeurActuelle} step={500}
          onChange={v => onChange({ montantRetrait: v })}
        />
      )}

      {/* Résultats PEA */}
      {result.plusValue > 0 && (
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Plus-value latente', value: fmt(result.plusValue) },
            { label: 'Taux effectif', value: fmtPct(result.tauxEffectif) },
            ...(result.exonereIR
              ? [{ label: 'Gain fiscal vs CTO', value: fmt(result.gainFiscalVs30Pct), highlight: true }]
              : []),
            ...(pea.simulerRetrait
              ? [{ label: 'Impôt si retrait', value: fmt(result.impotSiRetrait) }]
              : []),
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface)', borderRadius: 'var(--r-s)', padding: '10px 12px', border: '1px solid var(--border-s)' }}>
              <div style={{ fontSize: '.68rem', color: 'var(--text-t)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: (item as { highlight?: boolean }).highlight ? 'var(--success)' : 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
