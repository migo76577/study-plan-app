import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useProgress } from '../context/ProgressContext'
import {
  buildReflectionFields,
  formatReflectionDate,
  getReflectionForWeek,
  isReflectionSubmitted,
  listSubmittedReflections,
} from '../utils/reflections'

const EMPTY_FORM = { learned: '', hard: '', hours: '', confidence: '' }

const readOnlyFieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 read-only:cursor-default'

const editableFieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export default function ReflectionPage() {
  const { state, maxUnlockedWeek, saveProgressNow, saveStatus } = useProgress()
  const [selectedWeek, setSelectedWeek] = useState(maxUnlockedWeek)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSelectedWeek(maxUnlockedWeek)
  }, [maxUnlockedWeek])

  useEffect(() => {
    const reflection = getReflectionForWeek(state.fields, selectedWeek, maxUnlockedWeek)
    setForm({
      learned: reflection.learned,
      hard: reflection.hard,
      hours: reflection.hours,
      confidence: reflection.confidence,
    })
  }, [selectedWeek, state.fields, maxUnlockedWeek])

  const submitted = useMemo(
    () => listSubmittedReflections(state.fields, maxUnlockedWeek, maxUnlockedWeek),
    [state.fields, maxUnlockedWeek],
  )

  const currentReflection = getReflectionForWeek(state.fields, selectedWeek, maxUnlockedWeek)
  const isLocked = isReflectionSubmitted(state.fields, selectedWeek, maxUnlockedWeek)

  const updateField = (field, value) => {
    if (isLocked) return
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (isLocked) {
      toast.info('This reflection was already submitted and cannot be edited.')
      return
    }
    if (!form.learned.trim()) {
      return
    }
    setSaving(true)
    try {
      const submittedAt = new Date().toISOString()
      const nextState = {
        ...state,
        fields: {
          ...state.fields,
          ...buildReflectionFields(selectedWeek, { ...form, submittedAt }),
        },
      }
      await saveProgressNow(nextState, {
        message: `Week ${selectedWeek} reflection submitted`,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-primary">Weekly Reflection</h1>
        <p className="mt-0.5 text-sm font-medium text-slate-700">
          Take 5 minutes every Saturday to note what you learned. You're on Week {maxUnlockedWeek}.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: maxUnlockedWeek }, (_, i) => i + 1).map((week) => {
          const saved = isReflectionSubmitted(state.fields, week, maxUnlockedWeek)
          const active = week === selectedWeek
          return (
            <button
              key={week}
              type="button"
              onClick={() => setSelectedWeek(week)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : saved
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Week {week}
              {saved && <span className="ml-1 opacity-80">{active ? '· submitted' : '✓'}</span>}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-primary">Week {selectedWeek}</h2>
            {isLocked && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                Submitted {formatReflectionDate(currentReflection.submittedAt)}
              </span>
            )}
          </div>

          {isLocked && (
            <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              This reflection is locked. Submitted reflections cannot be edited or resubmitted.
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">What I learned this week</label>
              <textarea
                rows={3}
                readOnly={isLocked}
                className={isLocked ? readOnlyFieldClass : editableFieldClass}
                value={form.learned}
                onChange={(e) => updateField('learned', e.target.value)}
                placeholder="Key concepts, skills, or breakthroughs…"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">What was hardest</label>
              <textarea
                rows={3}
                readOnly={isLocked}
                className={isLocked ? readOnlyFieldClass : editableFieldClass}
                value={form.hard}
                onChange={(e) => updateField('hard', e.target.value)}
                placeholder="Topics or tasks that challenged you…"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Hours studied</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  readOnly={isLocked}
                  className={isLocked ? readOnlyFieldClass : editableFieldClass}
                  value={form.hours}
                  onChange={(e) => updateField('hours', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Confidence (1–10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  readOnly={isLocked}
                  className={isLocked ? readOnlyFieldClass : editableFieldClass}
                  value={form.confidence}
                  onChange={(e) => updateField('confidence', e.target.value)}
                />
              </div>
            </div>
          </div>

          {!isLocked && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || saveStatus === 'pending' || !form.learned.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Submitting…' : 'Submit reflection'}
              </button>
              {!form.learned.trim() && (
                <p className="text-xs font-medium text-slate-500">Add what you learned to submit.</p>
              )}
            </div>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Submitted reflections</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              {submitted.length
                ? `${submitted.length} week${submitted.length === 1 ? '' : 's'} submitted (read-only)`
                : 'Submitted reflections appear here'}
            </p>

            {submitted.length === 0 ? (
              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-4 text-center text-xs font-medium text-slate-600">
                No reflections submitted yet. Fill in the form and click Submit.
              </p>
            ) : (
              <ul className="mt-3 max-h-[min(60vh,32rem)] space-y-2 overflow-y-auto">
                {submitted.map((item) => (
                  <li key={item.week}>
                    <button
                      type="button"
                      onClick={() => setSelectedWeek(item.week)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors hover:border-accent hover:bg-sky-50/50 ${
                        selectedWeek === item.week
                          ? 'border-accent bg-sky-50/80'
                          : 'border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-primary">
                          Week {item.week} · Submitted
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {formatReflectionDate(item.submittedAt)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-700">{item.learned}</p>
                      {(item.hours || item.confidence) && (
                        <p className="mt-1 text-[10px] font-medium text-slate-500">
                          {item.hours ? `${item.hours}h studied` : ''}
                          {item.hours && item.confidence ? ' · ' : ''}
                          {item.confidence ? `Confidence ${item.confidence}/10` : ''}
                        </p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
