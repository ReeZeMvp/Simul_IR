import React from 'react'

interface Props {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}

export default function SwitchField({ label, value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
      <span style={{ fontSize: '.82rem', fontWeight: 500, color: 'var(--text)' }}>{label}</span>
      <div
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 42, height: 22, borderRadius: 11,
          background: value ? 'var(--primary)' : 'var(--border)',
          position: 'relative', cursor: 'pointer', flexShrink: 0,
          transition: 'background .25s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3,
          left: value ? 23 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.15)',
          transition: 'left .25s',
        }} />
      </div>
    </div>
  )
}
