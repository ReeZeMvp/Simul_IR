import React from 'react'

interface Props {
  isDark: boolean
  onThemeToggle: () => void
}

export default function Header({ isDark, onThemeToggle }: Props) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'color-mix(in srgb,var(--surface) 85%,transparent)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-s)',
      padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: 'var(--primary)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>
          🧮
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Simul'IR 2026</span>
        <span style={{
          fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em',
          padding: '3px 9px', borderRadius: 20,
          background: 'var(--primary-l)', color: 'var(--primary)',
        }}>
          Générique
        </span>
      </div>
      <button
        onClick={onThemeToggle}
        aria-label="Basculer le thème"
        style={{
          width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
          background: 'var(--surface-2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-m)', transition: 'all .2s', fontSize: '1rem',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </button>
    </header>
  )
}
