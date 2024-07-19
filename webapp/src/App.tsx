import {useState} from "react";
import styles from './index.module.scss'

function App() {
    const {entries, toggle} = usePunchCard()

    return <>
        <button onClick={() => toggle()}>toggle</button>
        <div className={styles.entries}>
            {entries.map(({start, end}, index) => (
                <>
                    <div className={styles.start} style={{order: -index}}>{start.toISOString()}</div>
                    {end && <div className={styles.end} style={{order: -index}}>{end.toISOString()}</div>}
                    {end && <div className={styles.duration} style={{order: -index}}>{(end.getUTCSeconds() - start.getUTCSeconds())}s</div>}
                </>
            ))}
        </div>
    </>
}

type Entry = {
    start: Date,
    end?: Date,
}

function usePunchCard() {
    const [entries, setEntries] = useState<Array<Entry>>([])
    return {
        entries,
        toggle: () => setEntries(entries => {
            if (entries.length === 0 || entries[entries.length - 1].end !== undefined) {
                return entries.concat({start: new Date()})
            } else {
                return entries.map((entry, index) => {
                    if (index === entries.length - 1) {
                        const start = entry.start
                        const end = new Date()
                        return {start, end}
                    }
                    return entry
                })
            }
        })
    }
}

export default App
