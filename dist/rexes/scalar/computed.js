"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require('../');
/**
 * Created by Greg on 12/10/2016.
 */
var RexComputed = (function (_super) {
    __extends(RexComputed, _super);
    function RexComputed(onRead, onWrite) {
        _super.call(this);
        this.onRead = onRead;
        this.onWrite = onWrite;
        this.info = {
            functional: true,
            type: _1.RexNames.Computed,
            lazy: true
        };
    }
    Object.defineProperty(RexComputed.prototype, "value", {
        get: function () {
            this.makeSureNotClosed();
            return this.onRead();
        },
        set: function (x) {
            this.makeSureNotClosed();
            if (this.onWrite) {
                this.onWrite(x);
            }
        },
        enumerable: true,
        configurable: true
    });
    return RexComputed;
}(_1.RexScalar));
exports.RexComputed = RexComputed;

//# sourceMappingURL=computed.js.map
