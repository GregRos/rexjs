
import {IRexInfo, RexNames, RexScalar} from "../";
import {RexLink} from "./link";
import {ScalarChange} from "./index";
import {Subscription} from "../../events/subscription";
/**
 * Created by Greg on 12/10/2016.
 */

export class RexListen<T> extends RexLink<T> {
	info: IRexInfo = {
		lazy : true,
		type : RexNames.Listen,
		functional : false
	};
	private _token : Subscription;

	constructor(parent : RexScalar<T>, callback : (change : ScalarChange<T>) => void) {
		super(parent);
		this._token = this.changed.on(callback);
	}

	close() {
		if (!this._token) return;
		this._token.close();
		super.close();
	}

}