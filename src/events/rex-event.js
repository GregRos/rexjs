"use strict";
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var subscription_1 = require('./subscription');
/**
 * An event primitive used in the rexjs library. Allows the ability to subscribe to notifications.
 *
 */
var freezeKey = "rexjs:RexEvent-frozen";
var RexEvent = (function () {
    /**
     * Constructs a new instance of the @RexEvent.
     * @constructor
     * @param _name A human-readable name for the event. Optional.
     */
    function RexEvent(_name) {
        if (_name === void 0) { _name = "Event"; }
        this._name = _name;
        this._invocList = [];
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
     * @param strong Whether the handler is registered as a weak or strong handler.
     * @returns {Subscription} A token that supports a close() method, upon which this subscription is cancelled.
     */
    RexEvent.prototype.on = function (handler) {
        var _this = this;
        var handlerKey = {};
        var finalHandler;
        if (handler instanceof RexEvent) {
            finalHandler = handler.fire.bind(handler);
        }
        else if (_.isFunction(handler)) {
            finalHandler = handler;
        }
        else {
            throw new TypeError("Failed to resolve overload: " + handler + " is not a RexEvent or a function.");
        }
        this._invocList.push(finalHandler);
        return new subscription_1.Subscription({
            close: function () {
                _.pull(_this._invocList, finalHandler);
            },
            freeze: function () { return finalHandler[freezeKey] = true; },
            unfreeze: function () { return finalHandler[freezeKey] = undefined; }
        });
    };
    /**
     * Fires the event. This method's visibility is not restricted, but it should be used carefully.
     * @param arg The argument with which the event is raised.
     */
    RexEvent.prototype.fire = function (arg) {
        this._invocList.forEach(function (f) {
            if (!f[freezeKey]) {
                f(arg);
            }
        });
    };
    /**
     * Clears the event's subscription list. Use this method carefully.
     */
    RexEvent.prototype.clear = function () {
        this._invocList = [];
    };
    RexEvent.prototype.toString = function () {
        return "[object RexEvent " + this.name + "]";
    };
    return RexEvent;
}());
exports.RexEvent = RexEvent;
//# sourceMappingURL=rex-event.js.map