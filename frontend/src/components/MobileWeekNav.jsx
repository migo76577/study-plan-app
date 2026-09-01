import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'

export default function MobileWeekNav() {
  const { maxUnlockedWeek } = useProgress()
  const location = useLocation()
  const navigate = useNavigate()

  const weekMatch = location.pathname.match(/^\/week\/(\d+)$/)
  const currentWeek = weekMatch ? weekMatch[1] : ''

  const handleWeekChange = (e) => {
    const num = e.target.value
    if (num && num !== 'locked') {
      navigate(`/week/${num}`)
    }
  }

  const linkClass = (active) =>
    `rounded-lg px-3 py-2 text-xs font-semibold ${
      active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
    }`

  return (
    <nav className="space-y-2 border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
      <div className="flex gap-1.5">
        <Link to="/" className={linkClass(location.pathname === '/')}>
          Home
        </Link>
        <Link to="/assignments" className={linkClass(location.pathname === '/assignments')}>
          Assignments
        </Link>
        <Link to="/reflection" className={linkClass(location.pathname === '/reflection')}>
          Reflect
        </Link>
      </div>
      <select
        value={currentWeek}
        onChange={handleWeekChange}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800"
        aria-label="Jump to week"
      >
        {!currentWeek && <option value="">Jump to week…</option>}
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const unlocked = num <= maxUnlockedWeek
          return (
            <option key={num} value={unlocked ? String(num) : 'locked'} disabled={!unlocked}>
              Week {num}
              {!unlocked ? ' (locked)' : ''}
            </option>
          )
        })}
      </select>
    </nav>
  )
}
