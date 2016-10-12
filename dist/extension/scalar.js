"use strict";
/**
 * Created by Greg on 01/10/2016.
 */
var _ = require('lodash');
var scalar_1 = require('../rexes/scalar');
var convert_1 = require("../rexes/scalar/convert");
var rex_event_1 = require("../events/rex-event");
var notify_1 = require("../rexes/scalar/notify");
var silence_1 = require("../rexes/scalar/silence");
var member_1 = require("../rexes/scalar/member");
var rectify_1 = require("../rexes/scalar/rectify");
var link_1 = require("../rexes/scalar/link");
var RexScalarExtensions = {
    convert_: function (arg1, arg2) {
        if (_.isFunction(arg1) || _.isFunction(arg2)) {
            return new convert_1.RexConvert(this, { to: arg1, from: arg2 });
        }
        else if (!arg1 && !arg2) {
            throw new TypeError("failed to match any overload for 'convert'.");
        }
        else {
            return new convert_1.RexConvert(this, arg1);
        }
    },
    link_: function () {
        return new link_1.RexLink(this);
    },
    rectify_: function (arg1, arg2) {
        if (_.isFunction(arg1)) {
            return new rectify_1.RexRectify(this, {
                to: arg1,
                rectify: arg2
            });
        }
        else {
            return new rectify_1.RexRectify(this, arg1);
        }
    },
    member_: function (memberName) {
        if (!memberName) {
            return this.link_();
        }
        return new member_1.RexMember(this, memberName);
    },
    notify_: function (eventOrEventGetter) {
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
    },
    silence_: function (silencer) {
        if (!silencer) {
            return this.link_();
        }
        else {
            return new silence_1.RexSilence(this, silencer);
        }
    },
    listen_: function () {
        var callbacks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            callbacks[_i - 0] = arguments[_i];
        }
        var allCallbacks = function (change) {
            callbacks.forEach(function (f) { return f(change); });
        };
        this.changed.on(allCallbacks);
        return this;
    },
    mutate: function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    },
    reduce: function (reducer) {
        this.value = reducer(this.value);
    }
};
Object.assign(scalar_1.RexScalar.prototype, RexScalarExtensions);

//# sourceMappingURL=scalar.js.map
