/**
 * Created by Greg on 01/10/2016.
 */
import _ =require('lodash');
import {RexScalar, ScalarChange} from '../rexes/scalar'
import {Conversion, RexConvert} from "../rexes/scalar/convert";
import {RexNames} from "../rexes/names";
import {RexEvent} from "../events/implementation";
import {RexNotify} from "../rexes/scalar/notify";

declare module '../rexes/scalar' {
	export interface RexScalar<T> {
		/**
		 * Applies a forward and back conversion to this Rex, returning a Convert rex.
		 * @param conversion The conversion object.
		 */
		convert_<TTo>(conversion : Conversion<T, TTo>) : RexScalar<TTo>;

		/**
		 * Applies a forward and back conversion to this Rex, returning a Convert rex.
		 * @param to The function used to convert outwards. If falsy/omitted, the Rex will not support reading.
		 * @param from The function used to convert inwards. If falsy/omitted, the Rex will not support writing.
		 */
		convert_<TTo>(to ?: (from : T) => TTo, from ?: (to : TTo) => T)  : RexScalar<TTo>;

		/**
		 * Applies an assymetric conversion:
		 * Forward conversion will use the {to} function.
		 * Back conversion will use the {rectifier} function. Here, the {current} parameter is a clone of the current value of this Rex and the {to} parameter is the coerced value. Mutate the {current} parameter to rectify the two values.
		 * @param to The forward conversion function.
		 * @param rectifier The backward mutation function.
		 */
		rectify_<TTo>(to ?: (from : T) => TTo, rectifier ?: (current : T, to : TTo) => void) : RexScalar<TTo>;

		/**
		 * Gets the member of the specified name from the Rex.
		 * In the back conversion, the current value is cloned and the clone's member is set. Then this rex is updated with the new object.
		 * @param name The name of the member to get.
		 */
		member_<TTo>(name : string)  : RexScalar<TTo>;

		/**
		 *
		 * @param silencer
		 */
		silence_(silencer : (change : ScalarChange<T>) => boolean) : RexScalar<T>;

		notify_(eventGetter : (change : ScalarChange<T>) => RexEvent<void>) : RexScalar<T>;

		notify_(event : RexEvent<void>);

		/**
		 * Clones the value and applies a mutation on the clone, then updates the Rex with it.
		 * @param mutation
		 */
		mutate(mutation : (copy : T) => void) : void;

		/**
		 * Takes a function that updates the current value of the Rex to another value.
		 * @param reducer
		 */
		reduce(reducer : (current : T) => T) : void;
	}
}

const RexScalarExtensions =  {
	convert_<T, TTo>(this : RexScalar<T>, arg1 ?: any, arg2 ?: any) : RexScalar<TTo> {
		if (_.isFunction(arg1) || _.isFunction(arg2)) {
			return new RexConvert<T, TTo>(this, {to: arg1, from: arg2});
		} else if (!arg1 && !arg2) {
			throw new TypeError("failed to match any overload for 'convert'.");
		}
		else {
			return new RexConvert<T, TTo>(this, arg1 as Conversion<T, TTo>);
		}
	},

	rectify_<T, TTo>(this : RexScalar<T>,to ?: (from : T) => TTo, rectify ?: (current : T, input : TTo) => void)  {
		let rectify_ = this.convert_(to, to => {
			let clone = _.cloneDeep(this.value);
			rectify(clone, to);
			return clone;
		});
		rectify_.info.type = RexNames.Rectify;
		return rectify_;
	},

	member_<T extends Object, TTo>(this : RexScalar<T>, memberName : string) {
		let member_ = this.rectify_(from => from[memberName], (current, input) => {
			current[memberName] = input;
		});
		member_.info.type = RexNames.Member;
		return member_;
	},

	notify_<T>(this : RexScalar<T>, eventOrEventGetter : RexEvent<void> | ((change : ScalarChange<T>) => RexEvent<void>)) {
		if (eventOrEventGetter instanceof RexEvent) {
			return new RexNotify(this, x => eventOrEventGetter);
		} else if (_.isFunction(eventOrEventGetter)) {
			return new RexNotify(this, eventOrEventGetter);
		} else {
			throw new TypeError(`Failed to resolve overload of notify_: ${eventOrEventGetter} is not a function or an event.`)
		}
	},

	mutate<T>(this :RexScalar<T>, mutation : (copy : T) => void) : void {
		let copy = _.cloneDeep(this.value);
		mutation(copy);
		this.value = copy;
	},

	reduce<T>(this : RexScalar<T>, reducer : (current : T) => T) {
		this.value = reducer(this.value);
	}
};

Object.assign(RexScalar.prototype, RexScalarExtensions);