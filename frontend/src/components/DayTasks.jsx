import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import PracticeProject from './PracticeProject'

function TaskCheck({ id, label }) {
  const { state, toggleCheck } = useProgress()
  const checked = !!state.checks[id]
  return (
    <li className="flex gap-2.5 border-b border-slate-100 py-2 last:border-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => toggleCheck(id, e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
      />
      <span className={`text-sm font-semibold leading-relaxed ${checked ? 'line-through text-slate-500' : 'text-slate-800'}`}>
        {label}
      </span>
    </li>
  )
}

export default function DayTasks({ week, wi, practiceProject, weekPageLink }) {
  const { state } = useProgress()
  const dayEntries = useMemo(() => Object.entries(week.days), [week.days])
  const [activeDay, setActiveDay] = useState(0)

  const dayStats = dayEntries.map(([day, tasks]) => {
    const done = tasks.filter((_, ti) => state.checks[`w${wi}-d-${day}-t${ti}`]).length
    return { day, tasks, done, total: tasks.length, complete: done === tasks.length }
  })

  useEffect(() => {
    const firstOpen = dayStats.findIndex((d) => !d.complete)
    setActiveDay(firstOpen === -1 ? dayEntries.length - 1 : firstOpen)
  }, [wi, dayEntries.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = dayStats[activeDay]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-primary">{week.title}</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-700">Daily tasks by day tab</p>
        </div>
        {weekPageLink && (
          <Link to={weekPageLink} className="shrink-0 text-sm font-semibold text-accent hover:underline">
            Assignment details →
          </Link>
        )}
      </div>

      {/* Day tabs */}
      <div
        className="mt-3 flex gap-0.5 overflow-x-auto border-b border-slate-200 pb-px"
        role="tablist"
        aria-label="Days of the week"
      >
        {dayStats.map((d, i) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={i === activeDay}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 border-b-2 px-3 py-2 text-xs font-bold transition-colors ${
              i === activeDay
                ? 'border-primary text-primary'
                : d.complete
                  ? 'border-transparent text-emerald-700 hover:text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-primary'
            }`}
          >
            Day {i + 1}
            <span className="ml-1.5 text-xs font-semibold opacity-75">
              {d.done}/{d.total}
            </span>
          </button>
        ))}
      </div>

      {/* Tab panel — list only, no card */}
      {current && (
        <div role="tabpanel" className="pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-primary">Day {activeDay + 1}</h3>
            <span className={`text-xs font-semibold ${current.complete ? 'text-emerald-700' : 'text-slate-500'}`}>
              {current.done}/{current.total} done
            </span>
          </div>

          {practiceProject && activeDay === 4 && (
            <div className="mb-3">
              <PracticeProject project={practiceProject} compact />
            </div>
          )}

          <ul>
            {current.tasks.map((task, ti) => (
              <TaskCheck key={ti} id={`w${wi}-d-${current.day}-t${ti}`} label={task} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
