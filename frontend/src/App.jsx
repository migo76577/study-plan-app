import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ProgressProvider, useProgress } from './context/ProgressContext'
import LoginScreen from './components/LoginScreen'
import Layout from './components/Layout'
import AssignmentsPage from './pages/AssignmentsPage'
import ReflectionPage from './pages/ReflectionPage'
import Dashboard from './pages/Dashboard'
import WeekPage from './pages/WeekPage'
import MentorLayout from './components/mentor/MentorLayout'
import MentorStudentsPage from './pages/mentor/MentorStudentsPage'
import MentorStudentProfilePage from './pages/mentor/MentorStudentProfilePage'

function StudentAppRoutes() {
  const { user, loading, weeksReady } = useProgress()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your study plan…</p>
      </div>
    )
  }

  if (!user) {
    const redirectTo = location.pathname !== '/' ? location.pathname + location.search : '/'
    return <LoginScreen redirectTo={redirectTo} />
  }

  if (!weeksReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading curriculum…</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="reflection" element={<ReflectionPage />} />
        <Route path="week/:weekNum" element={<WeekPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Toaster position="top-right" richColors duration={3000} closeButton={false} />
        <Routes>
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<MentorStudentsPage />} />
            <Route path="students/:studentId" element={<MentorStudentProfilePage />} />
          </Route>
          <Route path="/*" element={<StudentAppRoutes />} />
        </Routes>
      </ProgressProvider>
    </BrowserRouter>
  )
}
