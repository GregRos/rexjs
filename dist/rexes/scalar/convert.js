"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require("./");
var names_1 = require("../names");
var errors_1 = require('../../errors');
var RexConvert = (function (_super) {
    __extends(RexConvert, _super);
    function RexConvert(parent, conversion) {
        var _this = this;
        _super.call(this);
        this.parent = parent;
        this.conversion = conversion;
        this.info = {
            type: names_1.Convert,
            lazy: true,
            functional: true
        };
        this.depends.source = parent;
        this._subToken = parent.changed.fires(function () { return _this.changed.fire(undefined); });
        var parentClose = parent.closing.fires(function () { return _this.close(); });
        var selfChange = this.changed.fires(function () { return _this._last = undefined; });
        this._subToken = this._subToken.and(parentClose, selfChange);
    }
    Object.defineProperty(RexConvert.prototype, "value", {
        get: function () {
            this.makeSureNotClosed();
            if (this._last === undefined) {
                if (!this.conversion.from) {
                    throw errors_1.Errors.cannotRead(this.meta.name);
                }
                this._last = this.conversion.to(this.parent.value);
            }
            return this._last;
        },
        set: function (val) {
            this.makeSureNotClosed();
            if (!this.conversion.to) {
                throw errors_1.Errors.cannotWrite(this.meta.name);
            }
            this._last = val;
            this.parent.value = this.conversion.from(val);
        },
        enumerable: true,
        configurable: true
    });
    RexConvert.prototype.close = function () {
        this._subToken.close();
        _super.prototype.close.call(this);
    };
    return RexConvert;
}(_1.RexScalar));
exports.RexConvert = RexConvert;

//# sourceMappingURL=convert.js.map
