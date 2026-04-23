import React from 'react'
import type { PersonState } from '@/engine/types'
import { SMIC_MENSUEL, MOIS_NOMS, STATUTS_LABELS } from '@/engine/bareme'
import { getRevenuPro } from '@/engine/revenu'
import { fmt } from '@/engine'
import SliderField from './fields/SliderField'
import SwitchField from './fields/SwitchField'
import ToggleGroup from './fields/ToggleGroup'

interface Props {
  who: 'A' | 'B'
  person: PersonState
  onChange: (updates: Partial<PersonState>) => void
}

const STATUTS = Object.entries(STATUTS_LABELS).map(([id, label]) => ({ id, label }))

const moisOptions = MOIS_NOMS.map((label, i) => ({ value: String(i), label }))

export default function PersonCard({ who, person: p, onChange }: Props) {
  const avatarBg = who === 'A' ? 'var(--primary)' : 'var(--gold)'

  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border-s)',
      borderRadius: 'var(--r-l)', padding: 20, boxShadow: 'var(--shadow-s)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-s)' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700,
          fontSize: '1rem', color: '#fff', background: avatarBg,
        }}>
          {who}
        </div>
        <div>
          <input
            value={p.name}
            maxLength={15}
            onChange={e => onChange({ name: e.target.value })}
            style={{
              fontSize: '1.1rem', fontWeight: 700, border: 'none', background: 'none',
              color: 'var(--text)', fontFamily: 'var(--font)', width: 120, outline: 'none',
              borderBottom: '2px dashed var(--border)',
            }}
          />
          <div style={{ fontSize: '.72rem', color: 'var(--text-t)' }}>Personne {who}</div>
        </div>
      </div>

      {/* Statut */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Statut</div>
        <select value={p.statut} onChange={e => onChange({ statut: e.target.value as PersonState['statut'] })}>
          {STATUTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* ── APPRENTI ── */}
      {p.statut === 'apprenti' && <>
        <div style={{ background: 'var(--primary-l)', borderRadius: 'var(--r-s)', padding: '9px 12px', fontSize: '.78rem', color: 'var(--primary)', border: '1px solid color-mix(in srgb,var(--primary) 15%,transparent)', marginBottom: 12 }}>
          <strong>Exonération IR apprenti :</strong> SMIC × nb mois = {fmt(SMIC_MENSUEL * p.apprentMois)}
        </div>
        <SliderField label="Salaire mensuel NET apprentissage" value={p.apprentNet} min={800} max={3000} step={10} onChange={v => onChange({ apprentNet: v })} />
        <SliderField label="Mois d'apprentissage en 2026" value={p.apprentMois} min={1} max={12} step={1} onChange={v => onChange({ apprentMois: v })} formatValue={v => String(v)} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Fin du contrat (mois)</div>
          <select value={p.apprentFinMois} onChange={e => onChange({ apprentFinMois: +e.target.value })}>
            {moisOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <SwitchField label="CDI/CDD ensuite ?" value={p.ensuiteCdi} onChange={v => onChange({ ensuiteCdi: v })} />
        {p.ensuiteCdi && (
          <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--primary-l)', marginTop: 8 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Type de contrat</div>
              <ToggleGroup
                options={[{ value: 'cdi', label: 'CDI' }, { value: 'cdd', label: 'CDD' }]}
                value={p.cdiType}
                onChange={v => onChange({ cdiType: v })}
              />
            </div>
            <SliderField label="Salaire brut annuel (CDI/CDD)" value={p.cdiBrut} min={20000} max={80000} step={1000} onChange={v => onChange({ cdiBrut: v })} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Mois de début</div>
              <select value={p.cdiDebut} onChange={e => onChange({ cdiDebut: +e.target.value })}>
                {moisOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </>}

      {/* ── CDI / CDD ── */}
      {(p.statut === 'cdi' || p.statut === 'cdd') && <>
        <SliderField label="Salaire brut annuel" value={p.salBrut} min={20000} max={100000} step={1000} onChange={v => onChange({ salBrut: v })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Début 2026</div>
            <select value={p.salDebut} onChange={e => onChange({ salDebut: +e.target.value })}>
              {moisOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Fin 2026</div>
            <select value={p.salFin} onChange={e => onChange({ salFin: +e.target.value })}>
              {moisOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      </>}

      {/* ── ÉTUDIANT ── */}
      {p.statut === 'etudiant' && <>
        <div style={{ background: 'var(--primary-l)', borderRadius: 'var(--r-s)', padding: '9px 12px', fontSize: '.78rem', color: 'var(--primary)', marginBottom: 12 }}>
          Revenus : <strong>0 €</strong> — la bourse CROUS n'est pas imposable.
        </div>
        <SwitchField label="Rattaché(e) fiscalement aux parents" value={p.rattacheParents} onChange={v => onChange({ rattacheParents: v })} />
        <SwitchField label="Bourse CROUS (informatif)" value={p.bourseCrous} onChange={v => onChange({ bourseCrous: v })} />
      </>}

      {/* ── FREELANCE ── */}
      {p.statut === 'freelance' && <>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
            <span>Chiffre d'affaires annuel</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{fmt(p.caAnnuel)}</span>
          </div>
          <input type="number" value={p.caAnnuel} min={0} onChange={e => onChange({ caAnnuel: +e.target.value })} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Régime fiscal</div>
          <ToggleGroup
            options={[
              { value: 'micro_service', label: 'Micro (services 34%)' },
              { value: 'micro_vente',   label: 'Micro (vente 71%)' },
              { value: 'reel',          label: 'Réel' },
            ]}
            value={p.microRegime}
            onChange={v => onChange({ microRegime: v })}
          />
        </div>
        {p.microRegime === 'reel' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Revenu net déclaré</div>
            <input type="number" value={p.netDeclare} min={0} onChange={e => onChange({ netDeclare: +e.target.value })} />
          </div>
        )}
      </>}

      {/* ── CHÔMAGE ── */}
      {p.statut === 'chomage' && <>
        <SliderField label="Allocations chômage (ARE) mensuelles" value={p.chomMensuel} min={0} max={4000} step={50} onChange={v => onChange({ chomMensuel: v })} />
        <SliderField label="Mois perçus en 2026" value={p.chomMois} min={1} max={12} step={1} onChange={v => onChange({ chomMois: v })} formatValue={v => String(v)} />
      </>}

      {/* ── RETRAITE ── */}
      {p.statut === 'retraite' && (
        <SliderField label="Pension mensuelle brute" value={p.pensionBrut} min={500} max={5000} step={50} onChange={v => onChange({ pensionBrut: v })} />
      )}

      {/* ── PRIMES & ÉPARGNE (tous sauf étudiant) ── */}
      {p.statut !== 'etudiant' && <>
        <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-t)', marginTop: 16, marginBottom: 12 }}>
          Primes &amp; Épargne
        </div>
        <SliderField label="Prime d'intéressement brut" value={p.primeInteress} min={0} max={15000} step={100} onChange={v => onChange({ primeInteress: v })} />
        {p.primeInteress > 0 && (
          <div style={{ marginBottom: 14 }}>
            <ToggleGroup
              options={[{ value: 'percu', label: 'Perçue' }, { value: 'pee', label: 'PEE/PER' }]}
              value={p.interessMode}
              onChange={v => onChange({ interessMode: v })}
            />
          </div>
        )}
        <SliderField label="Prime de participation brut" value={p.primeParticip} min={0} max={10000} step={100} onChange={v => onChange({ primeParticip: v })} />
        {p.primeParticip > 0 && (
          <div style={{ marginBottom: 14 }}>
            <ToggleGroup
              options={[{ value: 'percu', label: 'Perçue' }, { value: 'pee', label: 'PEE/PER' }]}
              value={p.participMode}
              onChange={v => onChange({ participMode: v })}
            />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)', marginBottom: 5 }}>Prime exceptionnelle / Bonus</div>
          <input type="number" value={p.primeExcep} min={0} onChange={e => onChange({ primeExcep: +e.target.value })} />
        </div>
        <SliderField
          label="Versements PER volontaires"
          value={p.perVersement}
          min={0} max={15000} step={500}
          onChange={v => onChange({ perVersement: v })}
          note={p.perVersement > 0
            ? `Plafond indicatif : ${fmt(Math.max(4637, getRevenuPro(p, 2026) * 0.10))} (10% revenu pro net, min 4 637 €)`
            : undefined}
        />
      </>}
    </div>
  )
}
