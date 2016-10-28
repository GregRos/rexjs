"use strict";
var src_1 = require("../src");
/**
 * Created by Greg on 02/10/2016.
 */
describe("events", function () {
    var event = new src_1.RexEvent();
    var tally = "";
    var sub;
    beforeEach(function () {
        event.clear();
        tally = "";
    });
    describe("empty event", function () {
        it("should fire", function () {
            event.fire(1);
        });
    });
    describe("simple subscription", function () {
        beforeEach(function () { return sub = event.on(function (x) { return tally += x; }); });
        it("should basic subscribe", function () {
            event.fire(1);
            expect(tally).toBe("1");
        });
        it("should subscribe twice", function () {
            event.on(function (x) { return tally += -x; });
            event.fire(1);
            expect(tally).toBe("1-1");
        });
        describe("freezing", function () {
            var sub2;
            beforeEach(function () {
                sub2 = event.on(function (x) { return tally += -x; });
            });
            it("should freeze", function () {
                sub2.freeze();
                event.fire(1);
                expect(tally).toBe("1");
            });
            it("freezing twice does nothing", function () {
                sub2.freeze();
                sub2.freeze();
                event.fire(1);
                expect(tally).toBe("1");
            });
            it("it should unfreeze", function () {
                sub2.freeze();
                event.fire(1);
                sub2.unfreeze();
                event.fire(1);
                expect(tally).toBe("11-1");
            });
            it("unfreeze on unfrozen does nothing", function () {
                sub.unfreeze();
                sub.unfreeze();
                event.fire(1);
                expect(tally).toBe("1-1");
            });
        });
    });
    describe("event subscribe/unsubscribe support", function () {
        var event2 = new src_1.RexEvent("event2");
        beforeEach(function () {
            event2.clear();
        });
        it("should subscribe correctly", function () {
            event2.on(event);
            event.on(function (x) { return tally += x; });
            event2.fire(1);
            expect(tally).toBe("1");
        });
        it("should unsubscribe correctly", function () {
            var tok = event2.on(event);
            event.on(function (x) { return tally += x; });
            event2.fire(0);
            expect(tally).toBe("0");
            tok.close();
            event2.fire(1);
            expect(tally).toBe("0");
        });
    });
});
//# sourceMappingURL=event.spec.js.map