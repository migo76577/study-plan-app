import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useProgress } from '../context/ProgressContext'
import { getGreeting, getInitials, getMotivation } from '../utils/greeting'

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

export default function TopBar() {
  const { user, stats, assignments, maxUnlockedWeek, logout } = useProgress()
  const location = useLocation()

  const weekMatch = location.pathname.match(/^\/week\/(\d+)$/)
  const currentWeek = weekMatch ? parseInt(weekMatch[1], 10) : null
  const currentAssignment = currentWeek ? assignments[currentWeek - 1] : null

  const copyCode = async () => {
    if (!user?.access_code) return
    try {
      await navigator.clipboard.writeText(user.access_code)
      toast.success('Access code copied!')
    } catch {
      toast.error('Could not copy code')
    }
  }

  const greeting = getGreeting()
  const motivation = stats ? getMotivation(stats.percent) : ''

  return (
    <header className="sticky top-0 z-50 border-b border-primary-dark/30 bg-gradient-to-r from-primary via-[#1e5f85] to-[#2471a3] text-white shadow-lg">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 lg:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <BookIcon />
          </div>
          <div className="hidden sm:block">
            <div className="text-base font-bold leading-tight">Study Plan</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Python & SQL · 10 weeks
            </div>
          </div>
        </Link>

        {user && (
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-sky-300 text-xs font-bold text-primary shadow-md ring-2 ring-white/30 sm:h-10 sm:w-10 sm:text-sm"
              aria-hidden
            >
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="hidden truncate text-sm font-semibold text-white/90 sm:block">{greeting},</p>
              <p className="truncate text-sm font-bold leading-tight sm:text-lg">{user.name}</p>
              <p className="hidden truncate text-sm font-medium text-white/85 md:block">
                {currentAssignment
                  ? `Week ${currentWeek} · ${currentAssignment.name}`
                  : location.pathname === '/assignments'
                    ? `Assignment tracker · ${stats?.submitted ?? 0}/10 submitted`
                    : location.pathname === '/reflection'
                      ? 'Weekly reflection · note your progress'
                      : `On Week ${maxUnlockedWeek} · ${motivation}`}
              </p>
            </div>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {user && (
            <button
              type="button"
              onClick={copyCode}
              className="flex items-center justify-center rounded-lg bg-white/10 p-2 ring-1 ring-white/20 transition hover:bg-white/20 sm:gap-1.5 sm:px-3 sm:py-2"
              title="Copy access code"
              aria-label="Copy access code"
            >
              <span className="hidden font-semibold text-white/90 sm:inline">Code</span>
              <span className="hidden tracking-widest sm:inline">{user.access_code}</span>
              <CopyIcon />
            </button>
          )}
          {user?.mentor_name && (
            <span className="hidden rounded-lg bg-white/10 px-3 py-2 text-xs ring-1 ring-white/15 lg:inline">
              Mentor: <strong>{user.mentor_name}</strong>
            </span>
          )}
          <a
            href="/mentor"
            className="hidden rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/20 sm:inline-block"
          >
            Mentor
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/30 bg-white/5 px-2.5 py-1.5 text-xs font-semibold transition hover:bg-white/15 sm:px-3 sm:py-2 sm:text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
