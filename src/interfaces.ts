export enum Tokens {
    "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c" = "βLNY",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F" = "DAI",
}

interface IEvent {
    type: string,
    address?: string;
    timestamp: number;
}

export interface IInit extends IEvent {
    type: "init";
    message: string;
}

export interface IDomain extends IEvent {
    type: "domain";
    domainId: number;
}

export interface IRole extends IEvent {
    type: "role";
    role: string;
    domainId: number;
}

export interface IPayout extends IEvent {
    type: "payout";
    amount: string;
    token: string;
    fundingPotId: number;
}

export type TEvents = IInit | IDomain | IPayout | IRole;
