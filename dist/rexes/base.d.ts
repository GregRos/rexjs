import { IRexInfo } from "./definitions";
import { RexEvent } from "../";
import { IChangeInfo } from "../";
/**
 * Created by Greg on 01/10/2016.
 */
export declare abstract class Rex<TChange> {
    private _isClosed;
    abstract info: IRexInfo;
    meta: any;
    depends: any;
    onClosing: RexEvent<void>;
    onChanged: RexEvent<IChangeInfo>;
    readonly isClosed: boolean;
    close(): void;
    protected makeSureNotClosed(): void;
}
