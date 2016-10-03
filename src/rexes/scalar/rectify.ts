import {RexConvert} from "./convert";
import {RexScalar} from "./index";
import _ = require("lodash");
import {RexNames} from '../names';
/**
 * Created by Greg on 03/10/2016.
 */

export interface Rectifier<TFrom, TTo> {
	to ?: (from : TFrom) => TTo;
	rectify ?: (current : TFrom, input : TTo) => void;
}

export class RexRectify<TFrom, TTo> extends RexConvert<TFrom, TTo> {
	constructor(parent : RexScalar<TFrom>, rectifier : Rectifier<TFrom, TTo>) {
		let rectifyAsFrom = (to : TTo) => {
			let currentClone = _.cloneDeep(parent.value);
			rectifier.rectify(currentClone, to);
			return currentClone;
		};
		super(parent, {
			to : rectifier.to,
			from : rectifyAsFrom
		});
		this.info.type = RexNames.Rectify;
	}
}