import { useState } from 'react'
import rootStyles from '../index.module.scss'
import localStyles from './index.module.scss'
import cn from '../cn'
import { Amount, entry, Entry } from './types'
import { useJournal } from './useJournal'

const styles = Object.assign(rootStyles, localStyles)

export default function BookkeepingDemo() {
  const { entries, appendEntry, updateEntry, deleteEntry, setEntries } =
    useJournal()

  const [pendingConfirm, setPendingConfirm] = useState(false)

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Bookkeeping Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        This is an accrual-style bookkeeping demo. The journal is composed of
        editable transactions. The summary presents the chart of accounts and
        account balances resulting from the accrual of the journal entries.
      </div>
      <div
        hidden={pendingConfirm}
        className={cn(styles.gap_margin)}
        onClick={() => setPendingConfirm((b) => !b)}
      >
        <button className={cn(styles.gap_padding)}>load sample journal</button>
      </div>
      <div hidden={!pendingConfirm} className={cn(styles.gap_margin)}>
        <button
          className={cn(styles.gap_padding)}
          onClick={async () => {
            await setEntries(sampleJournal)
            setPendingConfirm(false)
          }}
        >
          are you sure you want to abandon your current journal to load the
          sample journal?
        </button>
      </div>
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
          <button
            onClick={() => appendEntry(entry())}
            className={cn(styles.add_entry, styles.gap_padding)}
          >
            add entry
          </button>
          <Summary entries={entries} />
        </div>
      </div>
    </>
  )
}

const sampleJournal = [
  entry((e) => ({
    ...e,
    date: '2024-01-01',
    debitAccount: 'expense:insurance',
    creditAccount: 'liability:reimburse owner payable',
    amount: 500,
    memo: 'owner payed for biz general liability insurance to later be reimbursed',
  })),
  entry((e) => ({
    ...e,
    date: '2024-02-01',
    debitAccount: 'assets:invoice receivable',
    creditAccount: 'income',
    amount: 7500,
    memo: 'invoice #00000 net 30 due',
  })),
  entry((e) => ({
    ...e,
    date: '2024-03-01',
    debitAccount: 'assets:credit union checking account',
    creditAccount: 'assets:invoice receivable',
    amount: 7500,
    memo: 'invoice #00000 net 30 paid',
  })),
  entry((e) => ({
    ...e,
    date: '2024-04-01',
    debitAccount: 'expense:net pay to employee',
    creditAccount: 'assets:credit union checking account',
    amount: 2000,
    memo: 'quarterly payroll',
  })),
  entry((e) => ({
    ...e,
    date: '2024-04-01',
    debitAccount: 'expense:federal payroll tax',
    creditAccount: 'assets:credit union checking account',
    amount: 400,
    memo: 'quarterly payroll',
  })),
  entry((e) => ({
    ...e,
    date: '2024-04-01',
    debitAccount: 'expense:simplified employee pension',
    creditAccount: 'liability:simplified employee pension payable',
    amount: 500,
    memo: 'quarterly payroll',
  })),
]

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
