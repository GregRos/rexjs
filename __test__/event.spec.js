"use strict";
var src_1 = require("../src");
/**
 * Created by Greg on 02/10/2016.
 */
describe("events", function () {
    var event = new src_1.RexEvent();
    var tally = "";
    beforeEach(function () {
        event.clear();
        tally = "";
    });
    describe("basic subscribe/unsubscribe support", function () {
        it("should basic subscribe", function () {
            event.on(function (x) { return tally += x; });
            event.fire(1);
            expect(tally).toBe("1");
        });
        it("should subscribe multiple times", function () {
            event.on(function (x) { return tally += x; });
            event.on(function (x) { return tally += -x; });
            event.fire(1);
            expect(tally).toBe("1-1");
        });
        it("should unsubscribe correctly", function () {
            var token = event.on(function (x) { return tally += x; });
            event.fire(1);
            expect(tally).toBe("1");
            token.close();
            event.fire(1);
            expect(tally).toBe("1");
        });
        it("should unsubscribe correctly xN", function () {
            var toks = [];
            var _loop_1 = function(i) {
                toks.push(event.on(function (x) { return tally += i; }));
            };
            for (var i = 0; i < 10; i++) {
                _loop_1(i);
            }
            event.fire(0);
            expect(tally).toBe("0123456789");
            tally = "";
            toks[5].close();
            event.fire(0);
            expect(tally).toBe("012346789");
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