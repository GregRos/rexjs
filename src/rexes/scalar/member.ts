import {RexConvert} from "./convert";
import {RexScalar} from "./index";
import {RexRectify} from "./rectify";
import {RexNames} from '../names';
/**
 * Created by Greg on 03/10/2016.
 */
export class RexMember<T> extends RexRectify<Object, T> {
	constructor(parent : RexScalar<Object>, private memberName : string) {
		super(parent, {
			to : from => from[memberName],
			rectify : (current, input : T) => current[memberName] = input
		});
		this.info.type = RexNames.Member;
	}
}