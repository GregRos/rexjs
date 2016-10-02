import { ARexEvent, DisposalToken } from './interfaces';
export declare class RexEvent<T> extends ARexEvent<T> {
    private _name;
    constructor(_name?: string);
    readonly name: string;
    private _invocationList;
    on<S extends T>(handler: ((arg: T) => void) | RexEvent<S>): DisposalToken;
    invoke(arg: T): void;
    clear(): void;
}
