import { Link, Navigate, useParams } from 'react-router-dom'
import AssignmentHero from '../components/AssignmentHero'
import { useProgress } from '../context/ProgressContext'
import { canSubmitAssignment, getWeekScore, weekProgress } from '../utils/progress'

export default function WeekPage() {
  const { weekNum } = useParams()
  const num = parseInt(weekNum, 10)
  const wi = num - 1
  const { weeks, assignments, state, maxUnlockedWeek, toggleCheck, user } = useProgress()

  if (Number.isNaN(num) || num < 1 || num > 10) {
    return <Navigate to="/" replace />
  }

  if (num > maxUnlockedWeek) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <div className="text-4xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-amber-900">Week {num} is locked</h1>
        <p className="mt-2 text-slate-700">
          Submit <strong>Assignment {num - 1}</strong> to unlock this week. One week at a time — you've got this!
        </p>
        <Link
          to={`/week/${num - 1}`}
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
        >
          Go to Week {num - 1}
        </Link>
      </div>
    )
  }

  const week = weeks[wi]
  const assignment = assignments[wi]
  if (!week || !assignment) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-medium text-slate-600">Loading week content…</p>
      </div>
    )
  }

  const mentorScore = getWeekScore(state.scores, num)
  const tasksReady = canSubmitAssignment(week, assignment, state.checks, wi)
  const { done, total } = weekProgress(week, assignment, state.checks, wi)
  const submitted = !!state.checks[`submit-w${num}`]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Week {num} of 10</p>
          <h1 className="text-2xl font-bold text-primary lg:text-3xl">{assignment.name}</h1>
        </div>
      </div>

      <p className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-medium text-slate-700">
        Daily tasks for this week are on your{' '}
        <Link to="/" className="font-semibold text-accent hover:underline">
          Dashboard
        </Link>
        . This page has the full assignment brief and submission.
      </p>

      <AssignmentHero assignment={assignment} wi={wi} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-primary">Submission</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <label
              className={`flex items-center gap-3 text-sm font-medium ${tasksReady || submitted ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <input
                type="checkbox"
                className="h-5 w-5 accent-emerald-600 disabled:cursor-not-allowed"
                checked={submitted}
                disabled={!tasksReady && !submitted}
                onChange={(e) => toggleCheck(`submit-w${num}`, e.target.checked)}
              />
              I submitted this assignment
            </label>
            {!tasksReady && !submitted && (
              <p className="mt-2 text-xs font-medium text-amber-800">
                Complete all daily tasks first ({done}/{total} done).{' '}
                <Link to="/" className="font-semibold text-accent hover:underline">
                  Go to Dashboard
                </Link>
              </p>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-500">Mentor score</p>
            <p className="mt-0.5 font-bold text-primary">
              {mentorScore != null ? `${mentorScore}/100` : 'Pending review'}
            </p>
            {user?.mentor_name && mentorScore == null && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                {user.mentor_name} will score after review
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
        {num > 1 ? (
          <Link
            to={`/week/${num - 1}`}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"
          >
            ← Week {num - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/" className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">
          Dashboard
        </Link>
        {num < 10 ? (
          num + 1 <= maxUnlockedWeek ? (
            <Link
              to={`/week/${num + 1}`}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"
            >
              Week {num + 1} →
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Submit to unlock Week {num + 1}</span>
          )
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
