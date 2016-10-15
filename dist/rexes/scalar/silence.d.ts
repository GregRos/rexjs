import { RexScalar, ScalarChange } from "./index";
import { IRexInfo } from "../";
/**
 * Created by Greg on 03/10/2016.
 */
export declare class RexSilence<T> extends RexScalar<T> {
    private parent;
    info: IRexInfo;
    private _token;
    constructor(parent: RexScalar<T>, criterion?: (change: ScalarChange<T>) => boolean);
    value: T;
}
