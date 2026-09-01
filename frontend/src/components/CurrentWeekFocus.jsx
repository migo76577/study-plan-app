import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { weekProgress } from '../utils/progress'

export default function CurrentWeekFocus() {
  const { weeks, assignments, state, maxUnlockedWeek } = useProgress()

  const focusWeek = maxUnlockedWeek
  const wi = focusWeek - 1
  const week = weeks[wi]
  const assignment = assignments[wi]
  if (!week || !assignment) return null

  const prog = weekProgress(week, assignment, state.checks, wi)
  const submitted = !!state.checks[`submit-w${focusWeek}`]

  return (
    <div className="flex flex-col rounded-xl border border-primary/15 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-primary to-sky-700 px-4 py-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/90">Your focus · Week {focusWeek}</p>
        <h3 className="mt-0.5 text-base font-bold leading-snug">{assignment.name}</h3>
        {assignment.tagline && (
          <p className="mt-1 line-clamp-2 text-xs font-medium text-white/90">{assignment.tagline}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Week progress</span>
          <span className="text-primary">{prog.pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${prog.pct}%` }}
          />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Link
            to={`/week/${focusWeek}`}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
          >
            {submitted ? `Review Week ${focusWeek}` : `Open Week ${focusWeek}`}
          </Link>
          {!submitted && (
            <Link
              to="/assignments"
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-primary hover:bg-slate-50"
            >
              Tracker
            </Link>
          )}
          {submitted && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              Submitted
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
