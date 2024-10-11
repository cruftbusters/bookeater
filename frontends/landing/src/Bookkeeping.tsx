import { CSSProperties, PropsWithChildren, useState } from 'react'

export function Bookkeeping() {
  return <Movement />
}

type Line = { account: string; amount: string; type: 'debit' | 'credit' }
export function Movement() {
  const [movement, setMovement] = useState<Line[]>([
    { account: '', amount: '', type: 'debit' },
  ])

  function setLine(index: number, update: Line) {
    setMovement((lines) =>
      lines.map((line, check) => (index === check ? update : line)),
    )
  }

  const summaryAsMap = new Map<string, number>()

  movement.forEach((line: Line) => {
    const { account, amount, type } = line
    let balance = summaryAsMap.get(account) || 0
    if (amount) {
      const isDebit = type === 'debit'
      const isDebitFlipped = account.startsWith('liabilities')
      if (isDebit != isDebitFlipped) {
        balance += parseInt(amount)
      } else {
        balance -= parseInt(amount)
      }
    }
    if (balance === 0) {
      return summaryAsMap.delete(account)
    }
    return summaryAsMap.set(account, balance)
  })

  const summary = Array.from(summaryAsMap.entries())

  return (
    <>
      <p>assets equal liabilities plus equity</p>
      <div>
        <button
          onClick={() =>
            setMovement((lines) =>
              lines.concat({ account: '', amount: '', type: 'debit' }),
            )
          }
        >
          add line
        </button>
      </div>
      <Grid style={{ gridTemplateColumns: 'repeat(3, auto)' }}>
        <GridRow>
          <span>account</span>
          <span>debit</span>
          <span>credit</span>
        </GridRow>
        {movement.map((line, index) => (
          <GridRow key={index}>
            <input
              aria-label="account"
              onChange={(e) =>
                setLine(index, { ...line, account: e.target.value })
              }
            />
            <input
              aria-label="debit"
              onChange={(e) =>
                setLine(index, {
                  ...line,
                  amount: e.target.value,
                  type: 'debit',
                })
              }
              value={line.type === 'debit' ? line.amount : ''}
            />
            <input
              aria-label="credit"
              onChange={(e) =>
                setLine(index, {
                  ...line,
                  amount: e.target.value,
                  type: 'credit',
                })
              }
              value={line.type === 'credit' ? line.amount : ''}
            />
          </GridRow>
        ))}
      </Grid>
      <div hidden={summary.length < 1}>
        {'summary: '}
        {summary.map(([account, amount]) => (
          <div key={account}>
            {account}: {amount > 0 ? amount : `(${-amount})`}
          </div>
        ))}
      </div>
    </>
  )
}

function Grid({
  children,
  style,
}: PropsWithChildren & { style: CSSProperties }) {
  return <div style={{ ...style, display: 'inline-grid' }}>{children}</div>
}

function GridRow({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: 'grid',
        gridColumn: '1/-1',
        gridTemplateColumns: 'subgrid',
      }}
    >
      {children}
    </div>
  )
}
