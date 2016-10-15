
import {RexEvent} from "../";
import {Errors} from '../errors';
import {DummyEvent} from "../events/dummy-event";
/**
 * Created by Greg on 01/10/2016.
 */

export interface IRexInfo {
	type : string;
	lazy : boolean;
	functional : boolean;
}


export abstract class Rex<TChange> {
	private _isClosed : boolean = false;

	abstract info : IRexInfo;
	meta = {} as any;
	depends = {} as any;
	changed : RexEvent<TChange>;

	constructor() {
		this.changed = new RexEvent<TChange>("changed");
	}


	protected get isClosed() {
		return this._isClosed;
	}

	close() {
		this.changed.clear();
		this._isClosed = true;
	}

	protected makeSureNotClosed() : void {
		if (this._isClosed) {
			throw Errors.closed(this.meta.name || "");
		}
	}
}