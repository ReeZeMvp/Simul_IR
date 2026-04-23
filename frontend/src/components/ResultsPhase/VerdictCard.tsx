import React from 'react'
import type { ComputeResult } from '@/engine/types'
import { fmt } from '@/engine'

interface Props {
  result: ComputeResult
}

export default function VerdictCard({ result }: Props) {
  const { gain2026, gain2027 } = result

  const items: { icon: string; html: string }[] = []

  if (gain2026 > 200) {
    items.push({ icon: '✅', html: `Le PACS vous ferait économiser <strong>${fmt(gain2026)}</strong> d'impôts en 2026.` })
  } else if (gain2026 >= 0 && gain2026 <= 200) {
    items.push({ icon: 'ℹ️', html: `L'avantage fiscal du PACS est limité (${fmt(gain2026)}) dans votre situation en 2026.` })
  } else {
    items.push({ icon: '⚠️', html: `Le PACS augmenterait votre impôt de ${fmt(-gain2026)} en 2026 (rare, lié aux plafonds).` })
  }

  if (gain2027 > 200) {
    items.push({ icon: '✅', html: `En 2027 (année pleine), le gain PACS serait de <strong>${fmt(gain2027)}</strong>.` })
  }

  if (gain2027 <= 50 && gain2026 <= 50) {
    items.push({ icon: 'ℹ️', html: "Le PACS n'apporte pas d'avantage fiscal significatif dans votre configuration actuelle." })
  }

  items.push({ icon: '💡', html: "Le PACS offre aussi des avantages non fiscaux : droits de succession, mutuelle employeur, facilité pour les prêts immobiliers, pension de réversion." })

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: '18px 20px', boxShadow: 'var(--shadow-s)' }}>
      <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: 10 }}>Verdict</h3>
      <div style={{ fontSize: '.85rem', lineHeight: 1.65, color: 'var(--text)' }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '6px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, fontSize: '1.1rem', lineHeight: 1.3 }}>{item.icon}</span>
            <span dangerouslySetInnerHTML={{ __html: item.html }} />
          </div>
        ))}
      </div>
    </div>
  )
}
