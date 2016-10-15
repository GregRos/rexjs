"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rex_event_1 = require("./rex-event");
var subscription_1 = require("./subscription");
/**
 * Created by Greg on 13/10/2016.
 */
/**
 * An empty implementation of a RexEvent. Can be used when a non-functional event is required.
 */
var DummyEvent = (function (_super) {
    __extends(DummyEvent, _super);
    function DummyEvent(name) {
        _super.call(this, name);
    }
    DummyEvent.prototype.on = function (handler) {
        return new subscription_1.Subscription({
            close: function () { },
            freeze: function () { },
            unfreeze: function () { }
        });
    };
    DummyEvent.prototype.fire = function (arg) {
    };
    DummyEvent.prototype.toString = function () {
        return "[object DummyEvent " + this.name + "]";
    };
    return DummyEvent;
}(rex_event_1.RexEvent));
exports.DummyEvent = DummyEvent;

//# sourceMappingURL=dummy-event.js.map
