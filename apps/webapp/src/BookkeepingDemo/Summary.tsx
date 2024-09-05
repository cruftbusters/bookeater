import { Entry, Amount } from './types'

export function Summary({ entries }: { entries: Entry[] }) {
  const summary = new Map<string, Amount>()

  function accrue(account: string, amount: Amount) {
    const balance = amount + (summary.get(account) || 0)
    if (balance === 0) {
      summary.delete(account)
    } else {
      summary.set(account, balance)
    }
  }

  for (const entry of entries) {
    accrue(entry.debitAccount, entry.amount)
    accrue(entry.creditAccount, -entry.amount)
  }

  return (
    <div>
      summary:
      {summary.size > 0 ? (
        Array.from(summary.entries()).map(([account, balance]) => (
          <div key={account}>
            {account}: <FormatAmount>{balance}</FormatAmount>
          </div>
        ))
      ) : (
        <div>nothing to report :)</div>
      )}
    </div>
  )
}

function FormatAmount({ children: amount }: { children: Amount }) {
  const label = amount < 0 ? 'credit' : 'debit'
  return `${label} ${Math.abs(amount)}`
}
