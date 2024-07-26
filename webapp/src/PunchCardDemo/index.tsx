import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import rootStyles from '../index.module.scss'
import localStyles from './index.module.scss'
import cn from '../cn'

const styles = Object.assign(rootStyles, localStyles)

function PunchCardDemo() {
  const [state, setState] = useState<Array<Punch>>([])

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Punch Card Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        <div className={cn(styles.grid)}>
          <div className={cn(styles.row, styles.full_width)}>
            <button
              className={cn(
                styles.full_width,
                styles.gap_padding,
                state[0]?.type === 'punch_in'
                  ? styles.button_punch_out
                  : styles.button_punch_in,
              )}
              onClick={() =>
                setState((state) => {
                  const result = Array.from(state)
                  result.unshift({
                    id: uuidv4(),
                    timestamp: new Date(),
                    type:
                      state[0]?.type === 'punch_in' ? 'punch_out' : 'punch_in',
                  })
                  return result
                })
              }
            />
          </div>
          {state.map((punch) => (
            <div key={punch.id} className={cn(styles.row, styles.full_width)}>
              <div>{punch.timestamp.toLocaleDateString()}</div>
              <div>{punch.timestamp.toLocaleTimeString()}</div>
              <div
                className={cn(
                  punch.type === 'punch_in'
                    ? styles.type_punch_in
                    : styles.type_punch_out,
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

type Punch = { id: string; timestamp: Date; type: 'punch_in' | 'punch_out' }

export default PunchCardDemo
