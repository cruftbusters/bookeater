import cn from './cn'
import PunchCardDemo from './PunchCardDemo'
import styles from './index.module.scss'
import Readme from './Readme'
import BooksDemo from './BooksDemo'

function App() {
  return (
    <>
      <header className={cn(styles.dull, styles.header0, styles.gap_padding)}>
        Bookeater Timekeeping Tool
      </header>
      <Readme />
      <PunchCardDemo />
      <BooksDemo />
    </>
  )
}

export default App
