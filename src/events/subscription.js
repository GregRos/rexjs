/**
 * Created by Greg on 03/10/2016.
 */
/**
 * Created by Greg on 01/10/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
/**
 * A special token that represents a subscription to a RexEvent and allows certain operations to be performed on the subscription.
 */
var Subscription = (function () {
    /**
     * Constructs a new subscription token.
     * @param members The actions this Subscription supports or just the Close action.
     */
    function Subscription(members) {
        if (_.isFunction(members)) {
            this._members = {
                close: members,
                freeze: function () { },
                unfreeze: function () { }
            };
        }
        else {
            this._members = members;
        }
    }
    /**
     * Combines this subscription token with others to create a single token that controls them all.
     * @param otherTokens The other tokens.
     * @returns {Subscription} A multi-subscription token.
     */
    Subscription.prototype.and = function () {
        var otherTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            otherTokens[_i - 0] = arguments[_i];
        }
        return Subscription.all([this].concat(otherTokens));
    };
    /**
     * Freezes this subscription, executes the action, and unfreezes it.
     * @param action An action to do while the subscription is frozen.
     */
    Subscription.prototype.freezeWhile = function (action) {
        if (this._members) {
            this.freeze();
            action();
            this.unfreeze();
        }
        else {
            action();
        }
    };
    Subscription.all = function (tokens) {
        var arr = tokens.map(function (x) { return x instanceof MultiSubscription ? x._disposalList : [x]; });
        var flat = _.flatten(arr);
        return new MultiSubscription(flat);
    };
    /**
     * Freezes this subscription until it is unfrozen or closed. Does nothing if the subscription is frozen or closed.
     */
    Subscription.prototype.freeze = function () {
        if (this.isClosed) {
            return;
        }
        this._members.freeze.call(this);
    };
    /**
     * Unfreezes the subscription if it's frozen. Does nothing if the subscription is not frozen or has been closed.
     */
    Subscription.prototype.unfreeze = function () {
        if (this.isClosed) {
            return;
        }
        this._members.unfreeze.call(this);
    };
    /**
     * Closes the subscription managed by this token. If called on a closed subscription, does nothing.
     */
    Subscription.prototype.close = function () {
        if (this._members) {
            this._members.close.call(this);
            this._members = null;
        }
    };
    Object.defineProperty(Subscription.prototype, "isClosed", {
        /**
         * Whether this subscription has been closed.
         * @returns {boolean}
         */
        get: function () {
            return !this._members;
        },
        enumerable: true,
        configurable: true
    });
    return Subscription;
}());
exports.Subscription = Subscription;
var MultiSubscription = (function (_super) {
    __extends(MultiSubscription, _super);
    function MultiSubscription(list) {
        var close = function () { return list.forEach(function (x) { return x.close(); }); };
        var freeze;
        var unfreeze;
        freeze = function () { return list.forEach(function (x) { return x.freeze(); }); };
        unfreeze = function () { return list.forEach(function (x) { return x.unfreeze(); }); };
        _super.call(this, {
            freeze: freeze,
            unfreeze: unfreeze,
            close: close
        });
        this._disposalList = list;
    }
    MultiSubscription.prototype.close = function () {
        _super.prototype.close.call(this);
        this._disposalList = [];
    };
    return MultiSubscription;
}(Subscription));
exports.MultiSubscription = MultiSubscription;
//# sourceMappingURL=subscription.js.map