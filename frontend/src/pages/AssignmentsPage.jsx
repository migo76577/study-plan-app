import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { canSubmitAssignment, getWeekScore } from '../utils/progress'

function statusBadge(unlocked, submitted, score) {
  if (!unlocked) {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">Locked</span>
    )
  }
  if (submitted && score != null) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">Scored</span>
    )
  }
  if (submitted) {
    return (
      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">Awaiting score</span>
    )
  }
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">In progress</span>
  )
}

export default function AssignmentsPage() {
  const { weeks, assignments, state, maxUnlockedWeek, toggleCheck, stats } = useProgress()

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-8 py-1">
      <div>
        <h1 className="text-xl font-bold text-primary lg:text-2xl">Assignment Tracker</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Mark each assignment as submitted after completing all daily tasks. Your mentor awards scores after review.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-sky-50 px-5 py-5 text-center">
          <div className="text-lg font-bold text-primary">{stats?.submitted ?? 0}/10</div>
          <div className="mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Submitted</div>
        </div>
        <div className="rounded-xl bg-sky-50 px-5 py-5 text-center">
          <div className="text-lg font-bold text-primary">{stats?.total_score ?? 0}</div>
          <div className="mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Total score (mentor)</div>
        </div>
        <div className="rounded-xl bg-sky-50 px-5 py-5 text-center">
          <div className="text-lg font-bold text-primary">{maxUnlockedWeek}</div>
          <div className="mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Week unlocked</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100 md:hidden">
          {assignments.map((a) => {
            const unlocked = a.week <= maxUnlockedWeek
            const wi = a.week - 1
            const week = weeks[wi]
            const submitted = !!state.checks[`submit-w${a.week}`]
            const tasksReady = week && canSubmitAssignment(week, a, state.checks, wi)
            const score = getWeekScore(state.scores, a.week)
            const canToggleSubmit = unlocked && (tasksReady || submitted)

            return (
              <div key={a.week} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">Week {a.week}</p>
                    {unlocked ? (
                      <Link to={`/week/${a.week}`} className="mt-0.5 block truncate text-sm font-semibold text-primary">
                        {a.name}
                      </Link>
                    ) : (
                      <p className="mt-0.5 truncate text-sm font-medium text-slate-500">{a.name}</p>
                    )}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{a.tagline}</p>
                  </div>
                  {statusBadge(unlocked, submitted, score)}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-emerald-600 disabled:opacity-50"
                      checked={submitted}
                      disabled={!canToggleSubmit}
                      onChange={(e) => toggleCheck(`submit-w${a.week}`, e.target.checked)}
                    />
                    Submitted
                  </label>
                  <span className="text-slate-600">
                    Score:{' '}
                    {score != null ? (
                      <span className="font-semibold text-primary">{score}/100</span>
                    ) : (
                      <span className="text-slate-400">Pending</span>
                    )}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="table-scroll hidden md:block">
          <table className="w-full border-collapse text-xs lg:text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold lg:px-5">Week</th>
                <th className="px-4 py-3 text-left text-xs font-semibold lg:px-5">Assignment</th>
                <th className="px-4 py-3 text-center text-xs font-semibold lg:px-5">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold lg:px-5">Mentor score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold lg:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const unlocked = a.week <= maxUnlockedWeek
                const wi = a.week - 1
                const week = weeks[wi]
                const submitted = !!state.checks[`submit-w${a.week}`]
                const tasksReady = week && canSubmitAssignment(week, a, state.checks, wi)
                const score = getWeekScore(state.scores, a.week)
                const canToggleSubmit = unlocked && (tasksReady || submitted)

                return (
                  <tr key={a.week} className="border-t border-slate-100 even:bg-slate-50/40">
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600 lg:px-5">Week {a.week}</td>
                    <td className="max-w-[240px] px-4 py-4 lg:px-5">
                      {unlocked ? (
                        <Link
                          to={`/week/${a.week}`}
                          className="block truncate text-sm font-semibold text-primary hover:underline"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        <span className="block truncate text-sm font-medium text-slate-500">{a.name}</span>
                      )}
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{a.tagline}</p>
                    </td>
                    <td className="px-4 py-4 text-center lg:px-5">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        checked={submitted}
                        disabled={!canToggleSubmit}
                        title={
                          unlocked && !tasksReady && !submitted
                            ? 'Complete all daily tasks on the Dashboard first'
                            : undefined
                        }
                        onChange={(e) => toggleCheck(`submit-w${a.week}`, e.target.checked)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700 lg:px-5">
                      {score != null ? (
                        <span className="text-primary">{score}/100</span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-4 lg:px-5">{statusBadge(unlocked, submitted, score)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
