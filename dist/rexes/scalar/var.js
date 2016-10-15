"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Greg on 01/10/2016.
 */
var _1 = require('./');
var names_1 = require("../names");
var errors_1 = require('../../errors');
var RexVar = (function (_super) {
    __extends(RexVar, _super);
    function RexVar(initial, canRead, canWrite) {
        _super.call(this);
        this.canRead = canRead;
        this.canWrite = canWrite;
        this.info = {
            lazy: false,
            type: names_1.RexNames.Var,
            functional: true
        };
        this.value = initial;
    }
    Object.defineProperty(RexVar.prototype, "value", {
        get: function () {
            this.makeSureNotClosed();
            if (!this.canRead) {
                throw errors_1.Errors.cannotRead(this.meta.name);
            }
            return this._value;
        },
        set: function (val) {
            this.makeSureNotClosed();
            if (!this.canWrite) {
                throw errors_1.Errors.cannotWrite(this.meta.name);
            }
            var oldVal = this._value;
            if (Object.is(this._value, val)) {
                return;
            }
            this._value = val;
            this.notifyChange();
        },
        enumerable: true,
        configurable: true
    });
    return RexVar;
}(_1.RexScalar));
exports.RexVar = RexVar;

//# sourceMappingURL=var.js.map
