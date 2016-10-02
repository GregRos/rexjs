import {IScalarChangeInfo, RexScalar} from "./";
import {Rex} from "../base";
import {IRexInfo} from "../definitions";
import {RexNames} from "../names";
import {Errors} from '../../errors';
import {DisposalToken} from "../../";
/**
 * Created by Greg on 01/10/2016.
 */

export interface Conversion<TFrom, TTo> {
	from ?: (to : TTo) => TFrom;
	to ?: (to : TFrom) => TTo;
}

export class RexConvert<TFrom, TTo> extends RexScalar<TTo> {
	private _last : TTo;
	private _subToken : DisposalToken;
	info : IRexInfo = {
		type : RexNames.Convert,
		lazy : true,
		functional : true
	};

	constructor(private parent : RexScalar<TFrom>, private conversion : Conversion<TFrom, TTo>) {
		super();
		this.depends.source = parent;
		this._subToken = parent.changed.on(() => this.notifyChange(this._last));
		let parentClose = parent.closing.on(() => this.close());
		let selfChange = this.changed.on(() => this._last = undefined);
		this._subToken = this._subToken.and(parentClose, selfChange)
	}

	get value() {
		this.makeSureNotClosed();
		if (this._last === undefined) {
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
		this._last = val;
		this.parent.value = this.conversion.from(val);
	}

	close() {
		if (this.isClosed) return;
		this._subToken.close();
		this._subToken = null;
		super.close();
	}
}