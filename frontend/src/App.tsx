import React, { useState, useMemo, useEffect } from 'react'
import type { AppState, PersonState } from './engine/types'
import { compute } from './engine'
import Header from './components/Header'
import PhaseBar, { type Phase } from './components/PhaseBar'
import PersonCard from './components/SetupPhase/PersonCard'
import LogementCard from './components/SetupPhase/LogementCard'
import Sidebar from './components/ResultsPhase/Sidebar'
import KpiRow from './components/ResultsPhase/KpiRow'
import ComparisonTable from './components/ResultsPhase/ComparisonTable'
import ChartsGrid from './components/ResultsPhase/ChartsGrid'
import VerdictCard from './components/ResultsPhase/VerdictCard'
import TimelineCard from './components/ResultsPhase/TimelineCard'
import PeaCard from './components/InvestmentsPhase/PeaCard'
import CtoCard from './components/InvestmentsPhase/CtoCard'
import InvestKpiRow from './components/InvestmentsPhase/InvestKpiRow'
import ComparisonChart from './components/InvestmentsPhase/ComparisonChart'

const defaultPerson = (name: string, statut: PersonState['statut']): PersonState => ({
  name,
  age: 24,
  statut,
  apprentNet: 1980,
  apprentMois: 9,
  apprentFinMois: 8,
  ensuiteCdi: true,
  cdiType: 'cdi',
  cdiBrut: 42000,
  cdiDebut: 9,
  salBrut: 35000,
  salDebut: 0,
  salFin: 11,
  caAnnuel: 40000,
  microRegime: 'micro_service',
  netDeclare: 20000,
  chomMensuel: 1200,
  chomMois: 12,
  pensionBrut: 1800,
  primeInteress: statut === 'apprenti' ? 5828 : 0,
  interessMode: 'pee',
  primeParticip: 0,
  participMode: 'pee',
  primeExcep: 0,
  perVersement: 0,
  rattacheParents: false,
  bourseCrous: false,
})

const initialState: AppState = {
  A: defaultPerson('Alex', 'apprenti'),
  B: { ...defaultPerson('Sam', 'etudiant'), ensuiteCdi: false },
  loyer: 900,
  zone: 'A',
  typeLogement: 'prive',
  nbEnfants: 0,
  pacsOn: true,
  pea: {
    dateOuverture: '2021-03-15',
    versementTotal: 20000,
    valeurActuelle: 27000,
    simulerRetrait: false,
    montantRetrait: 5000,
  },
  cto: {
    plusValuesBrutes: 3000,
    moinsValuesCumul: 0,
    dividendesBruts: 800,
    optionBareme: false,
  },
}

