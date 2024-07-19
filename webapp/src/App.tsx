import {useState} from "react";
import styles from './index.module.scss'
import {v4 as uuidv4} from 'uuid'

function App() {
    const {entries, toggle, update} = usePunchCard()

    return <div className={styles.grid}>
        <button onClick={() => toggle()}
                className={styles.button}>{entries.length === 0 || entries[entries.length - 1].end !== undefined ? 'punch in' : 'punch out'}</button>
        <div className={[styles.row, styles.rowHeader].join(' ')}>
            <div>start</div>
            <div>end</div>
            <div>duration</div>
        </div>
        {entries.map((entry, index) => (
            <div className={styles.row} style={{order: entries.length - index}}>
                <ForEntry entry={entry} update={update}/>
            </div>
        ))}
    </div>
}

type Entry = {
    id: string,
    start: Date,
    end?: Date,
}

function usePunchCard() {
    const [entries, setEntries] = useState<Array<Entry>>([])
    return {
        entries,
        toggle: () => setEntries(entries => {
            if (entries.length === 0 || entries[entries.length - 1].end !== undefined) {
                return entries.concat({id: uuidv4(), start: new Date()})
            } else {
                return entries.map((entry, index) => {
                    if (index === entries.length - 1) {
                        return {end: new Date(), ...entry}
                    }
                    return entry
                })
            }
        }),
        update: (update: Entry) => setEntries(entries => entries.map(entry => entry.id === update.id ? update : entry))
    }
}

function ForEntry({entry, update}: { entry: Entry, update: (entry: Entry) => void }) {
    const {start, end} = entry
    return (
        <>
            <input value={start.toISOString()}
                   onChange={e => update({...entry, start: new Date(e.target.value)})}/>
            {end && <div>{end.toISOString()}</div>}
            {end && <div>{(end.getTime() - start.getTime()) / 1000}s</div>}
        </>
    )
}

export default App
