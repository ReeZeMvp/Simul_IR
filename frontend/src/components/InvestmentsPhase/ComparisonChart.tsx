import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { fmtPct } from '@/engine'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

interface Props {
  gainMontant: number
  isDark: boolean
}

// Génère les courbes d'imposition pour PFU, barème IR et PEA selon le TMB
export default function ComparisonChart({ gainMontant, isDark }: Props) {
  const txtC = isDark ? '#797876' : '#7a7974'
  const gridC = isDark ? '#393836' : '#d4d1ca'

  // TMB de 0% à 45% par pas de 5%
  const tmbSteps = [0, 0.11, 0.30, 0.41, 0.45]
  const labels = ['0%', '11%', '30%', '41%', '45%']

  const pfuData    = tmbSteps.map(() => gainMontant * 0.30)
  const baremeData = tmbSteps.map(tmb => gainMontant * (tmb + 0.172))
  const peaData    = tmbSteps.map(() => gainMontant * 0.172)

  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-s)', borderRadius: 'var(--r)', padding: 20, boxShadow: 'var(--shadow-s)' }}>
      <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: 4 }}>
        Comparaison fiscalité placements selon TMB
      </h3>
      <p style={{ fontSize: '.75rem', color: 'var(--text-t)', marginBottom: 14 }}>
        Pour un gain de {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(gainMontant)}
      </p>
      <div style={{ position: 'relative', height: 260 }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'PFU 30% (CTO)',
                data: pfuData,
                borderColor: isDark ? '#bb653b' : '#964219',
                backgroundColor: 'transparent',
                tension: 0, pointRadius: 4, borderWidth: 2,
              },
              {
                label: 'Barème IR + PS (CTO)',
                data: baremeData,
                borderColor: isDark ? '#d163a7' : '#a12c7b',
                backgroundColor: 'transparent',
                tension: 0, pointRadius: 4, borderWidth: 2, borderDash: [5, 3],
              },
              {
                label: 'PEA ≥ 5 ans (PS seuls)',
                data: peaData,
                borderColor: isDark ? '#6daa45' : '#437a22',
                backgroundColor: 'transparent',
                tension: 0, pointRadius: 4, borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { font: { family: "'Satoshi',sans-serif", size: 11 }, color: txtC, padding: 14 } },
              tooltip: {
                callbacks: {
                  label: ctx => `${ctx.dataset.label} : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(ctx.parsed.y)}`,
                },
              },
            },
            scales: {
              x: { title: { display: true, text: 'Tranche marginale d\'imposition', color: txtC, font: { size: 11 } }, ticks: { color: txtC }, grid: { color: gridC } },
              y: { ticks: { color: txtC, callback: (v: number | string) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(+v) }, grid: { color: gridC } },
            },
          }}
        />
      </div>
    </div>
  )
}
