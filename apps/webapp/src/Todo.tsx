import cn from './cn'
import styles from './index.module.scss'

function Todo() {
  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        todo
      </h1 >
      <div className={cn(styles.gap_margin)}>
        <h2>in general</h2>
        <ul>
          <li>deploy to bookeater.cruftbusters.com</li>
        </ul>
        <h2>timekeeping</h2>
        <ul>
          <li>move timezone to shared dropdown</li>
          <li>export and import timekeeping journal</li>
          <li>load, rename, autosave, and delete journal by name</li>
        </ul>
        <h2>invoice</h2>
        <ul>
          <li>
            add invoice that summarizes timekeeping entries matching selector
          </li>
          <li>post invoice to books</li>
        </ul>
        <h2>bookkeeping</h2>
        <ul>
          <li>add movement with date, memo, entries</li>
          <li>export and import bookkeeping journal</li>
          <li>load, rename, autosave, and delete journal by name</li>
        </ul>
      </div>
    </>
  )
}

export default Todo
