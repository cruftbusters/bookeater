import Dexie, { EntityTable } from 'dexie'
import { LinkedEntry } from './types'

const database = new Dexie('bookkeeping')

export interface Journal {
  key: string,
  entryKey: string
}

database.version(1).stores({ entries: 'key', journals: 'key' })

export default database as Dexie & {
  entries: EntityTable<LinkedEntry, 'key'>,
  journals: EntityTable<Journal, 'key'>,
}
