export async function api(path, options = {}) {
  const { headers: optionHeaders, ...rest } = options
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...optionHeaders,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
