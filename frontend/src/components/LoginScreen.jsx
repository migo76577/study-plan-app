import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useProgress } from '../context/ProgressContext'

export default function LoginScreen({ redirectTo = '/' }) {
  const { login, register } = useProgress()
  const navigate = useNavigate()
  const [tab, setTab] = useState('returning')
  const [accessCode, setAccessCode] = useState('')
  const [newUser, setNewUser] = useState({ name: '', mentor_name: '', start_date: '', end_date: '' })
  const [createdCode, setCreatedCode] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(accessCode)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid access code')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!newUser.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    try {
      const u = await register(newUser)
      setCreatedCode(u.access_code)
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(createdCode)
      toast.success('Access code copied!')
    } catch {
      toast.error('Could not copy — select and copy manually')
    }
  }

  if (createdCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-accent p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-bold text-primary">Save your access code!</h2>
          <p className="mt-2 text-sm text-slate-600">You'll need this to log in from any device.</p>
          <div className="my-6 rounded-xl bg-sky-50 py-6 text-center text-3xl font-bold tracking-[0.3em] text-primary">
            {createdCode}
          </div>
          <button
            type="button"
            className="mb-3 w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary-dark"
            onClick={handleCopyCode}
          >
            Copy code
          </button>
          <button
            type="button"
            className="w-full rounded-lg border-2 border-primary py-3 font-semibold text-primary"
            onClick={() => navigate(redirectTo === '/' ? '/week/1' : redirectTo)}
          >
            Start Week 1
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-accent p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-primary">Python & SQL Study Plan</h1>
        <p className="mt-1 text-sm text-slate-600">10-week intensive program · Track your progress anywhere</p>

        <div className="mt-6 flex gap-2">
          {['returning', 'new'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium ${
                tab === t ? 'bg-primary text-white' : 'border border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              {t === 'returning' ? 'I have a code' : 'First time'}
            </button>
          ))}
        </div>

        {tab === 'returning' ? (
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Access code</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="e.g. A1B2C3"
                maxLength={6}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary-dark">
              Continue
            </button>
            <p className="text-center text-xs text-slate-500">
              Lost your code? Ask your mentor — they can look it up or reset it.
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Your name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Mentor name (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                value={newUser.mentor_name}
                onChange={(e) => setNewUser({ ...newUser, mentor_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Start date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  value={newUser.start_date}
                  onChange={(e) => setNewUser({ ...newUser, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Target end</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  value={newUser.end_date}
                  onChange={(e) => setNewUser({ ...newUser, end_date: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary-dark">
              Create my plan
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
