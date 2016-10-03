import {RexConvert} from "./convert";
import {RexScalar} from "./index";
import {RexNames} from '../names';
import {IRexInfo} from "../base";
/**
 * Created by Greg on 03/10/2016.
 */


export class RexLink<T> extends RexConvert<T, T> {
	info : IRexInfo = {
		type : RexNames.Link,
		lazy : true,
		functional : false
	};
	constructor(parent : RexScalar<T>) {
		super(parent, {
			from : x => x,
			to : x => x
		});
	}
}