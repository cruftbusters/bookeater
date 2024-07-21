import cn from './cn'
import DailyRowsDemo from './DailyRowsDemo'
import styles from './index.module.scss'
import Readme from './Readme'

function App() {
  return (
    <>
      <header className={cn(styles.dull, styles.header0, styles.gap_padding)}>
        Bookeater Timekeeping Tool
      </header>
      <Readme />
      <DailyRowsDemo />
    </>
  )
}

export default App
