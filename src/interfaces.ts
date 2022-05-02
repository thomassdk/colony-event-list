export enum Tokens {
    "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c" = "βLNY",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F" = "DAI",
}

export enum EventTypes {
    Init,
    Domain,
    Role,
    Payout,
}

export interface IEvent {
    address?: string;
    timestamp: number;
    eventType: EventTypes;
}

export interface IInit extends IEvent {
    message: string;
}

export interface IDomain extends IEvent {
    domainId: number;
}

export interface IRole extends IEvent {
    role: string;
    domainId: number;
}

export interface IPayout extends IEvent {
    amount: string;
    token: string;
    fundingPotId: number;
}

export type TEvents = IInit | IDomain | IPayout | IRole;
