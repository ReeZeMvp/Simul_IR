import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import type { ComputeResult } from '@/engine/types'
import type { PersonState } from '@/engine/types'
import { MOIS_NOMS } from '@/engine/bareme'
import { fmt } from '@/engine'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend,
)

interface Props {
  result: ComputeResult
  personA: PersonState
  personB: PersonState
  isDark: boolean
  pacsOn: boolean
}

export default function ChartsGrid({ result, personA, personB, isDark, pacsOn }: Props) {
  const {
    irSep2026, irPacs2026, irSep2027, irPacs2027,
    ndSep2026, ndPacs2026, ndSep2027, ndPacs2027,
    irPacs2026: irActive,
    aplAnn2026, ppaAnn2026,
    revA2026, revB2026,
    monthlyA, monthlyB,
  } = result

  const txtC = isDark ? '#797876' : '#7a7974'
  const gridC = isDark ? '#393836' : '#d4d1ca'
  const teal  = isDark ? 'rgba(79,152,163,.85)' : 'rgba(1,105,111,.85)'
  const orange = isDark ? 'rgba(187,101,59,.85)' : 'rgba(150,66,25,.85)'

  const legendLabels = { font: { family: "'Satoshi',sans-serif", size: 11 as const }, color: txtC, padding: 14 }
  const tickStyle = { color: txtC, font: { family: "'Satoshi',sans-serif", size: 10 as const } }

  const barShared = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { position: 'bottom' as const, labels: legendLabels },
      tooltip: { callbacks: { label: (ctx: { dataset: { label?: string }; parsed: { x: number } }) => `${ctx.dataset.label} : ${fmt(ctx.parsed.x)}` } },
    },
    scales: {
      x: { ticks: { ...tickStyle, callback: (v: number | string) => fmt(+v) }, grid: { color: gridC } },
      y: { ticks: { ...tickStyle, font: { family: "'Satoshi',sans-serif", size: 11 as const, weight: 500 as const } }, grid: { display: false } },
    },
  }

  const netVal = Math.max(0, revA2026 + revB2026 - irActive)
  const donutColors = isDark
    ? ['#d163a7', '#4f98a3', '#bb653b', '#6daa45']
    : ['#a12c7b', '#01696f', '#964219', '#437a22']

  const months = MOIS_NOMS.map(m => m.substring(0, 3))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {/* IR 2026 / 2027 */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 16, boxShadow: 'var(--shadow-s)' }}>
        <h3 style={{ fontSize: '.84rem', fontWeight: 700, marginBottom: 10 }}>Impôt sur le revenu</h3>
        <div style={{ position: 'relative', height: 220 }}>
          <Bar
            data={{
              labels: ['2026', '2027'],
              datasets: [
                { label: 'Séparés', data: [irSep2026, irSep2027], backgroundColor: orange, borderRadius: 4, barPercentage: 0.55 },
                { label: 'PACS',    data: [irPacs2026, irPacs2027], backgroundColor: teal, borderRadius: 4, barPercentage: 0.55 },
              ],
            }}
            options={barShared}
          />
        </div>
      </div>

      {/* Net disponible */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 16, boxShadow: 'var(--shadow-s)' }}>
        <h3 style={{ fontSize: '.84rem', fontWeight: 700, marginBottom: 10 }}>Net disponible annuel</h3>
        <div style={{ position: 'relative', height: 220 }}>
          <Bar
            data={{
              labels: ['2026', '2027'],
              datasets: [
                { label: 'Séparés', data: [ndSep2026, ndSep2027], backgroundColor: orange, borderRadius: 4, barPercentage: 0.55 },
                { label: 'PACS',    data: [ndPacs2026, ndPacs2027], backgroundColor: teal, borderRadius: 4, barPercentage: 0.55 },
              ],
            }}
            options={barShared}
          />
        </div>
      </div>

      {/* Donut répartition */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 16, boxShadow: 'var(--shadow-s)' }}>
        <h3 style={{ fontSize: '.84rem', fontWeight: 700, marginBottom: 10 }}>Répartition revenus foyer 2026</h3>
        <div style={{ position: 'relative', height: 220 }}>
          <Doughnut
            data={{
              labels: ['Impôt sur le revenu', 'APL annualisée', 'PPA annualisée', 'Net disponible'],
              datasets: [{
                data: [irActive, aplAnn2026, ppaAnn2026, netVal],
                backgroundColor: donutColors,
                borderWidth: 0,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: { position: 'bottom', labels: legendLabels },
                tooltip: { callbacks: { label: (ctx: { label: string; parsed: number }) => `${ctx.label} : ${fmt(ctx.parsed)}` } },
              },
            }}
          />
        </div>
      </div>

      {/* Timeline mensuelle */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 16, boxShadow: 'var(--shadow-s)' }}>
        <h3 style={{ fontSize: '.84rem', fontWeight: 700, marginBottom: 10 }}>Revenus mensuels nets 2026</h3>
        <div style={{ position: 'relative', height: 220 }}>
          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: personA.name, data: monthlyA,
                  borderColor: isDark ? '#4f98a3' : '#01696f',
                  backgroundColor: 'transparent', tension: 0.3, pointRadius: 3, borderWidth: 2,
                },
                {
                  label: personB.name, data: monthlyB,
                  borderColor: isDark ? '#e8b520' : '#d19900',
                  backgroundColor: 'transparent', tension: 0.3, pointRadius: 3, borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: legendLabels },
                tooltip: { callbacks: { label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) => `${ctx.dataset.label} : ${fmt(ctx.parsed.y)}` } },
              },
              scales: {
                x: { ticks: tickStyle, grid: { color: gridC } },
                y: { ticks: { ...tickStyle, callback: (v: number | string) => fmt(+v) }, grid: { color: gridC } },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
