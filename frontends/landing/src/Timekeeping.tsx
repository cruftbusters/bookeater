import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'
import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export type Entry = { key: string; start: string; end: string }

const database = new Dexie('bookeater-landing') as Dexie & {
  entries: EntityTable<Entry, 'key'>
}

database.version(1).stores({
  entries: 'key, start',
})

export function Timekeeping() {
  const entries = useLiveQuery(() => database.entries.toArray())
  const head = useLiveQuery(() => database.entries.orderBy('start').last())

  function addDefault() {
    database.entries.put({ key: uuidv4(), start: '', end: '' })
  }

  function punchIn() {
    database.entries.put({ key: uuidv4(), start: getDateTime(), end: '' })
  }

  function punchOut() {
    if (head) {
      database.entries.put({ ...head, end: getDateTime() })
    }
  }

  return (
    <div className={'large_margin_around'}>
      <h1>timekeeping</h1>
      <button onClick={() => addDefault()}>add new entry</button>
      {head?.end === '' ? (
        <button onClick={() => punchOut()}>punch out</button>
      ) : (
        <button onClick={() => punchIn()}>punch in</button>
      )}
      {entries?.map((entry) => (
        <div key={entry.key}>
          <TextField
            label={'punch start'}
            onChange={(start) => database.entries.put({ ...entry, start })}
            value={entry.start}
          />
          <TextField
            label={'punch end'}
            onChange={(end) => database.entries.put({ ...entry, end })}
            value={entry.end}
          />
          <label>
            duration
            <input readOnly value={duration(entry)} />
          </label>
        </div>
      ))}
    </div>
  )
}

function TextField({
  label,
  onChange,
  value = '',
}: {
  label: string
  onChange: (value: string) => void
  value?: string
}) {
  return (
    <label>
      {label}
      <input onChange={(e) => onChange(e.target.value)} value={value} />
    </label>
  )
}

function getDateTime() {
  const iso = new Date().toISOString()
  const [date, time] = iso.substring(0, 19).split('T')
  return `${date} ${time}`
}
