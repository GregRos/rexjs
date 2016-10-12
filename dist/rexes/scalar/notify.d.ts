import { RexScalar, ScalarChange } from "./index";
import { RexEvent } from "../../events/rex-event";
import { IRexInfo } from "../base";
/**
 * Created by Greg on 03/10/2016.
 */
export declare class RexNotify<T> extends RexScalar<T> {
    private parent;
    info: IRexInfo;
    private _parentToken;
    private _notifierToken;
    private _selfToken;
    constructor(parent: RexScalar<T>, notifier: (change: ScalarChange<T>) => RexEvent<void>);
    value: T;
    close(): void;
}
