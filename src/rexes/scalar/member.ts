import {RexConvert} from "./convert";
import {RexScalar} from "./index";
import {RexRectify} from "./rectify";
import {RexNames} from '../names';
import {Errors} from '../../errors';
/**
 * Created by Greg on 03/10/2016.
 */
export class RexMember<T> extends RexRectify<Object, T> {
	constructor(parent : RexScalar<Object>, private memberName : string) {
		super(parent, {
			to : from => {
				if (memberName in from) {
					return from[memberName];
				}
				throw Errors.memberNotFound(memberName, from);
			},
			rectify : (current, input : T) => {
				if (memberName in current) {
					current[memberName] = input;
					return;
				}
				throw Errors.memberNotFound(memberName, input);
			}
		});
		this.info.type = RexNames.Member;
	}
}