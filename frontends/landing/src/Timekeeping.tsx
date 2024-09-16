import { useState } from 'react'
import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'

export type Entry = { start: string; end: string }

export function Timekeeping() {
  const [entries, setEntries] = useState<Map<string, Entry>>(new Map())

  function addDefault() {
    setEntries((entries) =>
      new Map(entries).set(uuidv4(), {
        start: '',
        end: '',
      }),
    )
  }

  function getLastKey() {
    let lastKey
    const keys = entries.keys()

    for (const key of keys) {
      lastKey = key
    }

    return lastKey
  }

  function punchIn() {
    setEntries((entries) =>
      new Map(entries).set(uuidv4(), {
        start: getDateTime(),
        end: '',
      }),
    )
  }

  function punchOut() {
    setEntries((entries) => {
      const lastKey = getLastKey()
      if (lastKey) {
        const last = entries.get(lastKey)
        if (last) {
          return new Map(entries).set(lastKey, {
            ...last,
            end: getDateTime(),
          })
        }
      }
      throw Error('no entries to punch out')
    })
  }

  function isPunchedIn() {
    return entries.get(getLastKey() || '')?.end === ''
  }

  return (
    <div className={'large_margin_around'}>
      <h1>timekeeping</h1>
      <button onClick={() => addDefault()}>add new entry</button>
      {isPunchedIn() ? (
        <button onClick={() => punchOut()}>punch out</button>
      ) : (
        <button onClick={() => punchIn()}>punch in</button>
      )}
      {Array.from(entries.entries()).map(([key, entry]) => (
        <div key={key}>
          <TextField
            label={'punch start'}
            onChange={(start) =>
              setEntries((entries) =>
                new Map(entries).set(key, { ...entry, start }),
              )
            }
            value={entry.start}
          />
          <TextField
            label={'punch end'}
            onChange={(end) =>
              setEntries((entries) =>
                new Map(entries).set(key, { ...entry, end }),
              )
            }
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
