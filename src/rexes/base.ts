import {IRexInfo} from "./definitions";
import {RexEvent} from "../";
import {IChangeInfo} from "../";
import {Errors} from '../errors';
/**
 * Created by Greg on 01/10/2016.
 */

export abstract class Rex<TChange> {
	private _isClosed : boolean = false;
	abstract info : IRexInfo;
	meta = {} as any;
	depends = {} as any;
	closing = new RexEvent<void>("onClosing");
	changed = new RexEvent<IChangeInfo>("onChanged");

	get isClosed() {
		return this._isClosed;
	}

	close() {
		this.changed.clear();
		this.closing.invoke(undefined);
		this.closing.clear();
		this._isClosed = true;
	}

	protected makeSureNotClosed() : void {
		if (this._isClosed) {
			throw Errors.closed(this.meta.name || "");
		}
	}
}