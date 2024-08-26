import { useState } from 'react'
import cn from '../cn'
import styles from '../index.module.scss'

type Amount = number
function FormatAmount({ children: amount }: { children: Amount }) {
  const label = amount< 0 ? 'credit' : 'debit'
  return `${label} ${Math.abs(amount)}`
}
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
type Entry = { account: string; debit: Amount; credit: Amount }
type State = { entries: Entry[] }
function updateEntry(
  state: State,
  index: number,
  update: (entry: Entry) => Entry,
) {
  return {
    entries: state.entries.map((entry, checkIndex) =>
      checkIndex === index ? update(entry) : entry,
    ),
  }
}

function addEntry(state: State, initialize: () => Entry) {
  return {
    entries: state.entries.concat([initialize()]),
  }
}

export default function BooksDemo() {
  const [state, setState] = useState<State>({
    entries: [],
  })

  const summary: Record<string, Amount> = {}
  for (const entry of state.entries) {
    let balance = summary[entry.account] || 0
    balance += entry.debit
    balance -= entry.credit
    summary[entry.account] = balance
  }

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Books Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        {state.entries.map((entry, index) => (
          <div key={index}>
            <label>
              account
              <input
                value={entry.account}
                onChange={(e) =>
                  setState((state) =>
                    updateEntry(state, index, (entry) => ({
                      ...entry,
                      account: e.target.value,
                    })),
                  )
                }
              />
            </label>
            <label>
              debit
              <AmountInput
                value={entry.debit}
                onChange={(debit) =>
                  setState((state) =>
                    updateEntry(state, index, (entry) => ({
                      ...entry,
                      debit,
                    })),
                  )
                }
              />
            </label>
            <label>
              credit
              <AmountInput
                value={entry.credit}
                onChange={(credit) =>
                  setState((state) =>
                    updateEntry(state, index, (entry) => ({
                      ...entry,
                      credit,
                    })),
                  )
                }
              />
            </label>
          </div>
        ))}
        <div key={state.entries.length}>
          <label>
            account
            <input
              onChange={(e) =>
                setState(
                  addEntry(state, () => ({
                    account: e.target.value,
                    debit: 0,
                    credit: 0,
                  })),
                )
              }
            />
          </label>
          <label>
            debit
            <input />
          </label>
          <label>
            credit
            <input />
          </label>
        </div>
        <div>
          summary:
          {Object.entries(summary).map(([account, balance]) => (
            <div>
              {account}: <FormatAmount>{balance}</FormatAmount>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
