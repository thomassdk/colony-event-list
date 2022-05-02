import { getColonyNetworkClient, Network, ColonyClient } from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';
import { getLogs } from '@colony/colony-js';
import { getBlockTime } from '@colony/colony-js';
import { utils } from 'ethers';
import { ColonyRole } from '@colony/colony-js';
import { IInit, IDomain, IPayout, IRole, EventTypes, Tokens, TEvents } from './interfaces'

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

const provider = new InfuraProvider();

const wallet = Wallet.createRandom();
const connectedWallet = wallet.connect(provider);

const newColonyMessage = "Congratulations! It's a beautiful baby colony!";

const wei = new utils.BigNumber(10);

const getColonyEvents = async function () {
    const networkClient = getColonyNetworkClient(
        Network.Mainnet,
        connectedWallet,
        {
            networkAddress: MAINNET_NETWORK_ADDRESS
        },
    );

    const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);

    const events: TEvents[] = [
        (await getInitEvent(colonyClient)),
        ...(await getRoleEvents(colonyClient)),
        ...(await getDomainEvents(colonyClient)),
        ...(await getPayoutEvents(colonyClient)),
    ]

    return sortEvents(events)
}

async function getInitEvent(colonyClient: ColonyClient): Promise<IInit> {
    const eventFilter = colonyClient.filters.ColonyInitialised(null, null);

    // Assuming there is only ever one colony initialised log
    const eventLog = (await getLogs(colonyClient, eventFilter))[0];

    const timestamp = await getBlockTime(provider, eventLog.blockHash as string);

    return {
        message: newColonyMessage,
        timestamp,
        eventType: EventTypes.Init,
    }
}

async function getRoleEvents(colonyClient: ColonyClient): Promise<IRole[]> {
    // @ts-ignore
    const eventFilter = colonyClient.filters.ColonyRoleSet();

    const eventLogs = await getLogs(colonyClient, eventFilter);

    const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

    return await Promise.all(
        eventLogs.map(async (log, i) => ({
            role: ColonyRole[parsedLogs[i].values.role],
            address: parsedLogs[i].values.user,
            domainId: parseInt(
                parsedLogs[i].values.domainId._hex,
                16,
            ),
            timestamp: await getBlockTime(provider, log.blockHash as string),
            eventType: EventTypes.Role,
        })))
}

async function getPayoutEvents(colonyClient: ColonyClient): Promise<IPayout[]> {
    const eventFilter = colonyClient.filters.PayoutClaimed(null, null, null);

    const eventLogs = await getLogs(colonyClient, eventFilter);

    const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

    return await Promise.all(
        eventLogs.map(async (log, i) => ({
            address: await getUserAddressFromFundingPot(
                colonyClient,
                parsedLogs[i].values.fundingPotId._hex
            ),
            amount: getHumanReadableAmount(parsedLogs[i].values.amount._hex, true),
            token: getTokenString(parsedLogs[i].values.token),
            fundingPotId: parseInt(
                parsedLogs[i].values.fundingPotId._hex,
                16,
            ),
            timestamp: await getBlockTime(provider, log.blockHash as string),
            eventType: EventTypes.Payout,
        })))
}

async function getDomainEvents(colonyClient: ColonyClient): Promise<IDomain[]> {
    const eventFilter = colonyClient.filters.DomainAdded(null);

    const eventLogs = await getLogs(colonyClient, eventFilter);

    const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

    return await Promise.all(eventLogs.map(
        async (log, i) => ({
            domainId: parseInt(
                parsedLogs[i].values.domainId._hex,
                16,
            ),
            timestamp: await getBlockTime(provider, log.blockHash as string),
            eventType: EventTypes.Domain,
        })))
}

async function getUserAddressFromFundingPot(colonyClient: ColonyClient, fundingPotId: number) {
    const humanReadableFundingPotId = new utils.BigNumber(
        fundingPotId
    ).toString();

    const {
        associatedTypeId,
    } = await colonyClient.getFundingPot(humanReadableFundingPotId);

    const { recipient: userAddress } = await colonyClient.getPayment(associatedTypeId);

    return userAddress;
}

function getTokenString(tokenAddress: string) {
    // @ts-ignore
    const tokenString = Tokens[tokenAddress];
    if (tokenString === undefined) {
        console.warn(`Token: ${tokenAddress} not found `)
        return "Unknown Token"
    }

    return tokenString;
}

function getHumanReadableAmount(hexAmount: string, weiConversion = false) {
    let humanReadableAmount = new utils.BigNumber(hexAmount);

    if (weiConversion)
        humanReadableAmount = humanReadableAmount.div(wei.pow(18));

    return humanReadableAmount.toString();
}

function sortEvents<T extends { timestamp: number }>(events: T[]) {
    return events.sort((a, b) => b.timestamp - a.timestamp)
}

export { getColonyEvents, MAINNET_NETWORK_ADDRESS };
