export type Amount = number

export interface Entry {
  key: string
  debitAccount: string
  creditAccount: string
  amount: Amount
}
