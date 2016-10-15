import {IScalarChangeInfo, RexScalar} from "./";
import {Rex, IRexInfo} from "../base";
import {RexNames} from "../names";
import {Errors} from '../../errors';
import {Subscription} from "../../";
/**
 * Created by Greg on 01/10/2016.
 */

export interface Conversion<TFrom, TTo> {
	from ?: (to : TTo) => TFrom;
	to ?: (to : TFrom) => TTo;
}

//instead of using undefined to signify a dirty cached value, we use a special token,
//because 'undefined' is a valid value.
let missing = {} as any;

export class RexConvert<TFrom, TTo> extends RexScalar<TTo> {
	private _last : TTo = missing;
	private _parentSub : Subscription;
	info : IRexInfo = {
		type : RexNames.Convert,
		lazy : true,
		functional : true
	};

	constructor(
		private parent : RexScalar<TFrom>, private conversion : Conversion<TFrom, TTo>) {
		super();
		this.depends.source = parent;

		this._parentSub = parent.changed.on(() => {
			let lastVal = this._last;
			this._last = missing;
			this.notifyChange();
		});
	}

	get value() {
		this.makeSureNotClosed();
		if (this._last === missing) {
			if (!this.conversion.from) {
				throw Errors.cannotRead(this.meta.name);
			}
			this._last = this.conversion.to(this.parent.value);
		}
		return this._last;
	}

	set value(val : TTo) {
		this.makeSureNotClosed();
		if (!this.conversion.to) {
			throw Errors.cannotWrite(this.meta.name);
		}
		let prevVal = this._last;
		//use Object.is in case of NaN
		if (Object.is(prevVal, val)) {
			return;
		}
		this._last = val;
		let newVal = this.conversion.from(val);
		this._parentSub.freezeWhile(() => this.parent.value = newVal);
		this.notifyChange();
	}

	close() {
		if (this.isClosed) return;
		this._parentSub.close();
		super.close();
	}
}