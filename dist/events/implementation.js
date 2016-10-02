"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var interfaces_1 = require('./interfaces');
var RexEvent = (function (_super) {
    __extends(RexEvent, _super);
    function RexEvent(_name) {
        if (_name === void 0) { _name = "event"; }
        _super.call(this);
        this._name = _name;
        this._invocationList = [];
    }
    Object.defineProperty(RexEvent.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    RexEvent.prototype.on = function (handler) {
        var _this = this;
        if (handler instanceof RexEvent) {
            this._invocationList.push(handler.invoke.bind(handler));
            return new interfaces_1.DisposalToken(function () { return _.remove(_this._invocationList, function (x) { return x === handler.invoke; }); });
        }
        else if (_.isFunction(handler)) {
            this._invocationList.push(handler);
            return new interfaces_1.DisposalToken(function () { return _.remove(_this._invocationList, function (x) { return x === handler; }); });
        }
        else {
            throw new TypeError("Failed to resolve overload: " + handler + " is not a RexEvent or a function.");
        }
    };
    RexEvent.prototype.invoke = function (arg) {
        this._invocationList.forEach(function (f) { return f(arg); });
    };
    RexEvent.prototype.clear = function () {
        this._invocationList = [];
    };
    return RexEvent;
}(interfaces_1.ARexEvent));
exports.RexEvent = RexEvent;

//# sourceMappingURL=implementation.js.map
