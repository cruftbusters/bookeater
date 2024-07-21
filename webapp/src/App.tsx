import { useState } from 'react'
import styles from './index.module.scss'

function App() {
  return (
    <>
      <header className={cn(styles.dull, styles.gap)}>Bookeater Timekeeping Tool</header>
      <p aria-label="readme" className={styles.gap}>
        the plans for Bookeater Timekeeper Tool (BTT) are to try lots of things
        and get good with a vite typescript react neovim workflow
      </p>
    </>
  )
}

function cn(...values: string[]) {
  return values.join(' ')
}

export default App
