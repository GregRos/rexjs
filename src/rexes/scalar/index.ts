
/**
 * Created by Greg on 01/10/2016.
 */
export interface IScalarChangeInfo {

}
import {Rex} from "../base";
export abstract class RexScalar<T> extends Rex<IScalarChangeInfo> {
	value : T;
}
import {RexConvert} from './convert';
import {RexVar} from './var';

export {RexConvert, RexVar};










