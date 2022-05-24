import { useEffect, useState } from 'react'

import styles from './App.module.css'
import { getColonyEvents } from './Colony'
import EventList from './components/EventList'
import { TEvents } from './interfaces'

function App() {
    const [events, setEvents] = useState<TEvents[]>([]);

    useEffect(() => {
        async function fetch() {
            const events = await getColonyEvents();
            setEvents(events);
        }

        fetch()
    }, []);

    return (
        <div className={styles.App}>
            <EventList events={events} />
        </div>
    );
}

export default App;
