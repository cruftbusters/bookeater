import cn from './cn'
import DailyRowsDemo from './DailyRowsDemo'
import styles from './index.module.scss'

function App() {
  return (
    <>
      <header className={cn(styles.dull, styles.header0, styles.gap_padding)}>
        Bookeater Timekeeping Tool
      </header>
      <p aria-label="readme" className={styles.gap_margin}>
        the plans for Bookeater Timekeeper Tool (BTT) are to try lots of things
        and get good with a vite typescript react neovim workflow
      </p>
      <DailyRowsDemo />
    </>
  )
}

export default App
