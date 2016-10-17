"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_binding_1 = require("./base-binding");
/**
 * Created by Greg on 16/10/2016.
 */
var ScalarBinding = (function (_super) {
    __extends(ScalarBinding, _super);
    function ScalarBinding() {
        _super.apply(this, arguments);
    }
    ScalarBinding.prototype._rectify = function (source, data) {
        var _a = this, origin = _a.origin, target = _a.target;
        var value;
        try {
            if (source === "origin") {
                value = origin.value;
            }
            else {
                value = target.value;
            }
        }
        catch (ex) {
            throw ex;
        }
        try {
            if (source === "target") {
                target.value = value;
            }
            else {
                origin.value = value;
            }
        }
        catch (ex) {
            throw ex;
        }
    };
    return ScalarBinding;
}(base_binding_1.BaseBinding));
exports.ScalarBinding = ScalarBinding;

//# sourceMappingURL=scalar-binding.js.map
