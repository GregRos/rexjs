"use strict";
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var scalar_1 = require('../rexes/scalar');
var convert_1 = require("../rexes/scalar/convert");
var RexScalarExtensions = {
    convert: function (arg1, arg2) {
        if (_.isFunction(arg1) || _.isFunction(arg2)) {
            return new convert_1.RexConvert(this, { to: arg1, from: arg2 });
        }
        else if (!arg1 && !arg2) {
            throw new TypeError("failed to match any overload for 'convert'.");
        }
        else {
            return new convert_1.RexConvert(this, arg1);
        }
    },
    rectify: function (to, rectify) {
        var _this = this;
        return this.convert(to, function (to) {
            var clone = _.cloneDeep(_this.value);
            rectify(to, clone);
            return clone;
        });
    },
    mutate: function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    },
    member: function (memberName) {
        return this.rectify(function (from) { return from[memberName]; }, function (to, from) {
            from[memberName] = to;
        });
    },
    reduce: function (reducer) {
        this.value = reducer(this.value);
    }
};
Object.assign(scalar_1.RexScalar.prototype, RexScalarExtensions);
//# sourceMappingURL=scalar.js.map