const LEGACY_KEYS = {
  learned: 'reflection-learned',
  hard: 'reflection-hard',
  hours: 'reflection-hours',
  confidence: 'reflection-confidence',
}

export function reflectionFieldKey(week, field) {
  return `reflection-w${week}-${field}`
}

export function getReflectionForWeek(fields, week, legacyWeek = null) {
  const read = (field) => {
    const value = fields[reflectionFieldKey(week, field)]
    if (value !== undefined && value !== '') return value
    if (legacyWeek === week && LEGACY_KEYS[field]) {
      const legacy = fields[LEGACY_KEYS[field]]
      if (legacy !== undefined && legacy !== '') return legacy
    }
    return ''
  }

  return {
    learned: read('learned'),
    hard: read('hard'),
    hours: read('hours'),
    confidence: read('confidence'),
    submittedAt: fields[reflectionFieldKey(week, 'submitted-at')] || '',
  }
}

export function isReflectionSubmitted(fields, week, legacyWeek = null) {
  return !!getReflectionForWeek(fields, week, legacyWeek).submittedAt
}

export function buildReflectionFields(week, data) {
  return {
    [reflectionFieldKey(week, 'learned')]: data.learned,
    [reflectionFieldKey(week, 'hard')]: data.hard,
    [reflectionFieldKey(week, 'hours')]: data.hours,
    [reflectionFieldKey(week, 'confidence')]: data.confidence,
    [reflectionFieldKey(week, 'submitted-at')]: data.submittedAt,
  }
}

export function listSubmittedReflections(fields, maxWeek = 10, legacyWeek = null) {
  const items = []
  for (let w = 1; w <= maxWeek; w++) {
    const reflection = getReflectionForWeek(fields, w, legacyWeek)
    if (reflection.submittedAt) {
      items.push({ week: w, ...reflection })
    }
  }
  return items.sort((a, b) => b.week - a.week)
}

export function formatReflectionDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}
