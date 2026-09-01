import { Link, useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { weekProgress } from '../utils/progress'

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function navLinkClass(active) {
  return `block rounded-lg px-3 py-2 text-sm font-semibold ${
    active ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
  }`
}

export default function Sidebar() {
  const { weeks, assignments, state, maxUnlockedWeek, stats } = useProgress()
  const location = useLocation()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex xl:w-64">
      <div className="sidebar-scroll flex-1 overflow-y-auto overscroll-y-contain p-3 lg:p-4">
        <nav className="mb-4 space-y-0.5">
          <Link to="/" className={navLinkClass(location.pathname === '/')}>
            Dashboard
          </Link>
          <Link to="/assignments" className={navLinkClass(location.pathname === '/assignments')}>
            Assignment Tracker
            {stats && (
              <span
                className={`ml-1.5 text-xs font-semibold ${
                  location.pathname === '/assignments' ? 'text-white/90' : 'text-slate-600'
                }`}
              >
                {stats.submitted}/10
              </span>
            )}
          </Link>
          <Link to="/reflection" className={navLinkClass(location.pathname === '/reflection')}>
            Weekly Reflection
          </Link>
        </nav>

        <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wide text-slate-600">Weeks</p>
        <nav className="space-y-0.5">
          {weeks.map((week, wi) => {
            const num = wi + 1
            const unlocked = num <= maxUnlockedWeek
            const active = location.pathname === `/week/${num}`
            const prog = weekProgress(week, assignments[wi], state.checks, wi)
            const submitted = state.checks[`submit-w${num}`]

            if (!unlocked) {
              return (
                <div
                  key={num}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500"
                  title={`Submit Assignment ${num - 1} to unlock`}
                >
                  <LockIcon />
                  <span className="font-semibold">Week {num}</span>
                  <span className="ml-auto text-[10px] font-semibold">Locked</span>
                </div>
              )
            }

            return (
              <Link
                key={num}
                to={`/week/${num}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : prog.pct === 100
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : num === maxUnlockedWeek
                        ? 'bg-sky-50 text-primary ring-1 ring-sky-200 hover:bg-sky-100'
                        : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {submitted ? (
                  <CheckIcon />
                ) : (
                  <span className="w-3.5 text-center text-[10px] font-bold">{num}</span>
                )}
                <span className="min-w-0 flex-1 truncate font-semibold">Week {num}</span>
                <span className={`shrink-0 text-[10px] font-semibold ${active ? 'text-white/90' : 'text-slate-600'}`}>
                  {prog.pct}%
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
