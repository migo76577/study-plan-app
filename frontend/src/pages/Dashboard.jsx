import { Link } from 'react-router-dom'
import ProgressOverview from '../components/ProgressOverview'
import CurrentWeekFocus from '../components/CurrentWeekFocus'
import DayTasks from '../components/DayTasks'
import { useProgress } from '../context/ProgressContext'

export default function Dashboard() {
  const { weeks, assignments, state, maxUnlockedWeek } = useProgress()

  const focusWi = maxUnlockedWeek - 1
  const focusWeek = weeks[focusWi]
  const focusAssignment = assignments[focusWi]

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = days[new Date().getDay()]
  let todayTotal = 0
  let todayDone = 0
  weeks.forEach((week, wi) => {
    if (week.days[today]) {
      week.days[today].forEach((_, ti) => {
        todayTotal++
        if (state.checks[`w${wi}-d-${today}-t${ti}`]) todayDone++
      })
    }
  })

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm font-medium text-slate-700">
            Week {maxUnlockedWeek} · check off tasks and open the assignment when ready
          </p>
        </div>
        <Link to="/reflection" className="text-sm font-semibold text-accent hover:underline">
          Weekly reflection →
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProgressOverview todayDone={todayDone} todayTotal={todayTotal} />
        <CurrentWeekFocus />
      </div>

      <p className="rounded-lg border-l-2 border-accent bg-sky-50/80 px-3 py-2 text-xs font-medium text-slate-700">
        <strong className="font-bold">Schedule:</strong> Morning 3:30–5:30 AM · Day 12–1 PM · Evening 9–10:30 PM
      </p>

      {focusWeek && focusAssignment && (
        <DayTasks
          week={focusWeek}
          wi={focusWi}
          practiceProject={focusAssignment.practice_project}
          weekPageLink={`/week/${maxUnlockedWeek}`}
        />
      )}
    </div>
  )
}
