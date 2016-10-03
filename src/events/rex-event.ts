/**
 * Created by Greg on 01/10/2016.
 */
import _ = require('lodash');
import {Subscription} from './subscription';
/**
 * An event primitive used in the rexjs library. Allows the ability to subscribe to notifications.
 *
 */

const freezeKey = "rexjs:RexEvent-frozen";
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
	private _invocationList : ((arg : TParam) => void)[] = [];
	/**
	 * Attaches a handler to this event or subscribes to it. When the event will fire it will also fire the handler.
	 * If the handler is a function, it's called, and if it's an event, it's fired.
	 * @param handler The handler, which can be another event or a function.
	 * @returns {Subscription} A token that supports a close() method, upon which this subscription is cancelled.
	 */
	on<S extends TParam>(handler : ((arg : S) => void) | RexEvent<S>) : Subscription {
		let finalHandler : (arg : S) => void;
		if (handler instanceof RexEvent) {
			finalHandler = handler.fire.bind(handler);
		} else if (_.isFunction(handler)) {
			finalHandler = handler;
		} else {
			throw new TypeError(`Failed to resolve overload: ${handler} is not a RexEvent or a function.`);
		}
		this._invocationList.push(finalHandler);
		return new Subscription({
			close: () => _.pull(this._invocationList, finalHandler),
			freeze : () => finalHandler[freezeKey] = true,
			unfreeze : () => finalHandler[freezeKey] = undefined
		});
	}

	/**
	 * Fires the event. This method's visibility is not restricted, but it should be used carefully.
	 * @param arg The argument with which the event is raised.
	 */
	fire(arg : TParam) {
		this._invocationList.forEach(f => {
			if (!f[freezeKey]) {
				f(arg)
			}
		});
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