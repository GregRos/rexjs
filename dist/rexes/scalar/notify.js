"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require("./index");
var names_1 = require('../names');
/**
 * Created by Greg on 03/10/2016.
 */
var RexNotify = (function (_super) {
    __extends(RexNotify, _super);
    function RexNotify(parent, notifier) {
        var _this = this;
        _super.call(this);
        this.parent = parent;
        this.info = {
            lazy: true,
            functional: false,
            type: names_1.RexNames.Convert
        };
        this.depends.source = parent;
        this._parentToken = parent.changed.on(this.changed).and();
        var onChange = function (change) {
            var newNotifier = notifier(change);
            if (_this._notifierToken) {
                _this._notifierToken.close();
            }
            _this._notifierToken = newNotifier.on(function () { return _this.notifyChange(); });
        };
        this._selfToken = this.changed.on(onChange);
        this.notifyChange();
    }
    Object.defineProperty(RexNotify.prototype, "value", {
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
    RexNotify.prototype.close = function () {
        if (this.isClosed)
            return;
        [this._notifierToken, this._selfToken, this._parentToken].forEach(function (x) { return x.close(); });
        this._parentToken = this._selfToken = this._notifierToken = null;
        _super.prototype.close.call(this);
    };
    return RexNotify;
}(index_1.RexScalar));
exports.RexNotify = RexNotify;

//# sourceMappingURL=notify.js.map
