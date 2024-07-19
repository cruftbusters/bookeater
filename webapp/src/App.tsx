import {useState} from "react";
import styles from './index.module.scss'

function App() {
    const {entries, toggle} = usePunchCard()

    return <div className={styles.grid}>
        <button onClick={() => toggle()} className={styles.button}>{entries.length === 0 || entries[entries.length - 1].end !== undefined ? 'punch in' : 'punch out'}</button>
        <div className={[styles.row, styles.rowHeader].join(' ')}>
            <div>start</div>
            <div>end</div>
            <div>duration</div>
        </div>
        {entries.map(({start, end}, index) => (
            <div className={styles.row} style={{order: entries.length - index}}>
                <div>{start.toISOString()}</div>
                {end && <div>{end.toISOString()}</div>}
                {end && <div>{(end.getTime() - start.getTime()) / 1000}s</div>}
            </div>
        ))}
    </div>
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
