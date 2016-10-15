import {RexEvent} from "./rex-event";
import {Subscription} from "./subscription";
/**
 * Created by Greg on 13/10/2016.
 */

/**
 * An empty implementation of a RexEvent. Can be used when a non-functional event is required.
 */
export class DummyEvent<TParam> extends RexEvent<TParam> {
	constructor(name : string) {
		super(name);
	}

	on<S extends TParam>(handler : ((arg : S) => void) | RexEvent<S>) : Subscription {
		return new Subscription({
			close : () => {},
			freeze : () => {},
			unfreeze : () => {}
		});
	}

	fire(arg : TParam) {

	}

	toString() {
		return `[object DummyEvent ${this.name}]`;
	}
}