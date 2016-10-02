/**
 * Created by Greg on 01/10/2016.
 */
import _ = require('lodash');
import {DisposalToken} from './disposal-token';
/**
 * An event primitive used in the rexjs library. Allows the ability to subscribe to notifications.
 *
 */
export class RexEvent<TParam> {

	/**
	 * Constructs a new instance of the @RexEvent.
	 * @constructor
	 * @param _name A human-readable name for the event. Optional.
	 */
	constructor(private _name : string = "Event") {

	}

	/**
	 * Returns the human-readable name for the event.
	 * @returns {string}
	 */
	get name() {
		return this._name;
	}

	private _invocationList = [];

	/**
	 * Attaches a handler to this event or subscribes to it. When the event will fire it will also fire the handler.
	 * If the handler is a function, it's called, and if it's an event, it's fired.
	 * @param handler The handler, which can be another event or a function.
	 * @returns {DisposalToken} A token that supports a close() method, upon which this subscription is cancelled.
	 */
	on<S extends TParam>(handler : ((arg : S) => void) | RexEvent<S>) : DisposalToken {
		if (handler instanceof RexEvent) {
			let myBound = handler.fire.bind(handler);
			this._invocationList.push(myBound);
			return new DisposalToken(() => _.remove(this._invocationList, x => x === myBound));
		} else if (_.isFunction(handler)) {
			this._invocationList.push(handler);
			return new DisposalToken(() => _.remove(this._invocationList, x => x === handler));
		} else {
			throw new TypeError(`Failed to resolve overload: ${handler} is not a RexEvent or a function.`);
		}
	}

	/**
	 * Fires the event. This method's visibility is not restricted, but it should be used carefully.
	 * @param arg The argument with which the event is raised.
	 */
	fire(arg : TParam) {
		this._invocationList.forEach(f => f(arg));
	}

	/**
	 * Clears the event's subscription list. Use this method carefully.
	 */
	clear() {
		this._invocationList = [];
	}

	toString() {
		return `[object RexEvent ${this.name}]`;
	}
}