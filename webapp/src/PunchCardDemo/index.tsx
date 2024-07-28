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
            <PunchEditor
              key={punch.id}
              punch={punch}
              update={(punch) =>
                setState((state) =>
                  state.map((check) => (check.id === punch.id ? punch : check)),
                )
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}

type Punch = { id: string; timestamp: Date; type: 'punch_in' | 'punch_out' }

function PunchEditor({
  punch,
  update,
}: {
  punch: Punch
  update: (punch: Punch) => void
}) {
  const timeString = punch.timestamp.toTimeString()
  const dateString = punch.timestamp.toDateString()
  return (
    <div className={cn(styles.row, styles.full_width)}>
      <Field
        value={dateString}
        update={(value) => {
          const timestamp = new Date(Date.parse(`${value} ${timeString}`))
          if (isNaN(timestamp.getTime())) {
            return Error('date is not valid')
          }
          update({ ...punch, timestamp })
        }}
      />
      <Field
        value={timeString}
        update={(value) => {
          const timestamp = new Date(Date.parse(`${dateString} ${value}`))
          if (isNaN(timestamp.getTime())) {
            return Error('time is not valid')
          }
          update({ ...punch, timestamp })
        }}
      />
      <div
        className={cn(
          punch.type === 'punch_in'
            ? styles.type_punch_in
            : styles.type_punch_out,
        )}
      />
    </div>
  )
}

function Field({
  value,
  update,
}: {
  value: string
  update: (value: string) => Error | undefined
}) {
  const [localValue, setLocalValue] = useState<
    undefined | { error: Error; value: string }
  >()
  return (
    <input
      value={localValue?.value || value}
      className={localValue ? styles.warn : ''}
      onChange={(e) => {
        const error = update(e.target.value)
        if (error) {
          setLocalValue({ error, value: e.target.value })
        } else {
          setLocalValue(undefined)
        }
      }}
    />
  )
}

export default PunchCardDemo
