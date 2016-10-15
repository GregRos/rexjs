"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require("./");
var names_1 = require("../names");
var errors_1 = require('../../errors');
//instead of using undefined to signify a dirty cached value, we use a special token,
//because 'undefined' is a valid value.
var missing = {};
var RexConvert = (function (_super) {
    __extends(RexConvert, _super);
    function RexConvert(parent, conversion) {
        var _this = this;
        _super.call(this);
        this.parent = parent;
        this.conversion = conversion;
        this._last = missing;
        this.info = {
            type: names_1.RexNames.Convert,
            lazy: true,
            functional: true
        };
        this.depends.source = parent;
        this._parentSub = parent.changed.on(function () {
            var lastVal = _this._last;
            _this._last = missing;
            _this.notifyChange();
        });
    }
    Object.defineProperty(RexConvert.prototype, "value", {
        get: function () {
            this.makeSureNotClosed();
            if (this._last === missing) {
                if (!this.conversion.from) {
                    throw errors_1.Errors.cannotRead(this.meta.name);
                }
                this._last = this.conversion.to(this.parent.value);
            }
            return this._last;
        },
        set: function (val) {
            var _this = this;
            this.makeSureNotClosed();
            if (!this.conversion.to) {
                throw errors_1.Errors.cannotWrite(this.meta.name);
            }
            var prevVal = this._last;
            //use Object.is in case of NaN
            if (Object.is(prevVal, val)) {
                return;
            }
            this._last = val;
            var newVal = this.conversion.from(val);
            this._parentSub.freezeWhile(function () { return _this.parent.value = newVal; });
            this.notifyChange();
        },
        enumerable: true,
        configurable: true
    });
    RexConvert.prototype.close = function () {
        if (this.isClosed)
            return;
        this._parentSub.close();
        _super.prototype.close.call(this);
    };
    return RexConvert;
}(_1.RexScalar));
exports.RexConvert = RexConvert;
//# sourceMappingURL=convert.js.map