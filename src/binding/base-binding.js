"use strict";
var errors_1 = require('../errors');
var BaseBinding = (function () {
    function BaseBinding(origin, priority) {
        /**
         * Whether the binding is currently updating itself. Used to avoid infinite recursion.
         * @type {boolean}
         * @private
         */
        this._isUpdating = false;
        /**
         * Whether the binding has been disposed.
         * @type {boolean}
         * @readonly
         */
        this.isClosed = false;
        this.origin = origin;
        this.priority = priority;
    }
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
        var _a = this, priority = _a.priority, origin = _a.origin, isInitialized = _a.isInitialized;
        if (isInitialized) {
            throw errors_1.Errors.alreadyBound();
        }
        if (priority === "target") {
            this._onChange(null, target);
        }
        else if (priority === "origin") {
            this._onChange(null, origin);
        }
        //force-assign to this fake readonly property
        this.target = target;
        this._targetToken = target.changed.on(function (data) { return _this._onChange(data, target); });
        this._originToken = origin.changed.on(function (data) { return _this._onChange(data, origin); });
    };
    BaseBinding.prototype._onChange = function (data, notifier) {
        var _a = this, _isUpdating = _a._isUpdating, origin = _a.origin, target = _a.target, isInitialized = _a.isInitialized, priority = _a.priority;
        if (!isInitialized) {
            return;
        }
        if (_isUpdating) {
            return;
        }
        this._isUpdating = true;
        this._rectify(notifier === origin ? "origin" : "target", data);
        this._isUpdating = false;
    };
    BaseBinding.prototype.close = function () {
        var _a = this, _targetToken = _a._targetToken, _originToken = _a._originToken;
        _originToken.close();
        _targetToken.close();
        this.isClosed = true;
    };
    return BaseBinding;
}());
exports.BaseBinding = BaseBinding;
//# sourceMappingURL=base-binding.js.map