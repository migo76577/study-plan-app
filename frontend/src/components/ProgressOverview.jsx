import { useProgress } from '../context/ProgressContext'
import { getMotivation } from '../utils/greeting'

export default function ProgressOverview({ todayDone, todayTotal }) {
  const { stats } = useProgress()
  if (!stats) return null

  const chips = [
    { label: 'Tasks', value: `${stats.done_tasks}/${stats.total_tasks}` },
    { label: 'Weeks', value: `${stats.weeks_done}/10` },
    { label: 'Submitted', value: `${stats.submitted}/10` },
    { label: 'Score', value: stats.total_score },
    { label: 'Today', value: todayTotal ? `${todayDone}/${todayTotal}` : '—' },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-primary">Overall progress</h2>
        <span className="text-lg font-bold text-primary">{stats.percent}%</span>
      </div>
      <p className="mt-0.5 text-xs font-medium text-slate-700">{getMotivation(stats.percent)}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${stats.percent}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        {chips.map((chip) => (
          <div key={chip.label} className="rounded-md bg-sky-50 px-2 py-1.5 text-center">
            <div className="text-xs font-bold leading-none text-primary">{chip.value}</div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
              {chip.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
