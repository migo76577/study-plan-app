import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../api'
import { computeLocalStats, canSubmitAssignment } from '../utils/progress'

const ProgressContext = createContext(null)
const SAVE_TOAST_ID = 'save-progress'

export function ProgressProvider({ children }) {
  const [weeks, setWeeks] = useState([])
  const [assignments, setAssignments] = useState([])
  const [user, setUser] = useState(null)
  const [state, setState] = useState({ checks: {}, fields: {}, scores: {} })
  const [maxUnlockedWeek, setMaxUnlockedWeek] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('ok')
  const saveTimer = useRef(null)
  const maxUnlockedRef = useRef(1)
  const pendingSubmitWeek = useRef(null)

  const stats = useMemo(
    () => (weeks.length ? computeLocalStats(weeks, assignments, state) : null),
    [weeks, assignments, state],
  )

  const weeksReady = weeks.length > 0 && assignments.length > 0

  const loadAll = useCallback(async () => {
    try {
      const curriculum = await api('/api/curriculum')
      setWeeks(curriculum.weeks || [])
      setAssignments(curriculum.assignments || [])
      const me = await api('/api/me')
      if (!me.logged_in) {
        setUser(null)
        return false
      }
      setUser(me)
      setState(me.progress || { checks: {}, fields: {}, scores: {} })
      const unlocked = me.max_unlocked_week ?? 1
      setMaxUnlockedWeek(unlocked)
      maxUnlockedRef.current = unlocked
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll().catch(() => {
      toast.error('Could not load study plan. Please refresh.')
    })
  }, [loadAll])

  const scheduleSave = useCallback((nextState) => {
    setSaveStatus('pending')
    toast.loading('Saving progress…', { id: SAVE_TOAST_ID })
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await api('/api/progress', {
          method: 'PUT',
          body: JSON.stringify(nextState),
        })
        setSaveStatus('ok')
        toast.success('Progress saved', { id: SAVE_TOAST_ID, duration: 2000 })

        const me = await api('/api/me')
        const newMax = me.max_unlocked_week ?? 1
        if (newMax > maxUnlockedRef.current) {
          toast.success(`Week ${newMax} unlocked! Keep going.`, { duration: 5000 })
        }
        maxUnlockedRef.current = newMax
        setMaxUnlockedWeek(newMax)

        if (pendingSubmitWeek.current) {
          const w = pendingSubmitWeek.current
          pendingSubmitWeek.current = null
          toast.success(`Assignment ${w} submitted!`, {
            duration: 4000,
            description: w < 10 ? `Week ${w + 1} is now available.` : 'Capstone submitted — amazing work!',
          })
        }
      } catch (err) {
        setSaveStatus('error')
        pendingSubmitWeek.current = null
        const message = err.message || 'Failed to save progress'
        toast.error(message, {
          id: SAVE_TOAST_ID,
          duration: 5000,
          description: err.status === 400 ? 'Finish all daily tasks on your Dashboard first.' : 'Check your connection and try again.',
        })
        if (err.status === 400) {
          try {
            const me = await api('/api/me')
            if (me.logged_in) setState(me.progress || { checks: {}, fields: {}, scores: {} })
          } catch {
            /* ignore reload failure */
          }
        }
      }
    }, 600)
  }, [])

  const updateState = useCallback(
    (updater) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        scheduleSave(next)
        return next
      })
    },
    [scheduleSave],
  )

  const toggleCheck = useCallback(
    (id, checked) => {
      const submitMatch = id.match(/^submit-w(\d+)$/)
      if (submitMatch && checked) {
        const weekNum = parseInt(submitMatch[1], 10)
        const wi = weekNum - 1
        const week = weeks[wi]
        const assignment = assignments[wi]
        if (week && assignment && !canSubmitAssignment(week, assignment, state.checks, wi)) {
          toast.error(`Complete all Week ${weekNum} tasks on your Dashboard first.`, {
            duration: 5000,
            description: 'Check off every daily task and assignment checklist item before submitting.',
          })
          return
        }
        pendingSubmitWeek.current = weekNum
      } else if (submitMatch && !checked) {
        pendingSubmitWeek.current = null
      }
      updateState((prev) => ({
        ...prev,
        checks: { ...prev.checks, [id]: checked },
      }))
    },
    [updateState, weeks, assignments, state.checks],
  )

  const saveField = useCallback(
    (key, value) => {
      updateState((prev) => ({
        ...prev,
        fields: { ...prev.fields, [key]: value },
      }))
    },
    [updateState],
  )

  const saveProgressNow = useCallback(async (nextState, options = {}) => {
    clearTimeout(saveTimer.current)
    setSaveStatus('pending')
    toast.loading('Saving…', { id: SAVE_TOAST_ID })
    try {
      await api('/api/progress', {
        method: 'PUT',
        body: JSON.stringify(nextState),
      })
      setState(nextState)
      setSaveStatus('ok')
      toast.success(options.message || 'Saved', { id: SAVE_TOAST_ID, duration: 2000 })

      const me = await api('/api/me')
      const newMax = me.max_unlocked_week ?? 1
      if (newMax > maxUnlockedRef.current) {
        toast.success(`Week ${newMax} unlocked! Keep going.`, { duration: 5000 })
      }
      maxUnlockedRef.current = newMax
      setMaxUnlockedWeek(newMax)
    } catch {
      setSaveStatus('error')
      toast.error('Failed to save', {
        id: SAVE_TOAST_ID,
        duration: 5000,
        description: 'Check your connection and try again.',
      })
      throw new Error('save failed')
    }
  }, [])

  const login = async (accessCode) => {
    const u = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ access_code: accessCode }),
    })
    await loadAll()
    toast.success(`Welcome back, ${u.name}!`)
    return u
  }

  const register = async (payload) => {
    const u = await api('/api/students', { method: 'POST', body: JSON.stringify(payload) })
    await loadAll()
    toast.success('Your study plan is ready!', {
      description: 'Save your access code before continuing.',
    })
    return u
  }

  const logout = async () => {
    await api('/api/logout', { method: 'POST' })
    setUser(null)
    setState({ checks: {}, fields: {}, scores: {} })
    setMaxUnlockedWeek(1)
    maxUnlockedRef.current = 1
    toast.success('Logged out')
  }

  const value = {
    weeks,
    assignments,
    user,
    state,
    stats,
    maxUnlockedWeek,
    loading,
    weeksReady,
    saveStatus,
    toggleCheck,
    saveField,
    saveProgressNow,
    login,
    register,
    logout,
    reload: loadAll,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
