import { Rex } from "../rexes/base";
import { RexScalar } from "../rexes/scalar/index";
import { RexComputed } from "../rexes/scalar/computed";
/**
 * Created by Greg on 02/10/2016.
 */
/**
 * Module for constructing various rexjs objects.
 */
export declare module Rexes {
    /**
     * Constructs a Var Rex object, which is backed by a variable, and supports both reading and writing.
     * @param initial The initial value of the Var.
     * @returns {RexVar<T>} The Var object.
     */
    function var_<T>(initial: T): RexScalar<T>;
    /**
     * Constructs a Const Rex object, which is like a Var, but writing to it throws an error.
     * @param value The value of the Const.
     * @returns {RexVar<T>}
     */
    function const_<T>(value: T): RexScalar<T>;
    function computed_<T>(onRead: () => T, onWrite?: (input: T) => void): RexComputed<T>;
}
/**
 * Module for reflecting over rexjs objects.
 */
export declare module Rexflect {
    /**
     * Returns true if the argument is a Rex object, i.e. an instanceof {Rex}.
     * @param x The object to test.
     * @returns {boolean}
     */
    function isRex(x: any): x is Rex<any>;
    /**
     * Returns true if the argument is a scalar rex object, i.e. an instanceof {RexScalar}.
     * @param x The object to test.
     */
    function isScalar(x: any): x is RexScalar<any>;
}
