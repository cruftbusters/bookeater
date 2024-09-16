import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'
import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import Styles from './index.css'

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
      <div>
        <button onClick={() => addDefault()}>add new entry</button>
        {head?.end === '' ? (
          <button onClick={() => punchOut()}>punch out</button>
        ) : (
          <button onClick={() => punchIn()}>punch in</button>
        )}
      </div>

      {entries ? (
        <div className={'timekeepingGrid'}>
          <div className={'timekeepingGridRow'}>
            <span>punch start</span>
            <span>punch end</span>
            <span>duration</span>
          </div>
          {entries.map((entry) => (
            <div key={entry.key} className={'timekeepingGridRow'}>
              <input
                aria-label={'punch start'}
                onChange={(e) =>
                  database.entries.put({ ...entry, start: e.target.value })
                }
                value={entry.start}
              />
              <input
                aria-label={'punch end'}
                onChange={(e) =>
                  database.entries.put({ ...entry, end: e.target.value })
                }
                value={entry.end}
              />
              <input aria-label={'duration'} readOnly value={duration(entry)} />
            </div>
          ))}
        </div>
      ) : (
        'loading entries'
      )}
    </div>
  )
}

function getDateTime() {
  const iso = new Date().toISOString()
  const [date, time] = iso.substring(0, 19).split('T')
  return `${date} ${time}`
}
