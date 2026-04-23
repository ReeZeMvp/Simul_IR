import React from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}

export default function ToggleGroup<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div style={{
      display: 'flex', borderRadius: 'var(--r-s)', border: '1px solid var(--border)',
      overflow: 'hidden', background: 'var(--surface)',
    }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: '7px 8px', textAlign: 'center',
            fontSize: '.75rem', fontWeight: opt.value === value ? 700 : 500,
            cursor: 'pointer', border: 'none', fontFamily: 'var(--font)',
            background: opt.value === value ? 'var(--primary)' : 'transparent',
            color: opt.value === value ? '#fff' : 'var(--text-m)',
            transition: 'all .2s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
