import { useState } from 'react'

function DailyRowsDemo() {
  const [state, setState] = useState({ days: ['first day', 'second day'] })

  return (
    <>
      <h1>Daily Rows Demo</h1>
      {state.days.map((day) => (
        <div>{day}</div>
      ))}
    </>
  )
}

export default DailyRowsDemo
