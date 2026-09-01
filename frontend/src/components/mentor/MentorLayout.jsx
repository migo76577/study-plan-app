import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getMentorKey, setMentorKey } from '../../api/mentor'
import MentorLogin from './MentorLogin'

export default function MentorLayout() {
  const [authenticated, setAuthenticated] = useState(!!getMentorKey())
  const navigate = useNavigate()

  const handleLogout = () => {
    setMentorKey('')
    setAuthenticated(false)
    navigate('/mentor')
  }

  const handleAuthLost = () => {
    setMentorKey('')
    setAuthenticated(false)
  }

  if (!authenticated) {
    return (
      <MentorLogin
        onSuccess={() => {
          setAuthenticated(true)
          navigate('/mentor')
        }}
      />
    )
  }

  return (
    <div className="mentor-app min-h-dvh bg-slate-100">
      <header className="sticky top-0 z-10 bg-primary px-4 py-3 text-white shadow-md sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl min-w-0 items-center justify-between gap-3">
          <Link to="/mentor" className="truncate text-base font-bold hover:opacity-90 lg:text-lg">
            Mentor Dashboard
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/" className="rounded-md px-3 py-1.5 text-xs font-medium hover:bg-white/10 lg:text-sm">
              Student app
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-medium hover:bg-white/10 lg:text-sm"
            >
              Lock
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet context={{ onAuthLost: handleAuthLost }} />
      </main>
    </div>
  )
}
