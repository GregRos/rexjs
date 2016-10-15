import {RexScalar, IRexInfo, RexNames} from '../';
/**
 * Created by Greg on 12/10/2016.
 */

export class RexComputed<T> extends RexScalar<T> {
	info : IRexInfo = {
		functional : true,
		type : RexNames.Computed,
		lazy : true
	};

	constructor(protected onRead : () => T, protected onWrite ?: (input : T) => void) {
		super();
	}

	get value() {
		this.makeSureNotClosed();
		return this.onRead();
	}

	set value(x : T) {
		this.makeSureNotClosed();
		if (this.onWrite) {
			this.onWrite(x);
		}
	}
}