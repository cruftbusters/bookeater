import cn from './cn'
import styles from './index.module.scss'

function Readme() {
  return (
    <>
      <header className={cn(styles.dull, styles.header0, styles.gap_padding)}>
        Bookeater Timekeeping Tool
      </header>
      <div aria-label="readme">
        {[
          <>
            Bookeater Timekeeper Tool (BTT) simplifies recording and reporting
            of time spent on an assignment
          </>,
          <>
            the plan for BTT is to try lots of things and get good with a vite
            typescript react neovim workflow
          </>,
          <>
            this page is gravitating towards an interactive notebook. alongside
            the demo below new and related demos may appear
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
