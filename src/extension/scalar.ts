/**
 * Created by Greg on 01/10/2016.
 */
import _ =require('lodash');
import {RexScalar, ScalarChange} from '../rexes/scalar'
import {Conversion, RexConvert} from "../rexes/scalar/convert";
import {RexNames} from "../rexes/names";
import {RexEvent} from "../events/rex-event";
import {RexNotify} from "../rexes/scalar/notify";
import {RexSilence} from "../rexes/scalar/silence";
import {RexMember} from "../rexes/scalar/member";
import {RexRectify, Rectifier} from "../rexes/scalar/rectify";
import {RexLink} from "../rexes/scalar/link";
import {RexListen} from "../rexes/scalar/listen";
/**
 * This file contains "extension methods" for RexScalar objects.
 */

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

		rectify_<TTo>(rectifier : Rectifier<T, TTo>);
		/**
		 * Gets the member of the specified name from the Rex.
		 * In the back conversion, the current value is cloned and the clone's member is set. Then this rex is updated with the new object.
		 * @param name The name of the member to get.
		 */
		member_<TTo>(name : string)  : RexScalar<TTo>;

		/**
		 * Applies a Silencer Rex that suppresses change notifications that match a certain criterion.
		 * This does not change the value of the Rex.
		 * @param silencer
		 */
		silence_(silencer : (change : ScalarChange<T>) => boolean) : RexScalar<T>;

		/**
		 * Applies a linking Rex that mirrors this Rex.
		 * Used to manage event subscriptions.
		 */
		link_() : RexScalar<T>;

		/**
		 * Creates a Rex that monitors an external event for change notification.
		 * @param eventGetter A function that, given a change notification, constructs an event that can be used to listen for hidden changes.
		 */
		notify_(eventGetter : (change : ScalarChange<T>) => RexEvent<any>) : RexScalar<T>;

		/**
		 * Creates a Rex that monitors an external event for change notification.
		 * @param event An event that, when fired, means a change in the Rex may have occurred.
		 */
		notify_(event : RexEvent<void>) : RexScalar<T>;

		/**
		 * Attaches an array of listeners to the Rex and returns it.
		 * @param listeners The listeners to attach.
		 */
		listen_(...listeners : ((change : ScalarChange<T>) => void)[]);

		/**
		 * Clones the value and applies a mutation on the clone, then updates the Rex with it.
		 * @param mutation The mutation.
		 */
		mutate(mutation : (copy : T) => void) : void;

		/**
		 * Takes a function that updates the current value of the Rex to another value.
		 * @param reducer The reducer.
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

	link_<T>(this : RexScalar<T>) : RexScalar<T> {
		return new RexLink(this);
	},

	rectify_<T, TTo>(this : RexScalar<T>, arg1 : any, arg2 : any)  {
		if (_.isFunction(arg1)) {
			return new RexRectify(this, {
				to : arg1,
				rectify : arg2
			})
		} else {
			return new RexRectify(this, arg1);
		}
	},

	member_<T extends Object, TTo>(this : RexScalar<T>, memberName : string) : any {
		if (!memberName) {
			return this.link_();
		}
		return new RexMember<TTo>(this, memberName);
	},

	notify_<T>(this : RexScalar<T>, eventOrEventGetter : RexEvent<void> | ((change : ScalarChange<T>) => RexEvent<void>)) {
		if (!eventOrEventGetter) {
			return this.link_();
		}
		else if (eventOrEventGetter instanceof RexEvent) {
			return new RexNotify(this, x => eventOrEventGetter);
		} else if (_.isFunction(eventOrEventGetter)) {
			return new RexNotify(this, eventOrEventGetter);
		} else {
			throw new TypeError(`Failed to resolve overload of notify_: ${eventOrEventGetter} is not a function or an event.`)
		}
	},

	silence_<T>(this : RexScalar<T>, silencer : (change : ScalarChange<T>) => boolean) {
		if (!silencer) {
			return this.link_();
		}
		else {
			return new RexSilence<T>(this, silencer);
		}
	},

	listen_<T>(this : RexScalar<T>, ...callbacks : ((change : ScalarChange<T>) => void)[]) {
		let allCallbacks = (change : ScalarChange<T>) => {
			callbacks.forEach(f => f(change));
		};
		this.changed.on(allCallbacks);
		return this;
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