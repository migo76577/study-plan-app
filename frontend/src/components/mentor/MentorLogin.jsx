import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { mentorApi, setMentorKey } from '../../api/mentor'

export default function MentorLogin({ onSuccess }) {
  const [key, setKey] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed) {
      toast.error('Enter your mentor key')
      return
    }
    setSubmitting(true)
    try {
      setMentorKey(trimmed)
      await mentorApi('/api/mentor/students')
      onSuccess()
    } catch {
      setMentorKey('')
      toast.error('Invalid mentor key')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-accent p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-xl font-bold text-primary">Mentor Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">View students, score assignments, and read reflections</p>
        <label className="mt-6 block text-xs font-semibold text-slate-500" htmlFor="mentor-key">
          Mentor key
        </label>
        <input
          id="mentor-key"
          type="password"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter mentor key"
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Checking…' : 'View students'}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-primary">
          ← Back to student app
        </Link>
      </form>
    </div>
  )
}
