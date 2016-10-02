/**
 * Created by Greg on 03/10/2016.
 */
/**
 * Created by Greg on 01/10/2016.
 */

import _ = require("lodash");
/**
 * Interface for abstracting over disposal tokens.
 */
export interface IDisposable {
	close() : void;
}

/**
 * A special token used for performing deterministic cleanup. Part of rexjs infrastructure.
 */
export class DisposalToken implements IDisposable {
	/**
	 * Constructs a new `DisposalToken`.
	 * @param _close The action to perform when the token is closed. This function will only be called once.
	 */
	constructor(private _close : () => void) {

	}

	and(...otherTokens : IDisposable[]) {
		return DisposalToken.all([this, ...otherTokens]);
	}

	static all(tokens : IDisposable[]) {
		let arr = tokens.map(x => x instanceof DisposalTokenList ? (x as any)._disposalList as IDisposable[] : [x]);
		let flat = _.flatten(arr);
		return new DisposalTokenList(flat);
	}

	/**
	 * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
	 */
	close() {
		if (this._close) {
			this._close();
			this._close = null;
		}
	}
}

class DisposalTokenList extends DisposalToken {
	private _disposalList : IDisposable[];

	constructor(list : IDisposable[]) {
		super(() => {
			this._disposalList.forEach(x => x.close());
		});
		this._disposalList = list;
	}

	close() {
		super.close();
		this._disposalList = [];
	}
}