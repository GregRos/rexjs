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
var reflection_1 = require('../reflection');
var scalar_1 = require('../rexes/scalar');
var convert_1 = require("../rexes/scalar/convert");
var rex_event_1 = require("../events/rex-event");
var notify_1 = require("../rexes/scalar/notify");
var silence_1 = require("../rexes/scalar/silence");
var member_1 = require("../rexes/scalar/member");
var rectify_1 = require("../rexes/scalar/rectify");
var link_1 = require("../rexes/scalar/link");
var RexScalarExtensions = (function (_super) {
    __extends(RexScalarExtensions, _super);
    function RexScalarExtensions() {
        _super.apply(this, arguments);
    }
    RexScalarExtensions.prototype.convert_ = function (arg1, arg2) {
        if (_.isFunction(arg1) || _.isFunction(arg2)) {
            return new convert_1.RexConvert(this, { to: arg1, from: arg2 });
        }
        else if (!arg1 && !arg2) {
            throw new TypeError("failed to match any overload for 'convert'.");
        }
        else {
            return new convert_1.RexConvert(this, arg1);
        }
    };
    RexScalarExtensions.prototype.link_ = function () {
        return new link_1.RexLink(this);
    };
    RexScalarExtensions.prototype.rectify_ = function (arg1, arg2) {
        if (_.isFunction(arg1)) {
            return new rectify_1.RexRectify(this, {
                to: arg1,
                rectify: arg2
            });
        }
        else {
            return new rectify_1.RexRectify(this, arg1);
        }
    };
    RexScalarExtensions.prototype.member_ = function (memberName) {
        if (!memberName) {
            return this.link_();
        }
        if (_.isFunction(memberName)) {
            memberName = reflection_1.ReflectHelper.getMemberName(memberName);
        }
        return new member_1.RexMember(this, memberName);
    };
    RexScalarExtensions.prototype.notify_ = function (eventOrEventGetter) {
        if (!eventOrEventGetter) {
            return this.link_();
        }
        else if (eventOrEventGetter instanceof rex_event_1.RexEvent) {
            return new notify_1.RexNotify(this, function (x) { return eventOrEventGetter; });
        }
        else if (_.isFunction(eventOrEventGetter)) {
            return new notify_1.RexNotify(this, eventOrEventGetter);
        }
        else {
            throw new TypeError("Failed to resolve overload of notify_: " + eventOrEventGetter + " is not a function or an event.");
        }
    };
    RexScalarExtensions.prototype.silence_ = function (silencer) {
        return new silence_1.RexSilence(this, silencer);
    };
    RexScalarExtensions.prototype.listen_ = function () {
        var callbacks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            callbacks[_i - 0] = arguments[_i];
        }
        var allCallbacks = function (change) {
            callbacks.forEach(function (f) { return f(change); });
        };
        this.changed.on(allCallbacks);
        return this;
    };
    RexScalarExtensions.prototype.mutate = function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    };
    RexScalarExtensions.prototype.reduce = function (reducer) {
        this.value = reducer(this.value);
    };
    return RexScalarExtensions;
}(scalar_1.RexScalar));
reflection_1.ReflectHelper.mixin(scalar_1.RexScalar, RexScalarExtensions);

//# sourceMappingURL=scalar.js.map
