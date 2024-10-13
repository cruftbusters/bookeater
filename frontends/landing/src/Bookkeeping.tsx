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

  const balanceAsMap = new Map<string, number>()
  let net = 0

  movement.forEach((line: Line) => {
    const { account, amount: amountAsString, type } = line
    let balance = balanceAsMap.get(account) || 0
    if (amountAsString) {
      const amount = parseInt(amountAsString)

      const isDebit = type === 'debit'

      if (isDebit) {
        net += amount
      } else {
        net -= amount
      }

      const isDebitFlipped =
        account.startsWith('liabilities') || account.startsWith('equity')

      if (isDebit != isDebitFlipped) {
        balance += amount
      } else {
        balance -= amount
      }
    }
    if (balance === 0) {
      return balanceAsMap.delete(account)
    }
    return balanceAsMap.set(account, balance)
  })

  const summary = Array.from(balanceAsMap.entries())

  return (
    <>
      <span hidden={net === 0}>
        {'warning: '}
        {'movement is not balanced: '}
        {net > 0
          ? `debits is ${net} greater than credits`
          : `credits is ${-net} greater than debits`}
      </span>
      <span hidden={net !== 0}>
        {'info: '}
        {'movement is balanced'}
      </span>
      <button
        style={{ marginLeft: '0.5em' }}
        onClick={() =>
          setMovement((lines) =>
            lines.concat({ account: '', amount: '', type: 'debit' }),
          )
        }
      >
        add line
      </button>
      <div>
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
      </div>
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
  return (
    <div
      style={{
        ...style,
        display: 'inline-grid',
        gridColumnGap: '0.25em',
        gridRowGap: '0.125em',
      }}
    >
      {children}
    </div>
  )
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
