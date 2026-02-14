export function getAge(dob) {
  if (!dob) return '—'
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
