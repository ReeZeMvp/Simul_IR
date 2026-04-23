import React from 'react'
import { fmt } from '@/engine'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
  note?: string
}

export default function SliderField({
  label, value, min, max, step, onChange, formatValue, note,
}: Props) {
  const display = formatValue ? formatValue(value) : fmt(value)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: '.8rem', fontWeight: 500, color: 'var(--text-m)',
        marginBottom: 5, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: 'var(--text-t)', marginTop: 2 }}>
        <span>{formatValue ? formatValue(min) : fmt(min)}</span>
        <span>{formatValue ? formatValue(max) : fmt(max)}</span>
      </div>
      {note && <div style={{ fontSize: '.72rem', color: 'var(--text-t)', marginTop: 3 }}>{note}</div>}
    </div>
  )
}
