export function weekProgress(week, assignment, checks, wi) {
  const reqs = assignment?.requirements || week.assignment || []
  let total = 0
  let done = 0
  Object.entries(week.days).forEach(([day, tasks]) => {
    tasks.forEach((_, ti) => {
      total++
      if (checks[`w${wi}-d-${day}-t${ti}`]) done++
    })
  })
  reqs.forEach((_, ri) => {
    total++
    if (checks[`w${wi}-a-${ri}`]) done++
  })
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
}

/** All daily tasks + assignment checklist items for the week (not submit checkbox). */
export function weekTasksComplete(week, assignment, checks, wi) {
  const { total, done } = weekProgress(week, assignment, checks, wi)
  return total > 0 && done === total
}

export function canSubmitAssignment(week, assignment, checks, wi) {
  return weekTasksComplete(week, assignment, checks, wi)
}

export function computeLocalStats(weeks, assignments, state) {
  const { checks, scores } = state
  let total = 0
  let done = 0
  let weeksDone = 0
  weeks.forEach((week, wi) => {
    const { total: wt, done: wd } = weekProgress(week, assignments[wi], checks, wi)
    total += wt
    done += wd
    if (wt && wd === wt) weeksDone++
  })
  const submitted = assignments.filter((a) => checks[`submit-w${a.week}`]).length
  const totalScore = Object.values(scores).reduce((s, v) => s + (parseInt(v, 10) || 0), 0)
  return {
    percent: total ? Math.round((done / total) * 100) : 0,
    done_tasks: done,
    total_tasks: total,
    weeks_done: weeksDone,
    submitted,
    total_score: totalScore,
  }
}

export function isWeekUnlocked(weekNum, maxUnlocked) {
  return weekNum <= maxUnlocked
}

export function getWeekScore(scores, week) {
  const value = scores[week] ?? scores[String(week)]
  return value === undefined || value === '' ? null : value
}
