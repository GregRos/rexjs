
/**
 * Created by Greg on 01/10/2016.
 */
export interface IScalarChangeInfo {

}
import {Rex} from "../base";
export interface ScalarChange<T> {
	value : T;
	oldValue ?: T;
}

export abstract class RexScalar<T> extends Rex<ScalarChange<T>> {
	value : T;

	protected notifyChange(prevValue : T) {
		let self = this;
		this.changed.fire({
			get value() {
				return self.value;
			},
			oldValue : prevValue
		});
	}

	toString() {
		return `[RexScalar ${this.info.type} ${this.value}]`;
	}
}
import {RexConvert} from './convert';
import {RexVar} from './var';

export {RexConvert, RexVar};










