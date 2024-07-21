import { useState } from 'react'
import styles from '../index.module.scss'
import cn from '../cn'

function DailyRowsDemo() {
  const [state, setState] = useState({ days: ['first day', 'second day'] })

  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Daily Rows Demo
      </h1>
      <div className={styles.gap_margin}>
        {state.days.map((day, key) => (
          <div key={key}>{day}</div>
        ))}
      </div>
    </>
  )
}

export default DailyRowsDemo
