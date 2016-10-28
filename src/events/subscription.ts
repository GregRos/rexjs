/**
 * Created by Greg on 03/10/2016.
 */
/**
 * Created by Greg on 01/10/2016.
 */

import _ = require("lodash");
import {Errors, ClosedError} from '../errors';
/**
 * Interface for abstracting over disposal tokens.
 */
export interface ISubscription {
	/**
	 * Called when the subscription is closed. Will not be called on a closed subscription.
	 */
	close() : void;
	/**
	 * Called to freeze the subscription. While a subscription is frozen, the behavior is activates is disabled.
	 * If called on a frozen subscription, should do nothing.
	 */
	freeze() : void;
	/**
	 * Called to unfreeze the subscription.
	 * If called on an unfrozen subscription, should do nothing.
	 */
	unfreeze() : void;
}

/**
 * A special token that represents a subscription to a RexEvent and allows certain operations to be performed on the subscription.
 */
export class Subscription implements ISubscription {

	private _members : ISubscription;

	/**
	 * Constructs a new subscription token.
	 * @param members The actions this Subscription supports or just the Close action.
	 */
	constructor(members : ISubscription | (() => void)) {
		if (_.isFunction(members)) {
			this._members = {
				close : members,
				freeze : () => {},
				unfreeze : () => {}
			}
		} else {
			this._members = members;
		}
	}

	/**
	 * Combines this subscription token with others to create a single token that controls them all.
	 * @param otherTokens The other tokens.
	 * @returns {Subscription} A multi-subscription token.
	 */
	and(...otherTokens : ISubscription[]) : Subscription {
		return Subscription.all([this, ...otherTokens]);
	}

	/**
	 * Freezes this subscription, executes the action, and unfreezes it.
	 * @param action An action to do while the subscription is frozen.
	 */
	freezeWhile(action : () => void) : void {
		if (this._members) {
			this.freeze();
			action();
			this.unfreeze();
		} else {
			action();
		}
	}

	static all(tokens : ISubscription[]) {
		let arr = tokens.map(x => x instanceof MultiSubscription ? (x as any)._disposalList as ISubscription[] : [x]);
		let flat = _.flatten(arr);
		return new MultiSubscription(flat);
	}
	/**
	 * Freezes this subscription until it is unfrozen or closed. Does nothing if the subscription is frozen or closed.
	 */
	freeze() : void{
		if (this.isClosed) {
			return;
		}
		this._members.freeze.call(this);
	}

	/**
	 * Unfreezes the subscription if it's frozen. Does nothing if the subscription is not frozen or has been closed.
	 */
	unfreeze() {
		if (this.isClosed) {
			return;
		}
		this._members.unfreeze.call(this);
	}

	/**
	 * Closes the subscription managed by this token. If called on a closed subscription, does nothing.
	 */
	close() {
		if (this._members) {
			this._members.close.call(this);
			this._members = null;
		}
	}

	/**
	 * Whether this subscription has been closed.
	 * @returns {boolean}
	 */
	get isClosed() {
		return !this._members;
	}
}

export class MultiSubscription extends Subscription {
	private _disposalList : ISubscription[];

	constructor(list : ISubscription[]) {
		let close = () => list.forEach(x => x.close());
		let freeze : () => void;
		let unfreeze : () => void;
		freeze = () => list.forEach(x => x.freeze());
		unfreeze = () => list.forEach(x => x.unfreeze());
		super({
			freeze : freeze,
			unfreeze : unfreeze,
			close : close
		});
		this._disposalList = list;
	}

	close() {
		super.close();
		this._disposalList = [];
	}
}