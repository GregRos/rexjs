/**
 * Created by Greg on 01/10/2016.
 */
import {IScalarChangeInfo, RexScalar} from './';
import {Rex} from "../base";
import {IRexInfo} from "../definitions";
import {Var} from "../names";
import {Errors} from '../../errors';
export class RexVar<T> extends RexScalar<T> {
	private _value : T;

	constructor(initial : T, private canRead : boolean = true, private canWrite : boolean = true) {
		super();
		this.value = initial;
	}

	info : IRexInfo = {
		lazy : false,
		type : Var,
		functional : true
	};

	get value() {
		this.makeSureNotClosed();
		if (!this.canRead) {
			throw Errors.cannotRead(this.meta.name);
		}
		return this._value;
	}

	set value(val : T) {
		this.makeSureNotClosed();
		if (!this.canWrite) {
			throw Errors.cannotWrite(this.meta.name);
		}
		this._value = val;
		this.changed.invoke(null);
	}
}



