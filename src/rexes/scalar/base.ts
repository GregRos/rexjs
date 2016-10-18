import {Rex} from "../base";
import {ScalarBinding} from '../../binding';
import {BindPriority} from "../../binding/base-binding";
/**
 * Created by Greg on 17/10/2016.
 */
export interface ScalarChange<T> {
	value : T;
}

export abstract class RexScalar<T> extends Rex<ScalarChange<T>> {
	value : T;
	_binding : ScalarBinding<T>;

	protected notifyChange() {
		let self = this;
		this.changed.fire({
			get value() {
				return self.value;
			}
		});
	}

	get binding() {
		return this._binding;
	}

	set binding(binding : ScalarBinding<T>) {
		(binding as any)._initialize(this);
		this._binding = binding;
	}

	toBinding() {
		return new ScalarBinding<T>(this);
	}

	toString() {
		return `[RexScalar ${this.info.type} ${this.value}]`;
	}
}