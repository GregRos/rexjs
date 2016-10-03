import { IRexInfo } from "./definitions";
import { RexEvent } from "../";
/**
 * Created by Greg on 01/10/2016.
 */
export declare abstract class Rex<TChange> {
    private _isClosed;
    abstract info: IRexInfo;
    meta: any;
    depends: any;
    closing: RexEvent<void>;
    changed: RexEvent<TChange>;
    readonly isClosed: boolean;
    close(): void;
    protected makeSureNotClosed(): void;
}