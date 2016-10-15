"use strict";
var var_1 = require("../rexes/scalar/var");
var base_1 = require("../rexes/base");
var index_1 = require("../rexes/scalar/index");
var computed_1 = require("../rexes/scalar/computed");
/**
 * Created by Greg on 02/10/2016.
 */
/**
 * Module for constructing various rexjs objects.
 */
var Rexes;
(function (Rexes) {
    /**
     * Constructs a Var Rex object, which is backed by a variable, and supports both reading and writing.
     * @param initial The initial value of the Var.
     * @returns {RexVar<T>} The Var object.
     */
    function var_(initial) {
        return new var_1.RexVar(initial, true, true);
    }
    Rexes.var_ = var_;
    /**
     * Constructs a Const Rex object, which is like a Var, but writing to it throws an error.
     * @param value The value of the Const.
     * @returns {RexVar<T>}
     */
    function const_(value) {
        return new var_1.RexVar(value, true, false);
    }
    Rexes.const_ = const_;
    function computed_(onRead, onWrite) {
        return new computed_1.RexComputed(onRead, onWrite);
    }
    Rexes.computed_ = computed_;
})(Rexes = exports.Rexes || (exports.Rexes = {}));
/**
 * Module for reflecting over rexjs objects.
 */
var Rexflect;
(function (Rexflect) {
    /**
     * Returns true if the argument is a Rex object, i.e. an instanceof {Rex}.
     * @param x The object to test.
     * @returns {boolean}
     */
    function isRex(x) {
        return x instanceof base_1.Rex;
    }
    Rexflect.isRex = isRex;
    /**
     * Returns true if the argument is a scalar rex object, i.e. an instanceof {RexScalar}.
     * @param x The object to test.
     */
    function isScalar(x) {
        return x instanceof index_1.RexScalar;
    }
    Rexflect.isScalar = isScalar;
})(Rexflect = exports.Rexflect || (exports.Rexflect = {}));

//# sourceMappingURL=rex.js.map
