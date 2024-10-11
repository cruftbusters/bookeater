import { CSSProperties, PropsWithChildren, useState } from 'react'

export function Bookkeeping() {
  return <Movement />
}

type Line = { account?: string; amount?: string }
export function Movement() {
  const [movement, setMovement] = useState<Line[]>([{}])

  function setLine(index: number, update: Line) {
    setMovement((lines) =>
      lines.map((line, check) => (index === check ? update : line)),
    )
  }

  const summary = movement.reduce((summary, line) => {
    let balance = summary.get(line.account) || 0
    if (line.amount) {
      balance += parseInt(line.amount)
    }
    return summary.set(line.account, balance)
  }, new Map())

  return (
    <>
      <p>
        by default, debiting an account increases its balance and crediting an
        account decreases its balance. however, the opposite is true for
        accounts prefixed with &quote;liabilities:&quote;
      </p>
      <div>
        <button onClick={() => setMovement((lines) => lines.concat({}))}>
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
                setLine(index, { ...line, amount: e.target.value })
              }
            />
            <input
              aria-label="credit"
              onChange={(e) =>
                setLine(index, { ...line, amount: e.target.value })
              }
            />
          </GridRow>
        ))}
      </Grid>
      <div>
        {'summary: '}
        {Array.from(summary.entries()).map(
          ([account, amount]) => `${account}: ${amount}`,
        )}
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
