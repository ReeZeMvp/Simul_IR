import React from 'react'

export type Phase = 'setup' | 'results' | 'investments'

interface Props {
  active: Phase
  onChange: (p: Phase) => void
}

const TABS: { id: Phase; label: string; icon: string }[] = [
  { id: 'setup',       label: '1. Profils & Logement',       icon: '⚙️' },
  { id: 'results',     label: '2. Résultats PACS',           icon: '📊' },
  { id: 'investments', label: '3. Investissements PEA/CTO',  icon: '📈' },
]

export default function PhaseBar({ active, onChange }: Props) {
  return (
    <nav style={{
      display: 'flex', background: 'var(--surface)',
      borderBottom: '1px solid var(--border-s)', overflow: 'hidden',
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '12px 16px', textAlign: 'center',
            fontSize: '.82rem', fontWeight: 600,
            cursor: 'pointer', border: 'none', fontFamily: 'var(--font)',
            background: tab.id === active ? 'var(--primary-l)' : 'transparent',
            color: tab.id === active ? 'var(--primary)' : 'var(--text-m)',
            position: 'relative', transition: 'all .25s',
            borderBottom: tab.id === active ? '2.5px solid var(--primary)' : '2.5px solid transparent',
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  )
}
