export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

export function getMotivation(percent) {
  if (percent >= 100) return 'Program complete — you did it!'
  if (percent >= 75) return 'Final stretch — stay strong!'
  if (percent >= 50) return 'Halfway there — keep pushing!'
  if (percent >= 25) return 'Building momentum — nice work!'
  if (percent > 0) return 'Great start — one task at a time.'
  return 'Ready when you are — let\'s go!'
}
