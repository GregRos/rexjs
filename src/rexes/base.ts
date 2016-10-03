
import {RexEvent} from "../";
import {Errors} from '../errors';
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
	closing : RexEvent<void> = new RexEvent<void>("onClosing");
	changed : RexEvent<TChange> = new RexEvent<TChange>("onChanged");

	get isClosed() {
		return this._isClosed;
	}

	close() {
		this.changed.clear();
		this.closing.fire(undefined);
		this.closing.clear();
		this._isClosed = true;
	}

	protected makeSureNotClosed() : void {
		if (this._isClosed) {
			throw Errors.closed(this.meta.name || "");
		}
	}
}