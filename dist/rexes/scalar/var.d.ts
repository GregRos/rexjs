/**
 * Created by Greg on 01/10/2016.
 */
import { RexScalar } from './';
import { IRexInfo } from "../definitions";
export declare class RexVar<T> extends RexScalar<T> {
    canRead: boolean;
    canWrite: boolean;
    _value: T;
    constructor(initial: T, canRead?: boolean, canWrite?: boolean);
    info: IRexInfo;
    value: T;
}
