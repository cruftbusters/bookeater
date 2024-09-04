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
    key: crypto.randomUUID(),
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
