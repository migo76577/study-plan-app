import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { mentorApi } from '../../api/mentor'

function StudentCard({ student }) {
  const { stats } = student
  return (
    <Link
      to={`/mentor/students/${student.id}`}
      className="block p-4 transition hover:bg-sky-50/60 active:bg-sky-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-primary">{student.name}</p>
          {student.mentor_name && (
            <p className="mt-0.5 truncate text-xs text-slate-500">Mentor: {student.mentor_name}</p>
          )}
        </div>
        <span className="shrink-0 text-sm font-bold text-success">{stats.percent}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-success" style={{ width: `${stats.percent}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{stats.submitted}/10 submitted</span>
        <span>Score {stats.total_score}</span>
        <span className="font-mono">{student.access_code}</span>
      </div>
    </Link>
  )
}

export default function MentorStudentsPage() {
  const { onAuthLost } = useOutletContext()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const loadStudents = useCallback(async () => {
    setLoading(true)
    try {
      const list = await mentorApi('/api/mentor/students')
      setStudents(list)
    } catch {
      toast.error('Could not load students')
      onAuthLost?.()
    } finally {
      setLoading(false)
    }
  }, [onAuthLost])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.access_code.toLowerCase().includes(q) ||
        (s.mentor_name || '').toLowerCase().includes(q),
    )
  }, [students, query])

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-primary">All students</h1>
          <p className="mt-1 text-sm text-slate-600">
            {students.length} registered · tap a student to open their profile
          </p>
        </div>
        <input
          type="search"
          placeholder="Search name or code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-xs"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading students…</p>
        ) : !students.length ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No students yet. Share the app link and have them register.
          </p>
        ) : !filtered.length ? (
          <p className="p-8 text-center text-sm text-slate-500">No students match your search.</p>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((s) => (
                <StudentCard key={s.id} student={s} />
              ))}
            </div>

            <div className="table-scroll hidden md:block">
              <table className="w-full border-collapse text-xs lg:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 lg:px-5">Student</th>
                    <th className="px-4 py-3 lg:px-5">Progress</th>
                    <th className="px-4 py-3 lg:px-5">Submitted</th>
                    <th className="px-4 py-3 lg:px-5">Score</th>
                    <th className="px-4 py-3 lg:px-5">Code</th>
                    <th className="px-4 py-3 lg:px-5" aria-label="View" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100 hover:bg-sky-50/40">
                      <td className="max-w-[180px] px-4 py-3.5 lg:px-5">
                        <Link
                          to={`/mentor/students/${s.id}`}
                          className="block truncate font-semibold text-primary hover:underline"
                        >
                          {s.name}
                        </Link>
                        {s.mentor_name && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">Mentor: {s.mentor_name}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 lg:px-5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-200 lg:w-16">
                            <div
                              className="h-full rounded-full bg-success"
                              style={{ width: `${s.stats.percent}%` }}
                            />
                          </div>
                          <span className="font-medium text-slate-700">{s.stats.percent}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 lg:px-5">
                        {s.stats.submitted}/10
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-700 lg:px-5">
                        {s.stats.total_score}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-600 lg:px-5">
                        {s.access_code}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right lg:px-5">
                        <Link
                          to={`/mentor/students/${s.id}`}
                          className="text-xs font-semibold text-accent hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
