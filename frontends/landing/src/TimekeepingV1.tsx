import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'
import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { getDateTime } from './getDateTime'

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

export function TimekeepingV1() {
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

  const punchOut = (entry: Entry) =>
    database.entries.put({ ...entry, end: getDateTime() })

  async function deleteEntry(entry: Entry) {
    if (head?.key === entry.key) {
      if (entry.previous) {
        await database.kv.put({ key: 'head', value: entry.previous })
      } else {
        await database.kv.delete('head')
      }
    } else {
      let previous = head
      let next
      while (previous && previous.key !== entry.key) {
        next = previous
        previous = previous.previous
          ? await database.entries.get(previous.previous)
          : undefined
      }
      if (previous && next) {
        await database.entries.put({ ...next, previous: previous.previous })
      }
    }
    await database.entries.delete(entry.key)
  }

  return (
    <div className={'large_margin_around'}>
      <h1>timekeeping</h1>
      <div>
        <button onClick={() => addEntry()}>add new entry</button>
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
              <button onClick={() => deleteEntry(entry)}>delete entry</button>
              {!entry.end ? (
                <button onClick={() => punchOut(entry)}>punch out</button>
              ) : entry.key === head?.key ? (
                <button onClick={() => punchIn()}>punch in</button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      ) : (
        'loading entries'
      )}
      {!head ? (
        <div>
          <button onClick={() => punchIn()}>punch in</button>
        </div>
      ) : undefined}
    </div>
  )
}
