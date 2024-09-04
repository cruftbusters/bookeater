import { useState } from 'react'
import rootStyles from '../index.module.scss'
import localStyles from './index.module.scss'
import cn from '../cn'
import { Amount, Entry } from './types'
import { useJournal } from './useJournal'

const styles = Object.assign(rootStyles, localStyles)

export default function BookkeepingDemo() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal()

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Bookkeeping Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        <div className={cn(styles.book_grid)}>
          <div className={cn(styles.entry)}>
            <span>date</span>
            <span>debit account</span>
            <span>credit account</span>
            <span>amount</span>
            <span>memo</span>
          </div>
          {entries.map((entry) => (
            <div
              aria-label="entry"
              key={entry.key}
              className={cn(styles.entry)}
            >
              <input
                aria-label="date"
                value={entry.date}
                onChange={(e) =>
                  updateEntry(entry.key, (entry) => ({
                    ...entry,
                    date: e.target.value,
                  }))
                }
              />
              <input
                aria-label="debit account"
                value={entry.debitAccount}
                onChange={(e) =>
                  updateEntry(entry.key, (entry) => ({
                    ...entry,
                    debitAccount: e.target.value,
                  }))
                }
              />
              <input
                aria-label="credit account"
                value={entry.creditAccount}
                onChange={(e) =>
                  updateEntry(entry.key, (entry) => ({
                    ...entry,
                    creditAccount: e.target.value,
                  }))
                }
              />
              <AmountInput
                aria-label="amount"
                value={entry.amount}
                onUpdate={(credit) =>
                  updateEntry(entry.key, (entry) => ({
                    ...entry,
                    amount: credit,
                  }))
                }
              />
              <input
                aria-label="memo"
                value={entry.memo}
                onChange={(e) =>
                  updateEntry(entry.key, (entry) => ({
                    ...entry,
                    memo: e.target.value,
                  }))
                }
              />
              <button
                aria-label={'delete'}
                onClick={() => deleteEntry(entry.key)}
              >
                &times;
              </button>
            </div>
          ))}
          <button onClick={() => addEntry()} className={cn(styles.add_entry)}>
            add entry
          </button>
          <Summary entries={entries} />
        </div>
      </div>
    </>
  )
}

function Summary({ entries }: { entries: Entry[] }) {
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

function AmountInput({
  value,
  onUpdate,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value: Amount
  onUpdate: (amount: Amount) => void
}) {
  const [localValue, setLocalValue] = useState('')
  return (
    <input
      {...props}
      value={localValue || value}
      onChange={(e) => {
        const localValue = e.target.value
        const value = parseInt(localValue)
        if (isNaN(value)) {
          setLocalValue(localValue)
        } else {
          setLocalValue('')
          onUpdate(value)
        }
      }}
    />
  )
}

function FormatAmount({ children: amount }: { children: Amount }) {
  const label = amount < 0 ? 'credit' : 'debit'
  return `${label} ${Math.abs(amount)}`
}
