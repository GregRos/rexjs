import {DisposalToken, IDisposable} from "../index";
import _ = require("lodash");
/**
 * Created by Greg on 02/10/2016.
 */

declare module '../events/interfaces' {
	interface DisposalToken {
		and(...otherTokens : IDisposable[]);
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

const DisposableTokenExtensions = {
	and(this : DisposalToken, ...otherTokens : IDisposable[]) {
		let arr = [this, ...otherTokens].map(x => x instanceof DisposalTokenList ? (x as any)._disposalList as IDisposable[] : [x]);
		let flat = _.flatten(arr);
		return new DisposalTokenList(flat);
	}
};


Object.assign(DisposalToken.prototype, DisposableTokenExtensions);


