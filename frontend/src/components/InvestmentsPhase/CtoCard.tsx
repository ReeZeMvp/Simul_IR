import React from 'react'
import type { CtoState } from '@/engine/types'
import { calcFiscaliteCTO } from '@/engine'
import { fmt, fmtPct } from '@/engine'
import SliderField from '../SetupPhase/fields/SliderField'
import SwitchField from '../SetupPhase/fields/SwitchField'

interface Props {
  cto: CtoState
  onChange: (updates: Partial<CtoState>) => void
  tmb: number
}

export default function CtoCard({ cto, onChange, tmb }: Props) {
  const result = calcFiscaliteCTO(cto, tmb)

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r-l)', padding: 20, boxShadow: 'var(--shadow-s)' }}>
      <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 12 }}>CTO — Compte-Titres Ordinaire</h3>

      <div style={{ background: 'var(--warning-l)', border: '1px solid var(--warning-b)', borderRadius: 'var(--r-s)', padding: '9px 12px', fontSize: '.78rem', color: 'var(--warning-t)', marginBottom: 16 }}>
        <strong>Fiscalité CTO :</strong> PFU 30% par défaut (12,8% IR + 17,2% PS). Option barème IR possible
        si plus avantageux. Moins-values imputables 10 ans. Abattement 40% dividendes éligibles (option barème uniquement).
      </div>

      <SliderField
        label="Plus-values brutes réalisées"
        value={cto.plusValuesBrutes}
        min={0} max={100000} step={500}
        onChange={v => onChange({ plusValuesBrutes: v })}
      />
      <SliderField
        label="Stock de moins-values (10 ans)"
        value={cto.moinsValuesCumul}
        min={0} max={100000} step={500}
        onChange={v => onChange({ moinsValuesCumul: v })}
      />
      <SliderField
        label="Dividendes bruts perçus"
        value={cto.dividendesBruts}
        min={0} max={50000} step={500}
        onChange={v => onChange({ dividendesBruts: v })}
      />

      <SwitchField
        label="Option barème IR (au lieu du PFU 30%)"
        value={cto.optionBareme}
        onChange={v => onChange({ optionBareme: v })}
      />

      <div style={{ fontSize: '.72rem', color: 'var(--text-t)', marginBottom: 12 }}>
        TMB foyer (PACS 2026) : <strong>{fmtPct(tmb)}</strong>
      </div>

      {/* Résultats CTO */}
      <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Régime', value: result.regime === 'pfu' ? 'PFU 30%' : 'Barème IR' },
          { label: 'Impôt PV', value: fmt(result.impotPV) },
          { label: 'Impôt dividendes', value: fmt(result.impotDiv) },
          { label: 'Total impôt CTO', value: fmt(result.totalImpot) },
          ...(result.regime === 'bareme' && result.economieVsPfu !== undefined
            ? [{
                label: result.conseilOption ? '✅ Économie vs PFU' : '⚠️ Surcoût vs PFU',
                value: fmt(Math.abs(result.economieVsPfu)),
                highlight: result.conseilOption,
              }]
            : []),
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--surface)', borderRadius: 'var(--r-s)', padding: '10px 12px', border: '1px solid var(--border-s)' }}>
            <div style={{ fontSize: '.68rem', color: 'var(--text-t)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: (item as { highlight?: boolean }).highlight ? 'var(--success)' : 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {result.regime === 'bareme' && result.conseilOption !== undefined && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 'var(--r-s)',
          background: result.conseilOption ? 'var(--success-l)' : 'var(--warning-l)',
          border: `1px solid ${result.conseilOption ? 'var(--success)' : 'var(--warning-b)'}`,
          fontSize: '.8rem', color: result.conseilOption ? 'var(--success)' : 'var(--warning-t)',
          fontWeight: 600,
        }}>
          {result.conseilOption
            ? '✅ L\'option barème IR est avantageuse dans votre situation.'
            : '⚠️ Le PFU 30% reste plus avantageux dans votre situation.'}
        </div>
      )}
    </div>
  )
}
