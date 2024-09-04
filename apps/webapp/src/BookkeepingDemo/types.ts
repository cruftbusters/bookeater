import { v4 as uuidv4 } from 'uuid'

export type Amount = number

export interface Entry {
  key: string
  date: string
  debitAccount: string
  creditAccount: string
  amount: Amount
  memo: string
}

export interface LinkedEntry extends Entry {
  parentKey?: string
}

export function entry(update: ((entry: Entry) => Entry) = identity): Entry {
  return update({
    key: uuidv4(),
    date: '',
    debitAccount: '',
    creditAccount: '',
    amount: 0,
    memo: '',
  })
}

function identity<T>(value: T): T {
  return value
}
