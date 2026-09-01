export default function PracticeProject({ project, compact = false }) {
  if (!project) return null

  return (
    <section
      id="practice-project"
      className={`scroll-mt-4 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-sm ${
        compact ? 'p-4' : 'rounded-2xl p-5 lg:p-6'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
          Practice project
        </span>
        <span className="text-xs text-violet-700">{project.when}</span>
      </div>

      <h2 className={`font-bold text-primary ${compact ? 'mt-2 text-base' : 'mt-3 text-lg'}`}>
        {project.name}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{project.tagline}</p>

      {project.why && (
        <p className="mt-3 rounded-lg border-l-4 border-violet-400 bg-white/80 px-3 py-2 text-sm text-slate-700">
          {project.why}
        </p>
      )}

      <div className="mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-violet-800">What to build</h3>
        <p className="mt-1 text-sm text-slate-700">{project.task}</p>
      </div>

      {project.steps?.length > 0 && (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
          {project.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}

      {project.expected_output && (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-violet-800">Example output</h3>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-800 p-4 text-sm text-slate-100 whitespace-pre-wrap">
            {project.expected_output}
          </pre>
        </div>
      )}
    </section>
  )
}
