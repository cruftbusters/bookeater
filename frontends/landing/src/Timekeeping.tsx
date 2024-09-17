import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'
import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export type Entry = {
  key: string
  previous?: string
  start: string
  end: string
}
export type KV = { key: string; value: string }

const database = new Dexie('bookeater-landing') as Dexie & {
  entries: EntityTable<Entry, 'key'>
  kv: EntityTable<KV, 'key'>
}

database.version(1).stores({
  entries: 'key',
  kv: 'key',
})

export function Timekeeping() {
  const head = useLiveQuery(() =>
    database.kv
      .get('head')
      .then((result) =>
        result ? database.entries.get(result.value) : undefined,
      ),
  )

  const entries = useLiveQuery(async () => {
    const entries = []
    for (
      let entry = head;
      entry;
      entry = entry.previous
        ? await database.entries.get(entry.previous)
        : undefined
    ) {
      entries.unshift(entry)
    }
    return entries
  }, [head])

  async function addEntry(update = (entry: Entry) => entry) {
    const entry = update({
      key: uuidv4(),
      start: '',
      end: '',
      previous: head?.key,
    })
    await database.entries.put(entry)
    return database.kv.put({ key: 'head', value: entry.key })
  }

  function punchIn() {
    addEntry((defaultEntry) => ({
      ...defaultEntry,
      key: uuidv4(),
      start: getDateTime(),
      end: '',
    }))
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
        <button onClick={() => addEntry()}>add new entry</button>
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
