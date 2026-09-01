import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../../api'
import {
  buildShareMessage,
  formatReflectionDate,
  mentorApi,
} from '../../api/mentor'

export default function MentorStudentProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { onAuthLost } = useOutletContext()

  const [assignments, setAssignments] = useState([])
  const [detail, setDetail] = useState(null)
  const [scores, setScores] = useState({})
  const [accessMsg, setAccessMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingScores, setSavingScores] = useState(false)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const curriculum = await api('/api/curriculum')
      setAssignments(curriculum.assignments || [])
      const data = await mentorApi(`/api/mentor/students/${studentId}/progress`)
      setDetail(data)
      const existing = data.progress?.scores || {}
      setScores(
        Object.fromEntries(
          Object.entries(existing).map(([k, v]) => [k, v === '' ? '' : String(v)]),
        ),
      )
    } catch {
      toast.error('Could not load student profile')
      onAuthLost?.()
      navigate('/mentor')
    } finally {
      setLoading(false)
    }
  }, [studentId, onAuthLost, navigate])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const copyCode = async () => {
    if (!detail?.student) return
    try {
      await navigator.clipboard.writeText(detail.student.access_code)
      setAccessMsg('Access code copied.')
    } catch {
      setAccessMsg('Could not copy — select the code manually.')
    }
  }

  const shareCode = async () => {
    if (!detail?.student) return
    const text = buildShareMessage(detail.student, detail.student.access_code)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Study Plan access code', text })
        setAccessMsg('Shared with student.')
      } else {
        await navigator.clipboard.writeText(text)
        setAccessMsg('Login message copied — paste it to your student.')
      }
    } catch (err) {
      if (err.name !== 'AbortError') setAccessMsg(err.message || 'Could not share.')
    }
  }

  const resetCode = async () => {
    if (!detail?.student) return
    const name = detail.student.name
    if (!confirm(`Generate a new access code for ${name}? They will need the new code to log in.`)) return
    try {
      const result = await mentorApi(`/api/mentor/students/${studentId}/reset-code`, { method: 'POST' })
      setDetail((prev) => ({
        ...prev,
        student: { ...prev.student, access_code: result.access_code },
      }))
      setAccessMsg(`New code: ${result.access_code}. Share it with ${name}.`)
    } catch (err) {
      setAccessMsg(err.message || 'Reset failed.')
    }
  }

  const saveScores = async () => {
    setSavingScores(true)
    const checks = detail?.progress?.checks || {}
    const submittedScores = Object.fromEntries(
      Object.entries(scores).filter(([week]) => checks[`submit-w${week}`]),
    )
    try {
      await mentorApi(`/api/mentor/students/${studentId}/scores`, {
        method: 'PUT',
        body: JSON.stringify({ scores: submittedScores }),
      })
      toast.success('Scores saved')
      await loadProfile()
    } catch (err) {
      toast.error(err.message || 'Could not save scores')
    } finally {
      setSavingScores(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
        Loading student profile…
      </div>
    )
  }

  if (!detail) return null

  const { student, stats, reflections } = detail
  const checks = detail.progress?.checks || {}

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-4 sm:px-6 sm:py-6">
      <Link
        to="/mentor"
        className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
      >
        ← All students
      </Link>

      <div className="mt-4 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-primary lg:text-2xl">{student.name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {student.mentor_name ? `Mentor: ${student.mentor_name}` : 'No mentor on file'}
              {[student.start_date, student.end_date].filter(Boolean).length
                ? ` · ${[student.start_date, student.end_date].filter(Boolean).join(' → ')}`
                : ''}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:max-w-xl lg:shrink-0">
            {[
              ['Complete', `${stats.percent}%`],
              ['Weeks done', `${stats.weeks_done}/10`],
              ['Submitted', `${stats.submitted}/10`],
              ['Total score', stats.total_score],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-sky-50 px-3 py-2.5 text-center">
                <div className="text-sm font-bold text-primary">{value}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50/60 p-4 lg:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Access code</p>
          <p className="mt-2 break-all text-center font-mono text-xl font-bold tracking-[0.15em] text-primary sm:text-2xl sm:tracking-[0.2em] lg:text-3xl">
            {student.access_code}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={copyCode}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primary hover:bg-slate-50 sm:w-auto"
            >
              Copy code
            </button>
            <button
              type="button"
              onClick={shareCode}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primary hover:bg-slate-50 sm:w-auto"
            >
              Share with student
            </button>
            <button
              type="button"
              onClick={resetCode}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 sm:w-auto"
            >
              Reset code
            </button>
          </div>
          {accessMsg && <p className="mt-2 text-xs text-slate-600">{accessMsg}</p>}
        </div>

        <section className="mt-6 min-w-0">
          <h2 className="text-sm font-bold text-primary">Assignment scores</h2>
          <p className="mt-1 text-xs text-slate-500">
            Scores can only be awarded after the student marks an assignment submitted.
          </p>

          <div className="mt-3 space-y-2 md:hidden">
            {assignments.map((a) => {
              const submitted = !!checks[`submit-w${a.week}`]
              return (
                <div
                  key={a.week}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary">Week {a.week}</p>
                      <p className="mt-0.5 truncate text-slate-700">{a.name}</p>
                    </div>
                    <span className="shrink-0 text-slate-500">{submitted ? 'Submitted ✓' : 'Not submitted'}</span>
                  </div>
                  <div className="mt-2">
                    {submitted ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="w-full max-w-[120px] rounded border border-slate-200 bg-white px-2 py-1.5 text-xs"
                        value={scores[a.week] ?? scores[String(a.week)] ?? ''}
                        placeholder="Score /100"
                        onChange={(e) =>
                          setScores((prev) => ({ ...prev, [String(a.week)]: e.target.value }))
                        }
                      />
                    ) : (
                      <span className="text-slate-400">Awaiting submission</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 hidden rounded-xl border border-slate-200 md:block">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2.5 text-left font-semibold">Week</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Assignment</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Submitted</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Score /100</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const submitted = !!checks[`submit-w${a.week}`]
                  return (
                    <tr key={a.week} className="border-t border-slate-100 even:bg-slate-50/50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">W{a.week}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={a.name}>
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{submitted ? '✓' : '—'}</td>
                      <td className="px-4 py-3">
                        {submitted ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="w-16 rounded border border-slate-200 px-2 py-1 text-xs"
                            value={scores[a.week] ?? scores[String(a.week)] ?? ''}
                            placeholder="—"
                            onChange={(e) =>
                              setScores((prev) => ({ ...prev, [String(a.week)]: e.target.value }))
                            }
                          />
                        ) : (
                          <span className="text-slate-400">Not submitted</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={saveScores}
            disabled={savingScores}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {savingScores ? 'Saving…' : 'Save scores'}
          </button>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold text-primary">Weekly reflections</h2>
          {reflections?.length ? (
            <div className="mt-3 space-y-3">
              {reflections.map((r) => (
                <div key={r.week} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-primary">Week {r.week}</span>
                    <span className="text-slate-500">{formatReflectionDate(r.submitted_at)}</span>
                  </div>
                  <p className="mt-1 text-slate-700">
                    <span className="font-semibold text-slate-500">Learned:</span> {r.learned || '—'}
                  </p>
                  <p className="mt-1 text-slate-700">
                    <span className="font-semibold text-slate-500">Hardest:</span> {r.hard || '—'}
                  </p>
                  <p className="mt-1 text-slate-700">
                    <span className="font-semibold text-slate-500">Hours:</span> {r.hours || '—'}
                  </p>
                  <p className="mt-1 text-slate-700">
                    <span className="font-semibold text-slate-500">Confidence:</span> {r.confidence || '—'}/10
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No reflections submitted yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
