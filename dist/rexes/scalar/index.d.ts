/**
 * Created by Greg on 01/10/2016.
 */
export interface IScalarChangeInfo {
}
import { Rex } from "../base";
export interface ScalarChange<T> {
    value: T;
    oldValue?: T;
}
export declare abstract class RexScalar<T> extends Rex<ScalarChange<T>> {
    value: T;
    private notifyChange(prevValue);
}
import { RexConvert } from './convert';
import { RexVar } from './var';
export { RexConvert, RexVar };
