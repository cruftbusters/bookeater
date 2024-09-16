import { Entry } from './Timekeeping'

export function duration(entry: Entry): string {
  const start = new Date(entry.start)
  const end = new Date(entry.end)
  if (start > end) {
    return '-' + duration({ ...entry, start: entry.end, end: entry.start })
  }
  const delta_ms = end.getTime() - start.getTime()
  if (isNaN(delta_ms)) {
    return 'NaN'
  }
  const delta = delta_ms / 1000
  let result = ''
  const delta_days = Math.floor(delta / 60 / 60 / 24)
  if (delta_days !== 0) {
    result += `${delta_days}d`
  }
  const delta_hours = Math.floor((delta / 60 / 60) % 24)
  if (delta_hours !== 0) {
    result += `${delta_hours}h`
  }
  const delta_minutes = Math.floor((delta / 60) % 60)
  if (delta_minutes !== 0) {
    result += `${delta_minutes}m`
  }
  const delta_seconds = delta % 60
  if (delta_seconds !== 0 || result === '') {
    result += `${delta_seconds}s`
  }
  return result
}
