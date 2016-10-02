"use strict";
var var_1 = require("../rexes/scalar/var");
var base_1 = require("../rexes/base");
var index_1 = require("../rexes/scalar/index");
/**
 * Created by Greg on 02/10/2016.
 */
var Rexs;
(function (Rexs) {
    function var_(initial) {
        return new var_1.RexVar(initial);
    }
    Rexs.var_ = var_;
    function const_(initial) {
        return new var_1.RexVar(initial, true, false);
    }
    Rexs.const_ = const_;
})(Rexs = exports.Rexs || (exports.Rexs = {}));
var Rexflect;
(function (Rexflect) {
    function isRex(x) {
        return x instanceof base_1.Rex;
    }
    Rexflect.isRex = isRex;
    function isScalar(x) {
        return x instanceof index_1.RexScalar;
    }
    Rexflect.isScalar = isScalar;
})(Rexflect = exports.Rexflect || (exports.Rexflect = {}));
//# sourceMappingURL=rex.js.map