import { useProgress } from '../context/ProgressContext'

function CheckItem({ id, label }) {
  const { state, toggleCheck } = useProgress()
  const checked = !!state.checks[id]
  return (
    <li className={`flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 ${checked ? 'opacity-60' : ''}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => toggleCheck(id, e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
      />
      <label htmlFor={id} className={`text-sm ${checked ? 'line-through' : ''}`}>
        {label}
      </label>
    </li>
  )
}

export default function AssignmentHero({ assignment, wi }) {
  const { state } = useProgress()
  const reqTotal = assignment.requirements.length
  const reqDone = assignment.requirements.filter((_, ri) => state.checks[`w${wi}-a-${ri}`]).length
  const submitted = !!state.checks[`submit-w${assignment.week}`]
  const pct = reqTotal ? Math.round((reqDone / reqTotal) * 100) : 0
  const isCapstone = assignment.phase === 'Capstone'

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-lg ${isCapstone ? 'border-emerald-400' : 'border-slate-200'}`}>
      <div className={`p-6 text-white lg:p-8 ${isCapstone ? 'bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-400' : 'bg-gradient-to-br from-primary via-sky-800 to-accent'}`}>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase">{assignment.phase}</span>
          <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs">Due: {assignment.due}</span>
          {submitted && (
            <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold">Submitted</span>
          )}
        </div>
        <h1 className="mt-4 text-2xl font-bold lg:text-3xl">
          Assignment {assignment.week} — {assignment.name}
        </h1>
        <p className="mt-2 text-base text-white/95 lg:text-lg">{assignment.tagline}</p>
        <p className="mt-2 text-sm text-white/80">Submit via: {assignment.submit_via}</p>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs">
            <span>Requirements progress</span>
            <span>{reqDone}/{reqTotal} ({pct}%)</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-5 bg-white p-6 lg:p-8">
        {assignment.callout && (
          <div
            className={`rounded-lg border-l-4 p-4 text-sm ${
              assignment.callout.type === 'success'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-accent bg-sky-50'
            }`}
          >
            {assignment.callout.text}
          </div>
        )}

        {assignment.why && (
          <div className="rounded-lg border-l-4 border-accent bg-sky-50 p-4 text-sm leading-relaxed">
            <strong>Why this matters:</strong> {assignment.why}
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-primary">The challenge</h3>
          <p className="mt-2 text-slate-700">{assignment.task}</p>
        </div>

        {assignment.expected_output && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-primary">Expected output example</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-800 p-4 text-sm text-slate-100 whitespace-pre-wrap">
              {assignment.expected_output}
            </pre>
          </div>
        )}

        {(assignment.sections || []).map((sec) => (
          <div key={sec.title}>
            <h3 className="text-xs font-bold uppercase tracking-wide text-primary">{sec.title}</h3>
            {sec.type === 'code' ? (
              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-800 p-4 text-sm text-slate-100 whitespace-pre-wrap">
                {sec.content}
              </pre>
            ) : sec.type === 'ordered_list' ? (
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                {sec.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {sec.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {assignment.bonus?.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
            <h3 className="text-xs font-bold uppercase text-amber-800">
              Bonus challenges <span className="rounded bg-amber-500 px-2 py-0.5 text-white">+10 pts each</span>
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {assignment.bonus.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {assignment.rubric?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-primary">Grading rubric (100 points)</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="border border-slate-300 px-3 py-2 text-left">Criteria</th>
                    <th className="border border-slate-300 px-3 py-2 w-16">Pts</th>
                    {assignment.rubric.some((r) => r.good) && (
                      <th className="border border-slate-300 px-3 py-2 text-left">What &quot;good&quot; looks like</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {assignment.rubric.map((row) => (
                    <tr key={row.criteria} className="even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2">{row.criteria}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold text-primary">
                        {row.points}
                      </td>
                      {assignment.rubric.some((r) => r.good) && (
                        <td className="border border-slate-200 px-3 py-2">{row.good || '—'}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-slate-50 p-5">
          <h3 className="text-sm font-bold text-primary">Your checklist — tick each requirement as you complete it</h3>
          <ul className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {assignment.requirements.map((req, ri) => (
              <CheckItem key={ri} id={`w${wi}-a-${ri}`} label={req} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
