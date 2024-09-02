import { useState } from 'react'
import { Entry } from './types'

export function useJournal() {
  const [entries, setEntries] = useState<Entry[]>([defaultEntry()])

  const addEntry = (entry = defaultEntry()) =>
    setEntries((entries) => entries.concat([entry]))

  const updateEntry = (key: string, update: (entry: Entry) => Entry) =>
    setEntries((entries) =>
      entries.map((entry) => (entry.key === key ? update(entry) : entry)),
    )

  const deleteEntry = (key: string) =>
    setEntries((entries) => entries.filter((entry) => entry.key !== key))

  return { entries, addEntry, updateEntry, deleteEntry }
}

function defaultEntry(): Entry {
  return {
    key: crypto.randomUUID(),
    debitAccount: '',
    creditAccount: '',
    amount: 0,
  }
}
