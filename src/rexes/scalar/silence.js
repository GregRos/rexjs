"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require("./index");
var _1 = require('../');
/**
 * Created by Greg on 03/10/2016.
 */
var RexSilence = (function (_super) {
    __extends(RexSilence, _super);
    function RexSilence(parent, criterion) {
        var _this = this;
        _super.call(this);
        this.parent = parent;
        this.info = {
            type: _1.RexNames.Silence,
            lazy: true,
            functional: false
        };
        this.depends.source = parent;
        if (criterion) {
            this._token = parent.changed.on(function (x) { return !criterion(x) ? _this.changed.fire(x) : void 0; });
        }
    }
    Object.defineProperty(RexSilence.prototype, "value", {
        get: function () {
            this.makeSureNotClosed();
            return this.parent.value;
        },
        set: function (newValue) {
            this.makeSureNotClosed();
            this.parent.value = newValue;
        },
        enumerable: true,
        configurable: true
    });
    return RexSilence;
}(index_1.RexScalar));
exports.RexSilence = RexSilence;
//# sourceMappingURL=silence.js.map