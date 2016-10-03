"use strict";
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var scalar_1 = require('../rexes/scalar');
var convert_1 = require("../rexes/scalar/convert");
var names_1 = require("../rexes/names");
var RexScalarExtensions = {
    convert_: function (arg1, arg2) {
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
    rectify_: function (to, rectify) {
        var _this = this;
        var rectify_ = this.convert_(to, function (to) {
            var clone = _.cloneDeep(_this.value);
            rectify(clone, to);
            return clone;
        });
        rectify_.info.type = names_1.RexNames.Rectify;
        return rectify_;
    },
    member_: function (memberName) {
        var member_ = this.rectify_(function (from) { return from[memberName]; }, function (current, input) {
            current[memberName] = input;
        });
        member_.info.type = names_1.RexNames.Member;
        return member_;
    },
    mutate: function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    },
    reduce: function (reducer) {
        this.value = reducer(this.value);
    }
};
Object.assign(scalar_1.RexScalar.prototype, RexScalarExtensions);

//# sourceMappingURL=scalar.js.map
