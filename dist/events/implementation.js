"use strict";
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var interfaces_1 = require('./interfaces');
/**
 * An event primitive used in the rexjs library. Allows the ability to subscribe to notifications.
 *
 */
var RexEvent = (function () {
    /**
     * Constructs a new instance of the @RexEvent.
     * @constructor
     * @param _name A human-readable name for the event. Optional.
     */
    function RexEvent(_name) {
        if (_name === void 0) { _name = "Event"; }
        this._name = _name;
        this._invocationList = [];
    }
    Object.defineProperty(RexEvent.prototype, "name", {
        /**
         * Returns the human-readable name for the event.
         * @returns {string}
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attaches a handler to this event or subscribes to it. When the event will fire it will also fire the handler.
     * If the handler is a function, it's called, and if it's an event, it's fired.
     * @param handler The handler, which can be another event or a function.
     * @returns {DisposalToken} A token that supports a close() method, upon which this subscription is cancelled.
     */
    RexEvent.prototype.on = function (handler) {
        var _this = this;
        if (handler instanceof RexEvent) {
            var myBound_1 = handler.fire.bind(handler);
            this._invocationList.push(myBound_1);
            return new interfaces_1.DisposalToken(function () { return _.remove(_this._invocationList, function (x) { return x === myBound_1; }); });
        }
        else if (_.isFunction(handler)) {
            this._invocationList.push(handler);
            return new interfaces_1.DisposalToken(function () { return _.remove(_this._invocationList, function (x) { return x === handler; }); });
        }
        else {
            throw new TypeError("Failed to resolve overload: " + handler + " is not a RexEvent or a function.");
        }
    };
    /**
     * Fires the event. This method's visibility is not restricted, but it should be used carefully.
     * @param arg The argument with which the event is raised.
     */
    RexEvent.prototype.fire = function (arg) {
        this._invocationList.forEach(function (f) { return f(arg); });
    };
    /**
     * Clears the event's subscription list. Use this method carefully.
     */
    RexEvent.prototype.clear = function () {
        this._invocationList = [];
    };
    RexEvent.prototype.toString = function () {
        return "[object RexEvent " + this.name + "]";
    };
    return RexEvent;
}());
exports.RexEvent = RexEvent;

//# sourceMappingURL=implementation.js.map
