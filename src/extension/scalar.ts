/**
 * Created by Greg on 01/10/2016.
 */
import _ =require('lodash');
import {RexScalar} from '../rexes/scalar'
import {Conversion, RexConvert} from "../rexes/scalar/convert";

declare module '../rexes/scalar' {
	interface RexScalar<T> {
		convert<TTo>(conversion : Conversion<T, TTo>) : RexScalar<TTo>;
		convert<TTo>(to ?: (from : T) => TTo, from ?: (to : TTo) => T)  : RexScalar<TTo>;
		rectify<TTo>(to ?: (from : T) => TTo, rectify ?: (to : TTo, from : T) => void) : RexScalar<TTo>;

		member<TTo>(name : string)  : RexScalar<TTo>;
		mutate(mutation : (copy : T) => void) : void;
		reduce(reducer : (current : T) => T) : void;
	}
}

const RexScalarExtensions =  {
	convert<T, TTo>(this : RexScalar<T>, arg1 ?: any, arg2 ?: any) : RexScalar<TTo> {
		if (_.isFunction(arg1) || _.isFunction(arg2)) {
			return new RexConvert<T, TTo>(this, {to: arg1, from: arg2});
		} else if (!arg1 && !arg2) {
			throw new TypeError("failed to match any overload for 'convert'.");
		}
		else {
			return new RexConvert<T, TTo>(this, arg1 as Conversion<T, TTo>);
		}
	},

	rectify<T, TTo>(this : RexScalar<T>,to ?: (from : T) => TTo, rectify ?: (to : TTo, from : T) => void)  {
		return this.convert(to, to => {
			let clone = _.cloneDeep(this.value);
			rectify(to, clone);
			return clone;
		});
	},

	mutate<T>(this :RexScalar<T>, mutation : (copy : T) => void) : void {
		let copy = _.cloneDeep(this.value);
		mutation(copy);
		this.value = copy;
	},

	member<T, TTo>(this : RexScalar<T>, memberName : string) {
		return this.rectify(from => from[memberName], (to, from) => {
			from[memberName] = to;
		});
	},

	reduce<T>(this : RexScalar<T>, reducer : (current : T) => T) {
		this.value = reducer(this.value);
	}
}

Object.assign(RexScalar.prototype, RexScalarExtensions);