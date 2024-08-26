import { useState } from 'react'
import cn from '../cn'
import styles from '../index.module.scss'

const defaultEntry = {
  account: '',
  debit: 0,
  credit: 0,
}

type Entry = { account: string; debit: Amount; credit: Amount }

type State = { entries: Entry[] }

export default function BooksDemo() {
  const [state, setState] = useState<State>({
    entries: [defaultEntry],
  })
  console.log(state)

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
        Books Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        {state.entries.map((entry, index) => (
          <div key={index}>
            entry
            <label>
              account
              <input
                value={entry.account}
                onChange={(e) =>
                  updateEntry(index, (entry) => ({
                    ...entry,
                    account: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              debit
              <AmountInput
                value={entry.debit}
                onChange={(debit) =>
                  updateEntry(index, (entry) => ({ ...entry, debit }))
                }
              />
            </label>
            <label>
              credit
              <AmountInput
                value={entry.credit}
                onChange={(credit) =>
                  updateEntry(index, (entry) => ({ ...entry, credit }))
                }
              />
            </label>
          </div>
        ))}
        <button onClick={() => addEntry(defaultEntry)}>add entry</button>
        <Summary state={state} />
      </div>
    </>
  )
}

function Summary({ state }: { state: State }) {
  const summary: Record<string, Amount> = {}
  for (const entry of state.entries) {
    let balance = summary[entry.account] || 0
    balance += entry.debit
    balance -= entry.credit
    summary[entry.account] = balance
  }

  if (Object.keys(summary).length === 1 && summary[''] === 0) {
    return (
      <div>
        summary:
        <div>nothing to report :)</div>
      </div>
    )
  }

  return (
    <div>
      summary:
      {Object.entries(summary).map(([account, balance]) => (
        <div key={account}>
          {account}: <FormatAmount>{balance}</FormatAmount>
        </div>
      ))}
    </div>
  )
}

type Amount = number

function AmountInput({
  value,
  onChange,
}: {
  value: Amount
  onChange: (amount: Amount) => void
}) {
  const [localValue, setLocalValue] = useState('')
  return (
    <input
      value={localValue || value}
      onChange={(e) => {
        const localValue = e.target.value
        const value = parseInt(localValue)
        if (isNaN(value)) {
          setLocalValue(localValue)
        } else {
          setLocalValue('')
          onChange(value)
        }
      }}
    />
  )
}

function FormatAmount({ children: amount }: { children: Amount }) {
  const label = amount < 0 ? 'credit' : 'debit'
  return `${label} ${Math.abs(amount)}`
}
