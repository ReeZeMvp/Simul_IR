import React from 'react'
import type { ComputeResult } from '@/engine/types'
import { fmt } from '@/engine'

interface Props {
  title: string
  result: ComputeResult
  year: 2026 | 2027
  nameA: string
  nameB: string
}

export default function ComparisonTable({ title, result, year, nameA, nameB }: Props) {
  const is2026 = year === 2026
  const {
    revA2026, revB2026, revA2027, revB2027,
    irSep2026, irPacs2026, irSep2027, irPacs2027,
    gain2026, gain2027,
    apl2026, apl2027,
    ppaApprentPhase, ppaCdiPhase, ppa2027,
    ndSep2026, ndPacs2026, ndSep2027, ndPacs2027,
    partsPacs, partsSepA, partsSepB,
  } = result

  const revFoyer = is2026 ? revA2026 + revB2026 : revA2027 + revB2027
  const irSep = is2026 ? irSep2026 : irSep2027
  const irPacs = is2026 ? irPacs2026 : irPacs2027
  const gain = is2026 ? gain2026 : gain2027
  const apl = is2026 ? apl2026 : apl2027
  const ppaP1 = is2026 ? ppaApprentPhase : ppa2027
  const ppaP2 = is2026 ? ppaCdiPhase : ppa2027
  const ndSep = is2026 ? ndSep2026 : ndSep2027
  const ndPacs = is2026 ? ndPacs2026 : ndPacs2027

  const cellRight: React.CSSProperties = { textAlign: 'right', fontWeight: 600 }
  const tdLabel: React.CSSProperties = { padding: '8px 12px', fontWeight: 500, color: 'var(--text-m)' }
  const tdVal: React.CSSProperties = { padding: '8px 12px', ...cellRight }

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: 'var(--shadow-s)' }}>
      <h3 style={{ padding: '14px 16px 10px', fontSize: '.88rem', fontWeight: 700, borderBottom: '1px solid var(--border-s)' }}>
        {title}
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.79rem', fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr style={{ background: 'var(--surface)' }}>
              <th style={{ textAlign: 'left', padding: '9px 12px', fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-t)', borderBottom: '1px solid var(--border-s)' }}></th>
              {['Séparés', 'PACS', 'Différence'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '9px 12px', fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-t)', borderBottom: '1px solid var(--border-s)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdLabel}>Revenu net imposable foyer</td>
              <td style={tdVal}>{fmt(revFoyer)}</td>
              <td style={tdVal}>{fmt(revFoyer)}</td>
              <td style={tdVal}>—</td>
            </tr>
            <tr>
              <td style={tdLabel}>Parts fiscales</td>
              <td style={{ ...tdVal }}>{partsSepA}+{partsSepB}</td>
              <td style={{ ...tdVal, color: 'var(--primary)', fontWeight: 700 }}>{partsPacs}</td>
              <td style={tdVal}>—</td>
            </tr>
            <tr style={{ background: 'var(--surface)' }}>
              <td style={{ ...tdLabel, fontWeight: 700 }}>Impôt sur le revenu</td>
              <td style={{ ...tdVal }}>{fmt(irSep)}</td>
              <td style={{ ...tdVal, color: 'var(--primary)', fontWeight: 700 }}>{fmt(irPacs)}</td>
              <td style={{ ...tdVal, color: gain > 0 ? 'var(--success)' : gain < 0 ? 'var(--error)' : undefined }}>
                {gain > 0 ? '+' : ''}{fmt(gain)}
              </td>
            </tr>
            <tr>
              <td style={tdLabel}>APL mensuelle</td>
              <td style={tdVal}>{fmt(apl)}</td>
              <td style={tdVal}>{fmt(apl)}</td>
              <td style={tdVal}>—</td>
            </tr>
            <tr>
              <td style={tdLabel}>PPA /m (phase 1)</td>
              <td style={tdVal}>{fmt(ppaP1)}</td>
              <td style={tdVal}>{fmt(ppaP1)}</td>
              <td style={tdVal}>—</td>
            </tr>
            <tr>
              <td style={tdLabel}>PPA /m (phase 2)</td>
              <td style={tdVal}>{fmt(ppaP2)}</td>
              <td style={tdVal}>{fmt(ppaP2)}</td>
              <td style={tdVal}>—</td>
            </tr>
            <tr style={{ background: 'var(--surface)' }}>
              <td style={{ ...tdLabel, fontWeight: 700, borderTop: '2px solid var(--border)' }}>Net disponible annuel</td>
              <td style={{ ...tdVal, borderTop: '2px solid var(--border)' }}>{fmt(ndSep)}</td>
              <td style={{ ...tdVal, borderTop: '2px solid var(--border)', color: 'var(--primary)', fontWeight: 700 }}>{fmt(ndPacs)}</td>
              <td style={{ ...tdVal, borderTop: '2px solid var(--border)', color: ndPacs > ndSep ? 'var(--success)' : ndPacs < ndSep ? 'var(--error)' : undefined }}>
                {ndPacs - ndSep > 0 ? '+' : ''}{fmt(ndPacs - ndSep)}
              </td>
            </tr>
            <tr style={{ background: 'var(--success-l)' }}>
              <td style={{ ...tdLabel, fontWeight: 700, color: 'var(--success)' }}>Gain PACS</td>
              <td style={tdVal}></td>
              <td style={tdVal}></td>
              <td style={{ ...tdVal, color: 'var(--success)', fontWeight: 700 }}>{gain > 0 ? '+' : ''}{fmt(gain)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
