"use strict";
var _1 = require("../");
var errors_1 = require('../errors');
var Rex = (function () {
    function Rex() {
        this._isClosed = false;
        this.meta = {};
        this.depends = {};
        this.closing = new _1.RexEvent("onClosing");
        this.changed = new _1.RexEvent("onChanged");
    }
    Object.defineProperty(Rex.prototype, "isClosed", {
        get: function () {
            return this._isClosed;
        },
        enumerable: true,
        configurable: true
    });
    Rex.prototype.close = function () {
        this.changed.clear();
        this.closing.fire(undefined);
        this.closing.clear();
        this._isClosed = true;
    };
    Rex.prototype.makeSureNotClosed = function () {
        if (this._isClosed) {
            throw errors_1.Errors.closed(this.meta.name || "");
        }
    };
    return Rex;
}());
exports.Rex = Rex;

//# sourceMappingURL=base.js.map
