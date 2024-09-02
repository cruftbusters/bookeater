import { useEffect, useState } from 'react'
import { Entry } from './types'
import database from './DexieDatabase'

export function useJournal() {
  const [entries, setEntries] = useState<Entry[]>([])

  async function reset() {
    const entry = defaultEntry()
    await database.entries.put(entry)
    await database.journals.put({ key: 'default', entryKey: entry.key })
    setEntries([entry])
  }

  useEffect(() => {
    async function loadJournal() {
      if (database.journals) {
        const journal = await database.journals.get('default')
        if (journal) {
          const entries = []

          const { entryKey } = journal
          let entry = await database.entries.get(entryKey)
          while (entry) {
            entries.unshift(entry)
            entry = entry.parentKey
              ? await database.entries.get(entry.parentKey)
              : undefined
          }
          if (entries) {
            return setEntries(entries)
          }
        }

        await reset()
      }
    }

    loadJournal()
  }, [])

  const addEntry = async (entry = defaultEntry()) => {
    const linkedEntry = await new Promise<Entry>((resolve) => {
      setEntries((entries) => {
        const parentKey =
          entries.length > 0 ? entries[entries.length - 1].key : undefined
        entry = { ...entry, parentKey }
        resolve(entry)
        return entries.concat([entry])
      })
    })

    await database.entries.put(linkedEntry)
    await database.journals.put({ key: 'default', entryKey: entry.key })
  }

  const updateEntry = async (key: string, update: (entry: Entry) => Entry) => {
    const updatedEntry = await new Promise<Entry>((resolve) =>
      setEntries((entries) =>
        entries.map((entry) => {
          if (entry.key === key) {
            const updatedEntry = update(entry)
            resolve(updatedEntry)
            return updatedEntry
          }
          return entry
        }),
      ),
    )

    await database.entries.put(updatedEntry)
  }

  const deleteEntry = async (key: string) => {
    const entries = await new Promise<Array<Entry>>((resolve) =>
      setEntries((entries) => {
        let index = 0

        const results = []
        for (
          let entry = entries[0];
          entry && entry.key !== key;
          entry = entries[++index]
        ) {
          results.push(entry)
        }

        for (let entry = entries[++index]; entry; entry = entries[++index]) {
          const update: Entry = {
            ...entry,
            parentKey:
              results.length > 0 ? results[results.length - 1].key : undefined,
          }
          results.push(update)
        }

        resolve(results)

        return results
      }),
    )

    await Promise.all(entries.map((entry) => database.entries.put(entry)))

    if (entries.length > 0) {
      await database.journals.put({
        key: 'default',
        entryKey: entries[entries.length - 1].key,
      })
    } else {
      await reset()
    }
  }

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
