import cn from '../cn'
import styles from '../index.module.scss'

export default function BooksDemo() {
  return (
    <>
      <h1 className={cn(styles.dull, styles.header1, styles.gap_padding)}>
        Books Demo
      </h1>
      <div className={cn(styles.gap_margin)}>
        <p>Coming soon :)</p>
      </div>
    </>
  )
}
