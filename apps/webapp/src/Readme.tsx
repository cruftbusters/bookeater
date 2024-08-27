import cn from './cn'
import styles from './index.module.scss'

function Readme() {
  return (
    <>
      <header className={cn(styles.dull, styles.header0, styles.gap_padding)}>
        Bookeater
      </header>
      <div aria-label="readme">
        {[
          <>
            Bookeater simplifies recording and reporting of time spent on an
            assignment
          </>,
          <>
            The two sections below are simple timekeeping and bookkeeping demos.
            They could grow to something more usable. They could even connect
            together into a timekeeping to bookkeeping pipeline.
          </>,
        ].map((text, key) => (
          <p key={key} className={styles.gap_margin}>
            {text}
          </p>
        ))}
      </div>
    </>
  )
}

export default Readme
