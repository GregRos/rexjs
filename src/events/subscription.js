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
     * @param action
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
     * Freezes this subscription until it is unfrozen or closed.
     */
    Subscription.prototype.freeze = function () {
        this._members.freeze.call(this);
    };
    /**
     * Unfreezes the subscription if it's frozen.
     */
    Subscription.prototype.unfreeze = function () {
        this._members.unfreeze.call(this);
    };
    /**
     * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
     */
    Subscription.prototype.close = function () {
        if (this._members) {
            this._members.close.call(this);
            this._members = null;
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;
var MultiSubscription = (function (_super) {
    __extends(MultiSubscription, _super);
    function MultiSubscription(list) {
        var close = function () { return list.forEach(function (x) { return x.close(); }); };
        var freeze;
        var unfreeze;
        if (list.length === 0) {
            freeze = unfreeze = function () { };
        }
        else if (list.length === 1) {
            freeze = function () { return list.forEach(function (x) { return x.freeze(); }); };
            unfreeze = function () { return list.forEach(function (x) { return x.unfreeze(); }); };
        }
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