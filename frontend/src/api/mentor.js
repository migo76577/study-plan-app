import { api } from '../api'

const MENTOR_KEY_STORAGE = 'mentorKey'

export function getMentorKey() {
  return sessionStorage.getItem(MENTOR_KEY_STORAGE) || ''
}

export function setMentorKey(key) {
  if (key) sessionStorage.setItem(MENTOR_KEY_STORAGE, key)
  else sessionStorage.removeItem(MENTOR_KEY_STORAGE)
}

export async function mentorApi(path, options = {}) {
  return api(path, {
    ...options,
    headers: {
      'X-Mentor-Key': getMentorKey(),
      ...options.headers,
    },
  })
}

export function buildShareMessage(student, code) {
  const origin = window.location.origin
  return [
    `Hi ${student.name},`,
    '',
    `Your Study Plan access code is: ${code}`,
    '',
    `Log in here: ${origin}`,
    '',
    "Save this code — you'll need it on every device.",
  ].join('\n')
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
    return iso
  }
}
