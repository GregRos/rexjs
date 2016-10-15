"use strict";
/**
 * Created by Greg on 14/10/2016.
 */
var _ = require('lodash');
var ReflectHelper;
(function (ReflectHelper) {
    var memberAccessRegex = /\.([^.;]+);?\s*}?$/;
    function getMemberName(memberAccessFunction) {
        if (!_.isFunction(memberAccessFunction)) {
            throw new TypeError("Argument was not a function!");
        }
        var strMemberAccess = memberAccessFunction.toString();
        var result = memberAccessRegex.exec(strMemberAccess);
        if (!result) {
            throw new Error("The function was not a simple member access function!");
        }
        return result[1];
    }
    ReflectHelper.getMemberName = getMemberName;
    function mixin(targetCtor) {
        var baseCtors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            baseCtors[_i - 1] = arguments[_i];
        }
        baseCtors.forEach(function (x) {
            Object.getOwnPropertyNames(x.prototype).forEach(function (name) {
                if (name === "constructor")
                    return;
                targetCtor.prototype[name] = x.prototype[name];
            });
        });
    }
    ReflectHelper.mixin = mixin;
})(ReflectHelper = exports.ReflectHelper || (exports.ReflectHelper = {}));
//# sourceMappingURL=index.js.map