import styles from './Event.module.css'
import Blockies from 'react-blockies';
import { TEvents } from '../interfaces'
import { MAINNET_NETWORK_ADDRESS } from '../Colony'

function parseTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString("en-GB", { day: "2-digit", month: 'short' })
}

function createMessage(data: TEvents) {

    switch (data.type) {
        case "init":
            return <>{data.message}</>
        case "domain":
            return <>Domain <strong>{data.domainId}</strong> added.</>
        case "role":
            return <><strong>{data.role}</strong> role assigned to user <strong>{data.address}</strong> in domain <strong>{data.domainId}</strong>.</>
        case "payout":
            return <>User <strong>{data.address}</strong> claimed <strong>{data.amount}{data.token}</strong> payout from pot <strong>{data.fundingPotId}</strong>.</>
        default:
            const _exhaustiveCheck: never = data;
            return _exhaustiveCheck;
    }
}

export default function Task(data: TEvents) {
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
