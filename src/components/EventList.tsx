import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';

import styles from './EventList.module.css'
import eventStyles from './Event.module.css'
import Event from './Event';
import { TEvents } from '../interfaces'

interface Props {
    events: TEvents[],
}

const loadingSize = 10;
let isLoading = true;

export default function EventList({ events }: Props) {
    const [visibleEvents, setVisibleEvents] = useState<TEvents[]>([]);
    const loader = useRef(null);

    const handleObserver = useCallback((entries: any) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setVisibleEvents(visible => {
                return [
                    ...visible,
                    ...events.slice(visible.length, visible.length + loadingSize)
                ]
            })
        }
    }, [events]);

    useEffect(() => {
        if (events.length > 0) {
            setVisibleEvents(events => events.slice(0, loadingSize))
            isLoading = false
        }
    }, [events])

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    const getLoadingRow = () => {
        let content = [];
        for (let i = 0; i < loadingSize; i++) {
            content.push(
                <div key={uuidv4()} className={eventStyles.taskItem}>
                    <div className={styles.ldsRipple}><div></div><div></div></div>
                </div>
            );
        }
        return content;
    };

    if (isLoading) {
        return (
            <div className={styles.list} >
                {getLoadingRow()}
            </div>
        );
    }

    return (
        <>
            <div className={styles.list}>
                {visibleEvents.map((event: TEvents) => (
                    <Event key={uuidv4()} {...event} />
                ))}
            </div>
            <div ref={loader} />
        </>
    );
}
