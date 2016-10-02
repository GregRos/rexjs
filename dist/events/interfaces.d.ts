/**
 * Created by Greg on 01/10/2016.
 */
export interface IDisposable {
    close(): void;
}
export declare class DisposalToken implements IDisposable {
    private _close;
    constructor(_close: () => void);
    close(): void;
}
export declare abstract class ARexEvent<T> {
    abstract on(handler: (arg: T) => void): DisposalToken;
}
export interface IChangeInfo {
}
