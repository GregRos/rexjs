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
export interface ISubscription {
	close() : void;
	freeze : () => void;
	unfreeze : () => void;
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
	 * @param action
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
	 * Freezes this subscription until it is unfrozen or closed.
	 */
	freeze() : void{
		this._members.freeze.call(this);
	}

	/**
	 * Unfreezes the subscription if it's frozen.
	 */
	unfreeze() {
		this._members.unfreeze.call(this);
	}

	/**
	 * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
	 */
	close() {
		if (this._members) {
			this._members.close.call(this);
			this._members = null;
		}
	}
}

export class MultiSubscription extends Subscription {
	private _disposalList : ISubscription[];

	constructor(list : ISubscription[]) {
		let close = () => list.forEach(x => x.close());
		let freeze : () => void;
		let unfreeze : () => void;
		if (list.length === 0) {
			freeze = unfreeze = () => {};
		} else if (list.length === 1) {
			freeze = () => list.forEach(x => x.freeze());
			unfreeze = () => list.forEach(x => x.unfreeze());
		}
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