import {RexScalar, ScalarChange} from "./index";
import {IRexInfo} from "../";
import {RexNames} from '../';
import {Subscription} from "../..";
/**
 * Created by Greg on 03/10/2016.
 */

export class RexSilence<T> extends RexScalar<T> {
	info : IRexInfo = {
		type : RexNames.Silence,
		lazy : true,
		functional : false
	};
	private _token : Subscription;

	constructor(private parent : RexScalar<T>, criterion ?: (change : ScalarChange<T>) => boolean) {
		super();
		this.depends.source = parent;
		if (criterion) {
			this._token = parent.changed.on(x => !criterion(x) ? this.changed.fire(x) : void 0);
		}
	}

	get value() {
		this.makeSureNotClosed();
		return this.parent.value;
	}

	set value(newValue : T) {
		this.makeSureNotClosed();
		this.parent.value = newValue;
	}
}