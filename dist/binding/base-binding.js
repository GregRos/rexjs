"use strict";
var errors_1 = require('../errors');
var Chai_1 = require("~chai/lib/Chai");
var BaseBinding = (function () {
    function BaseBinding(origin, attrs) {
        this.origin = origin;
    }
    Object.defineProperty(BaseBinding.prototype, "isClosed", {
        /**
         * Whether the binding has been disposed.
         * @type {boolean}
         * @readonly
         */
        get: function () {
            return !this.origin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBinding.prototype, "isInitialized", {
        /**
         * Returns true if the binding has been initialized, i.e. if it has been assigned a target.
         * @returns {boolean}
         */
        get: function () {
            return !!this.target;
        },
        enumerable: true,
        configurable: true
    });
    BaseBinding.prototype._initialize = function (target) {
        var _this = this;
        Chai_1.assert.isOk(target);
        Chai_1.assert.isNotOk(this._targetToken);
        Chai_1.assert.isNotOk(this._originToken);
        var _a = this, origin = _a.origin, isInitialized = _a.isInitialized;
        if (isInitialized) {
            throw errors_1.Errors.alreadyBound();
        }
        this._onChange(null, origin);
        //force-assign to this fake readonly property
        this.target = target;
        this._targetToken = target.changed.on(function (data) { return _this._onChange(data, target); });
        this._originToken = origin.changed.on(function (data) { return _this._onChange(data, origin); });
    };
    BaseBinding.prototype._onChange = function (data, notifier) {
        var _a = this, origin = _a.origin, target = _a.target, isInitialized = _a.isInitialized, _targetToken = _a._targetToken, _originToken = _a._originToken;
        if (!isInitialized) {
            return;
        }
        [_targetToken, _originToken].forEach(function (x) { return x.freeze(); });
        try {
            this._rectify(notifier === origin ? "origin" : "target", data);
        }
        finally {
            [_targetToken, _originToken].forEach(function (x) { return x.unfreeze(); });
        }
    };
    BaseBinding.prototype.close = function () {
        var _a = this, _targetToken = _a._targetToken, _originToken = _a._originToken, target = _a.target, isClosed = _a.isClosed;
        if (isClosed) {
            return;
        }
        Chai_1.assert.isTrue(_originToken);
        _originToken.close();
        _targetToken && _targetToken.close();
    };
    return BaseBinding;
}());
exports.BaseBinding = BaseBinding;

//# sourceMappingURL=base-binding.js.map
