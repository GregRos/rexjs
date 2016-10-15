/**
 * Created by Greg on 01/10/2016.
 */
import { RexScalar } from './';
import { IRexInfo } from "../";
export declare class RexVar<T> extends RexScalar<T> {
    private canRead;
    private canWrite;
    private _value;
    constructor(initial: T, canRead: boolean, canWrite: boolean);
    info: IRexInfo;
    value: T;
}
