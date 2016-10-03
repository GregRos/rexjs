/**
 * Created by Greg on 01/10/2016.
 */
/**
 * Interface for abstracting over disposal tokens.
 */
export interface IDisposable {
    close(): void;
}
/**
 * A special token used for performing deterministic cleanup. Part of rexjs infrastructure.
 */
export declare class DisposalToken implements IDisposable {
    private _close;
    /**
     * Constructs a new `DisposalToken`.
     * @param _close The action to perform when the token is closed. This function will only be called once.
     */
    constructor(_close: () => void);
    /**
     * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
     */
    close(): void;
}
/**
 * Marker interface for change notification data.
 */
export interface IChangeInfo {
}
