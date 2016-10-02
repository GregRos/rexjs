import {RexScalar, ScalarChange} from "./index";
import {DisposalToken} from "../../events/disposal-token";
import {RexEvent} from "../../events/implementation";
import {IRexInfo} from "../definitions";
import {RexNames} from '../names';
/**
 * Created by Greg on 03/10/2016.
 */

export class RexNotify<T> extends RexScalar<T> {
	info : IRexInfo = {
		lazy : true,
		functional : false,
		type : RexNames.Convert
	};
	private _parentToken : DisposalToken;
	private _notifierToken : DisposalToken;
	private _selfToken : DisposalToken;
	constructor(private parent : RexScalar<T>, notifier : (change : ScalarChange<T>) => RexEvent<void>) {
		super();

		this._parentToken = parent.changed.on(this.changed).and()
		let onChange = (change : ScalarChange<T>) => {
			let newNotifier = notifier(change);
			this._notifierToken.close();
			this._notifierToken = newNotifier.on(() => this.notifyChange(undefined));
		};
		this._selfToken = this.changed.on(onChange);
		this.notifyChange(undefined);
	}

	get value() {
		this.makeSureNotClosed();
		return this.parent.value;
	}

	set value(newValue : T) {
		this.makeSureNotClosed();
		this.parent.value = newValue;
	}

	close() {
		if (this.isClosed) return;
		[this._notifierToken, this._selfToken, this._parentToken].forEach(x => x.close());
		this._parentToken = this._selfToken = this._notifierToken = null;
		super.close();
	}
}