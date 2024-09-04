export type Amount = number

export interface Entry {
  key: string
  parentKey?: string
  date: string
  debitAccount: string
  creditAccount: string
  amount: Amount
  memo: string
}
