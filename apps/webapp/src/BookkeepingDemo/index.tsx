import { useState } from 'react'
import rootStyles from '../index.module.scss'
import localStyles from './index.module.scss'
import cn from '../cn'

const styles = Object.assign(rootStyles, localStyles)

const defaultEntry = {
  debitAccount: '',
  creditAccount: '',
  amount: 0,
}

type Entry = { debitAccount: string; creditAccount: string; amount: Amount }

type State = { entries: Entry[] }

export default function BookkeepingDemo() {
  const [state, setState] = useState<State>({
    entries: [defaultEntry],
  })

  const addEntry = (entry: Entry) => {
    return setState((state) => ({ entries: state.entries.concat([entry]) }))
  }

  const updateEntry = (index: number, update: (entry: Entry) => Entry) =>
    setState((state) => ({
      entries: state.entries.map((entry, checkIndex) =>
        checkIndex === index ? update(entry) : entry,
      ),
    }))

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Bookkeeping Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        <div className={cn(styles.book_grid)}>
          <div className={cn(styles.entry)}>
            <span>debit account</span>
            <span>credit account</span>
            <span>amount</span>
          </div>
          {state.entries.map((entry, index) => (
            <div aria-label="entry" key={index} className={cn(styles.entry)}>
              <input
                aria-label="debit account"
                value={entry.debitAccount}
                onChange={(e) =>
                  updateEntry(index, (entry) => ({
                    ...entry,
                    debitAccount: e.target.value,
                  }))
                }
              />
              <input
                aria-label="credit account"
                value={entry.creditAccount}
                onChange={(e) =>
                  updateEntry(index, (entry) => ({
                    ...entry,
                    creditAccount: e.target.value,
                  }))
                }
              />
              <AmountInput
                aria-label="amount"
                value={entry.amount}
                onUpdate={(credit) =>
                  updateEntry(index, (entry) => ({ ...entry, amount: credit }))
                }
              />
            </div>
          ))}
          <button
            onClick={() => addEntry(defaultEntry)}
            className={cn(styles.add_entry)}
          >
            add entry
          </button>
          <Summary state={state} />
        </div>
      </div>
    </>
  )
}

function Summary({ state }: { state: State }) {
  const summary = new Map<string, Amount>()

  function accrue(account: string, amount: Amount) {
    const balance = amount + (summary.get(account) || 0)
    if (balance === 0) {
      summary.delete(account)
    } else {
      summary.set(account, balance)
    }
  }

  for (const entry of state.entries) {
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

type Amount = number

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
