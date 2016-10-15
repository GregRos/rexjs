import {RexVar} from "../rexes/scalar/var";
import {Rex} from "../rexes/base";
import {RexScalar} from "../rexes/scalar/index";
import {RexComputed} from "../rexes/scalar/computed";
/**
 * Created by Greg on 02/10/2016.
 */

/**
 * Module for constructing various rexjs objects.
 */
export module Rexes {
	/**
	 * Constructs a Var Rex object, which is backed by a variable, and supports both reading and writing.
	 * @param initial The initial value of the Var.
	 * @returns {RexVar<T>} The Var object.
	 */
	export function var_<T>(initial : T) : RexScalar<T> {
		return new RexVar<T>(initial, true, true);
	}

	/**
	 * Constructs a Const Rex object, which is like a Var, but writing to it throws an error.
	 * @param value The value of the Const.
	 * @returns {RexVar<T>}
	 */
	export function const_<T>(value : T) : RexScalar<T> {
		return new RexVar<T>(value, true, false);
	}

	export function computed_<T>(onRead : () => T, onWrite ?: (input : T) => void) {
		return new RexComputed(onRead, onWrite);
	}
}

/**
 * Module for reflecting over rexjs objects.
 */
export module Rexflect {
	/**
	 * Returns true if the argument is a Rex object, i.e. an instanceof {Rex}.
	 * @param x The object to test.
	 * @returns {boolean}
	 */
	export function isRex(x : any) : x is Rex<any> {
		return x instanceof Rex;
	}

	/**
	 * Returns true if the argument is a scalar rex object, i.e. an instanceof {RexScalar}.
	 * @param x The object to test.
	 */
	export function isScalar(x : any) : x is RexScalar<any> {
		return x instanceof RexScalar;
	}

}
