import { RexEvent } from "../";
/**
 * Created by Greg on 01/10/2016.
 */
export interface IRexInfo {
    type: string;
    lazy: boolean;
    functional: boolean;
}
export declare abstract class Rex<TChange> {
    private _isClosed;
    abstract info: IRexInfo;
    meta: any;
    depends: any;
    changed: RexEvent<TChange>;
    constructor();
    protected readonly isClosed: boolean;
    close(): void;
    protected makeSureNotClosed(): void;
}
