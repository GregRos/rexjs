import { IRexInfo, RexScalar } from "../";
import { RexLink } from "./link";
import { ScalarChange } from "./index";
/**
 * Created by Greg on 12/10/2016.
 */
export declare class RexListen<T> extends RexLink<T> {
    info: IRexInfo;
    private _token;
    constructor(parent: RexScalar<T>, callback: (change: ScalarChange<T>) => void);
    close(): void;
}
