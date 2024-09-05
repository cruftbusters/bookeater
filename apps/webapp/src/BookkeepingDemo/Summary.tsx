import { Entry, Amount } from './types'

import rootStyles from '../index.module.scss'
import localStyles from './index.module.scss'
import cn from '../cn'

const styles = Object.assign(rootStyles, localStyles)

type SummaryValue = Summary | Amount
type Summary = Map<string, SummaryValue>

export function SummaryContainer({ entries }: { entries: Entry[] }) {
  const summary: Summary = new Map()

  function getBalance(value: Summary, account: string): Amount {
    const [key] = account.split(':', 1)
    if (key === account) {
      const balance = value.get(key)
      if (balance instanceof Map) {
        throw Error(`'${account}' cannot be both an account and category`)
      }
      return balance || 0
    }

    const category = value.get(key)
    if (category instanceof Map) {
      return getBalance(category, account.substring(key.length + 1))
    } else {
      return 0
    }
  }

  function deleteAccount(value: Summary, account: string) {
    const [key] = account.split(':', 1)
    if (key === account) {
      return value.delete(key)
    }

    const category = value.get(key)
    if (category instanceof Map) {
      deleteAccount(category, account.substring(key.length + 1))
      if (!category.size) {
        value.delete(key)
      }
    }
  }

  function setBalance(value: Summary, account: string, balance: Amount) {
    const [key] = account.split(':', 1)
    if (key === account) {
      return value.set(key, balance)
    }

    let category = value.get(key)
    if (category === undefined) {
      category = new Map()
      value.set(key, category)
    } else if (!(category instanceof Map)) {
      throw Error(`'${key}' cannot be both an account and category`)
    }

    const accountLessCategory = account.substring(key.length + 1)

    setBalance(category, accountLessCategory, balance)
  }

  function accrue(account: string, amount: Amount) {
    const balance = amount + getBalance(summary, account)
    if (balance === 0) {
      deleteAccount(summary, account)
    } else {
      setBalance(summary, account, balance)
    }
  }

  try {
    for (const entry of entries) {
      accrue(entry.debitAccount, entry.amount)
      accrue(entry.creditAccount, -entry.amount)
    }

    return (
      <div>
        {summary.size > 0 ? (
          <>
            summary:
            <Summary summary={summary} />
          </>
        ) : (
          <>summary: nothing to report :)</>
        )}
      </div>
    )
  } catch (error) {
    if (error instanceof Error) {
      return `summary: ${error}`
    }
    throw error
  }
}

function Summary({ summary }: { summary: Summary }) {
  return Array.from(summary.entries()).map(([key, categoryOrBalance]) => (
    <div key={key} className={cn(styles.gap_margin_horizontal)}>
      {categoryOrBalance instanceof Map ? (
        <>
          {key}:
          <Summary summary={categoryOrBalance} />
        </>
      ) : (
        `${key}: ${FormatAmount(categoryOrBalance)}`
      )}
    </div>
  ))
}

function FormatAmount(amount: Amount) {
  const label = amount < 0 ? 'credit' : 'debit'
  return `${label} ${Math.abs(amount)}`
}
