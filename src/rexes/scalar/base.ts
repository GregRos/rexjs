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
	abstract value : T;
	private _binding : ScalarBinding<T>;

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

	private _resetBinding() {
		this._binding = null;
	}

	set binding(binding : ScalarBinding<T>) {
		let {_binding} = this;
		if (_binding === binding) {
			//handle self-assignment gracefully :)
			return;
		}
		if (_binding) {
			(_binding as any)._justClose();
		}
		this._resetBinding();
		if (binding) {
			(binding as any)._initialize(this);
			this._binding = binding;
		}
	}

	toBinding() {
		return new ScalarBinding<T>(this);
	}

	toString() {
		return `[RexScalar ${this.info.type} ${this.value}]`;
	}
}