import styles from './index.module.scss'

function Readme() {
  return (
    <div aria-label="readme">
      {[
        <>
          the plans for Bookeater Timekeeper Tool (BTT) are to try lots of
          things and get good with a vite typescript react neovim workflow
        </>,
      ].map((text, key) => (
        <p key={key} className={styles.gap_margin}>{text}</p>
      ))}
    </div>
  )
}

export default Readme
