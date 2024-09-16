import { useState } from 'react'
import { duration } from './duration'
import { v4 as uuidv4 } from 'uuid'

export type Entry = { start: string; end: string }

export function Timekeeping() {
  const [entries, setEntries] = useState<Map<string, Entry>>(new Map())
  return (
    <div className={'large_margin_around'}>
      <h1>timekeeping</h1>
      <label>
        assignment name
        <input />
      </label>
      <label>
        timezone
        <input />
      </label>
      <button
        onClick={() =>
          setEntries((entries) =>
            new Map(entries).set(uuidv4(), {
              start: '',
              end: '',
            }),
          )
        }
      >
        add new entry
      </button>
      {Array.from(entries.entries()).map(([key, entry]) => (
        <div key={key}>
          <TextField
            label={'punch start'}
            onChange={(start) =>
              setEntries((entries) =>
                new Map(entries).set(key, { ...entry, start }),
              )
            }
          />
          <TextField
            label={'punch end'}
            onChange={(end) =>
              setEntries((entries) =>
                new Map(entries).set(key, { ...entry, end }),
              )
            }
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
}: {
  label: string
  onChange: (value: string) => void
}) {
  return (
    <label>
      {label}
      <input onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
