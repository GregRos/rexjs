import {BaseBinding, ChangeSource} from "./base-binding";
import {ScalarChange, RexScalar} from "../rexes/scalar/index";
/**
 * Created by Greg on 16/10/2016.
 */

export class ScalarBinding<T> extends BaseBinding<ScalarChange<T>, RexScalar<T>> {
	protected _rectify(source : ChangeSource, data : ScalarChange<T>) {
		let {origin, target} = this;
		let value : T;
		try {
			if (source === "origin") {
				value = origin.value;
			} else {
				value = target.value;
			}
		}
		catch (ex) {
			throw ex;
		}
		try {
			if (source === "target") {
				target.value = value;
			} else {
				origin.value = value;
			}
		}
		catch (ex) {
			throw ex;
		}
	}

	private _justClose() {
		super.close();
	}

	/**
	 * Disposes of this binding, also resetting the `binding` property of its target to null.
	 */
	close() {
		let {target} = this;
		(target as any)._resetBinding();
		super.close();

	}
}