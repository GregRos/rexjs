"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var scalar_1 = require('../rexes/scalar');
var convert_1 = require("../rexes/scalar/convert");
var RexScalarExtensions = (function (_super) {
    __extends(RexScalarExtensions, _super);
    function RexScalarExtensions() {
        _super.apply(this, arguments);
    }
    RexScalarExtensions.prototype.convert = function (arg1, arg2) {
        if (_.isFunction(arg1) || _.isFunction(arg2)) {
            return new convert_1.RexConvert(this, { from: arg1, to: arg2 });
        }
        else if (!arg1 && !arg2) {
            throw new TypeError("failed to match any overload for 'convert'.");
        }
        else {
            return new convert_1.RexConvert(this, arg1);
        }
    };
    RexScalarExtensions.prototype.rectify = function (to, rectify) {
        var _this = this;
        return this.convert(to, function (to) {
            var clone = _.cloneDeep(_this.value);
            rectify(to, clone);
            return clone;
        });
    };
    RexScalarExtensions.prototype.mutate = function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    };
    RexScalarExtensions.prototype.member = function (memberName) {
        return this.rectify(function (from) { return from[memberName]; }, function (to, from) {
            from[memberName] = to;
        });
    };
    RexScalarExtensions.prototype.reduce = function (reducer) {
        this.value = reducer(this.value);
    };
    return RexScalarExtensions;
}(scalar_1.RexScalar));
Object.assign(scalar_1.RexScalar.prototype, RexScalarExtensions.prototype);

//# sourceMappingURL=scalar.js.map
