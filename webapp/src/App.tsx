import { useState } from 'react'
import styles from './index.module.scss'
import { v4 as uuidv4 } from 'uuid'
import { PrettyDuration } from './PrettyDuration.tsx'

function App() {
  const { entries, toggle, update, clear } = usePunchCard()
  const punchButtonText =
    entries.length === 0 || entries[entries.length - 1].end !== undefined
      ? 'punch in'
      : 'punch out'
  return (
    <div className={styles.container}>
      <button onClick={() => toggle()} className={styles.button}>
        {punchButtonText}
      </button>
      <div className={styles.grid}>
        <div className={[styles.row, styles.rowHeader].join(' ')}>
          <div>start</div>
          <div>end</div>
          <div>duration</div>
        </div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={styles.row}
            style={{
              order: entries.length - index,
            }}
          >
            <ForEntry entry={entry} update={update} />
          </div>
        ))}
      </div>
      {entries.length > 0 && (
        <button onClick={() => clear()} className={styles.button}>
          clear
        </button>
      )}
    </div>
  )
}

type Entry = {
  id: string
  start: Date
  end?: Date
}

function usePunchCard() {
  const [entries, setEntries] = useState<Array<Entry>>([])
  return {
    entries,
    toggle: () =>
      setEntries((entries) => {
        if (
          entries.length === 0 ||
          entries[entries.length - 1].end !== undefined
        ) {
          return entries.concat({
            id: uuidv4(),
            start: new Date(),
          })
        } else {
          return entries.map((entry, index) => {
            if (index === entries.length - 1) {
              return {
                ...entry,
                end: new Date(),
              }
            }
            return entry
          })
        }
      }),
    update: (update: Entry) =>
      setEntries((entries) =>
        entries.map((entry) => (entry.id === update.id ? update : entry)),
      ),
    clear: () => setEntries([]),
  }
}

function ForEntry({
  entry,
  update,
}: {
  entry: Entry
  update: (entry: Entry) => void
}) {
  const { start, end } = entry
  const [startBuffer, setStartBuffer] = useState('')
  const [endBuffer, setEndBuffer] = useState('')

  return (
    <>
      <input
        value={startBuffer || start.toISOString()}
        onChange={(e) => {
          const result = new Date(e.target.value)
          if (!isNaN(result.getTime())) {
            update({
              ...entry,
              start: result,
            })
            setStartBuffer('')
          } else {
            setStartBuffer(e.target.value)
          }
        }}
        className={[styles.field]
          .concat([startBuffer !== '' ? styles.unsaved : ''])
          .join(' ')}
      />
      <input
        value={endBuffer || end?.toISOString() || ''}
        onChange={(e) => {
          if (e.target.value === '') {
            update({
              ...entry,
              end: undefined,
            })
            setEndBuffer('')
          } else {
            const result = new Date(e.target.value)
            if (!isNaN(result.getTime())) {
              update({
                ...entry,
                end: result,
              })
              setEndBuffer('')
            } else {
              setEndBuffer(e.target.value)
            }
          }
        }}
        className={[styles.field]
          .concat([endBuffer !== '' ? styles.unsaved : ''])
          .join(' ')}
      />
      <div>
        {end ? (
          <PrettyDuration seconds={(end.getTime() - start.getTime()) / 1000} />
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default App
