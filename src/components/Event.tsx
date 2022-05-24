import styles from './Event.module.css'
import Blockies from 'react-blockies';
import { EventTypes, IEvent, IInit, IDomain, IRole, IPayout } from '../interfaces'
import { MAINNET_NETWORK_ADDRESS } from '../Colony'

function parseTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString("en-GB", { day: "2-digit", month: 'short' })
}

function createMessage(data: IEvent) {
    let event;

    switch (data.eventType) {
        case EventTypes.Init:
            event = data as IInit;
            return <>{event.message}</>
        case EventTypes.Domain:
            event = data as IDomain;
            return <>Domain <strong>{event.domainId}</strong> added.</>
        case EventTypes.Role:
            event = data as IRole;
            return <><strong>{event.role}</strong> role assigned to user <strong>{event.address}</strong> in domain <strong>{event.domainId}</strong>.</>
        case EventTypes.Payout:
            event = data as IPayout;
            return <>User <strong>{event.address}</strong> claimed <strong>{event.amount}{event.token}</strong> payout from pot <strong>{event.fundingPotId}</strong>.</>
        default:
            throw Error(`Unknown event of type --> ${data.eventType}`)
    }
}

export default function Task(data: IEvent) {
    return (
        <div className={styles.taskItem}>
            <Blockies
                seed={data.address || MAINNET_NETWORK_ADDRESS}
                className={styles.identicon}
                size={10}
                scale={3.7}
            />
            <div className={styles.text}>
                <p className={styles.mainMessage}>
                    {createMessage(data)}
                </p>
                <p className={styles.date}>
                    {parseTimestamp(data.timestamp)}
                </p>
            </div>
        </div>
    );
}