export default function App() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const [phase, setPhase] = useState<Phase>('setup')
  const [state, setState] = useState<AppState>(initialState)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const result = useMemo(() => compute(state), [state])

  const updateA = (updates: Partial<PersonState>) =>
    setState(s => ({ ...s, A: { ...s.A, ...updates } }))

  const updateB = (updates: Partial<PersonState>) =>
    setState(s => ({ ...s, B: { ...s.B, ...updates } }))

  const handlePhaseChange = (p: Phase) => {
    setPhase(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Notices computed from result + state
  const notices: { type: 'warning' | 'info'; text: string }[] = []
  if (state.A.statut === 'apprenti' && state.A.ensuiteCdi) {
    notices.push({ type: 'warning', text: "Changement de situation : pensez à déclarer votre prise de poste CDI/CDD à la CAF dans le mois suivant. Vos droits APL et PPA seront recalculés." })
  }
  if (result.apl2026 > 0 && result.aplCdiPhase === 0 && state.A.statut === 'apprenti' && state.A.ensuiteCdi) {
    notices.push({ type: 'warning', text: "L'APL sera probablement supprimée environ 3 mois après le début du CDI." })
  }
  if (state.B.statut === 'etudiant' && state.B.rattacheParents) {
    notices.push({ type: 'info', text: `${state.B.name} est rattaché(e) aux parents. Si leurs parents ne sont pas imposables, ce rattachement n'apporte aucun avantage fiscal.` })
  }
  if (state.loyer > 0 && result.revA2026 + result.revB2026 > 0) {
    const res = result.revA2026 + result.revB2026
    if (state.loyer > 0.45 * (res / 12)) {
      notices.push({ type: 'warning', text: "Le loyer semble élevé par rapport aux revenus du foyer (> 45% du net mensuel)." })
    }
  }

  // Gain montant pour le graphique comparaison investissements
  const gainMontant = Math.max(
    state.pea.valeurActuelle - state.pea.versementTotal,
    state.cto.plusValuesBrutes + state.cto.dividendesBruts,
    5000,
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header isDark={isDark} onThemeToggle={() => setIsDark(d => !d)} />
      <PhaseBar active={phase} onChange={handlePhaseChange} />

      {/* ─── PHASE 1 : SETUP ─────────────────────────────────────── */}
      {phase === 'setup' && (
        <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <PersonCard who="A" person={state.A} onChange={updateA} />
            <PersonCard who="B" person={state.B} onChange={updateB} />
          </div>
          <LogementCard
            values={{ loyer: state.loyer, zone: state.zone, typeLogement: state.typeLogement, nbEnfants: state.nbEnfants }}
            onChange={u => setState(s => ({ ...s, ...u }))}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => handlePhaseChange('results')}
              style={{
                padding: '14px 40px', borderRadius: 'var(--r)', border: 'none',
                background: 'var(--primary)', color: '#fff',
                fontFamily: 'var(--font)', fontSize: '.95rem', fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 12px color-mix(in srgb,var(--primary) 30%,transparent)',
                transition: 'all .25s',
              }}
            >
              Voir les résultats →
            </button>
          </div>
        </div>
      )}

      {/* ─── PHASE 2 : RESULTS ───────────────────────────────────── */}
      {phase === 'results' && (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 93px)' }}>
          <Sidebar
            state={state}
            result={result}
            onBack={() => handlePhaseChange('setup')}
            onPacsToggle={() => setState(s => ({ ...s, pacsOn: !s.pacsOn }))}
            onLoyerChange={v => setState(s => ({ ...s, loyer: v }))}
            onEnfantsChange={v => setState(s => ({ ...s, nbEnfants: v }))}
          />
          <main style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <KpiRow result={result} pacsOn={state.pacsOn} nameA={state.A.name} nameB={state.B.name} />

            {/* Notices */}
            {notices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notices.map((n, i) => (
                  <div key={i} style={{
                    background: n.type === 'info' ? 'var(--primary-l)' : 'var(--warning-l)',
                    border: `1px solid ${n.type === 'info' ? 'color-mix(in srgb,var(--primary) 20%,transparent)' : 'var(--warning-b)'}`,
                    borderRadius: 'var(--r)', padding: '11px 14px',
                    fontSize: '.8rem',
                    color: n.type === 'info' ? 'var(--primary)' : 'var(--warning-t)',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{ flexShrink: 0 }}>{n.type === 'info' ? 'ℹ️' : '⚠️'}</span>
                    <span>{n.text}</span>
                  </div>
                ))}
              </div>
            )}

            <ComparisonTable title={`Comparaison ${state.A.name} + ${state.B.name} — 2026`} result={result} year={2026} nameA={state.A.name} nameB={state.B.name} />
            <ComparisonTable title="Projection année pleine — 2027" result={result} year={2027} nameA={state.A.name} nameB={state.B.name} />

            <ChartsGrid result={result} personA={state.A} personB={state.B} isDark={isDark} pacsOn={state.pacsOn} />

            <VerdictCard result={result} />
            <TimelineCard personA={state.A} result={result} />

            <div style={{ textAlign: 'center', padding: '20px 16px', fontSize: '.7rem', color: 'var(--text-t)', borderTop: '1px solid var(--border-s)', lineHeight: 1.6 }}>
              🇫🇷 Simulateur indicatif basé sur le barème fiscal français 2026.
              Les résultats sont des estimations. Consultez un conseiller fiscal ou impots.gouv.fr.
              Données : barème IR 2026, SMIC 2026, plafonds CAF en vigueur.
            </div>
          </main>
        </div>
      )}

      {/* ─── PHASE 3 : INVESTISSEMENTS ────────────────────────────── */}
      {phase === 'investments' && (
        <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <InvestKpiRow pea={state.pea} cto={state.cto} tmb={result.tmbPacs2026} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <PeaCard
              pea={state.pea}
              onChange={u => setState(s => ({ ...s, pea: { ...s.pea, ...u } }))}
            />
            <CtoCard
              cto={state.cto}
              onChange={u => setState(s => ({ ...s, cto: { ...s.cto, ...u } }))}
              tmb={result.tmbPacs2026}
            />
          </div>

          <ComparisonChart gainMontant={gainMontant} isDark={isDark} />

          <div style={{ textAlign: 'center', padding: '20px 16px', fontSize: '.7rem', color: 'var(--text-t)', borderTop: '1px solid var(--border-s)', lineHeight: 1.6 }}>
            Fiscalité PEA/CTO indicative 2026 — Source : service-public.fr, legifiscal.fr.
            Consultez un conseiller financier pour votre situation personnelle.
          </div>
        </div>
      )}
    </div>
  )
}
