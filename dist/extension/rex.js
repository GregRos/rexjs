"use strict";
var var_1 = require("../rexes/scalar/var");
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

//# sourceMappingURL=rex.js.map
