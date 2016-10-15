"use strict";
/**
 * Created by Greg on 14/10/2016.
 */
var _ = require('lodash');
var SemiWeakMap = (function () {
    function SemiWeakMap() {
        this._keys = [];
        this._weakMap = new WeakMap();
    }
    SemiWeakMap.prototype.set = function (key, value) {
        if (!this._keys.includes(key)) {
            this._keys.push(key);
        }
        this._weakMap.set(key, value);
    };
    SemiWeakMap.prototype.clear = function () {
        this._keys = [];
        this._weakMap = new WeakMap();
    };
    SemiWeakMap.prototype.remove = function (key) {
        if (this._weakMap.delete(key)) {
            _.pull(this._keys, key);
        }
    };
    SemiWeakMap.prototype.get = function (key) {
        return this._weakMap.get(key);
    };
    SemiWeakMap.prototype.forEach = function (f) {
        var toRemove = [];
        for (var _i = 0, _a = this._keys.slice(0); _i < _a.length; _i++) {
            var key = _a[_i];
            var wValue = this._weakMap.get(key);
            if (wValue) {
                f(wValue);
            }
            else {
                toRemove.push(key);
            }
        }
        _.pull.apply(_, [this._keys].concat(toRemove));
    };
    return SemiWeakMap;
}());
exports.SemiWeakMap = SemiWeakMap;

//# sourceMappingURL=semi-weak-map.js.map
