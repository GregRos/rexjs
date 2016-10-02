/**
 * Created by Greg on 01/10/2016.
 */
import _ = require('lodash');
import {ARexEvent, DisposalToken} from './interfaces';
export class RexEvent<T> extends ARexEvent<T> {

	constructor(private _name : string = "event") {
		super();
	}

	get name() {
		return this._name;
	}

	private _invocationList = [];

	on<S extends T>(handler : ((arg : T) => void) | RexEvent<S>) : DisposalToken {
		if (handler instanceof RexEvent) {
			this._invocationList.push(handler.invoke.bind(handler));
			return new DisposalToken(() => _.remove(this._invocationList, x => x === handler.invoke));
		} else if (_.isFunction(handler)) {
			this._invocationList.push(handler);
			return new DisposalToken(() => _.remove(this._invocationList, x => x === handler));
		} else {
			throw new TypeError(`Failed to resolve overload: ${handler} is not a RexEvent or a function.`);
		}
	}

	invoke(arg : T) {
		this._invocationList.forEach(f => f(arg));
	}

	clear() {
		this._invocationList = [];
	}
}