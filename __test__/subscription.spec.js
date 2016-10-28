"use strict";
/**
 * Created by Greg on 02/10/2016.
 */
var src_1 = require("../src");
var _ = require("lodash");
var tally = "";
var testsFor = function (members) {
    describe("subscription name: " + members.name, function () {
        var nTally = 0;
        var token;
        beforeEach(function () {
            tally = "";
            nTally = 0;
            token = members.ctor();
        });
        describe("basics", function () {
            it("is not closed", function () {
                expect(token.isClosed).toBe(false);
            });
            it("disposes", function () {
                token.close();
                expect(tally).toBe(members.closeValue);
            });
            it("freezes", function () {
                token.freeze();
                expect(tally).toBe(members.freezeValue);
            });
            it("unfreezes", function () {
                token.unfreeze();
                expect(tally).toBe(members.unfreezeValue);
            });
        });
        describe("redudant operations", function () {
            it("disposes twice, 2nd time is harmless", function () {
                token.close();
                token.close();
                expect(tally).toBe(members.closeValue);
            });
        });
        describe("actions on closed subscription", function () {
            beforeEach(function () {
                token.close();
                tally = "";
            });
            it("freezing", function () {
                token.freeze();
                expect(tally).toBe("");
            });
            it("unfreezing", function () {
                token.freeze();
                expect(tally).toBe("");
            });
            it("freezeWhile", function () {
                token.freezeWhile(function () {
                });
                expect(tally).toBe("");
            });
        });
        describe("extra functionality", function () {
            it("freezeWhile method", function () {
                token.freezeWhile(function () { return tally += "-"; });
                expect(tally).toBe(members.freezeValue + "-" + members.unfreezeValue);
            });
            it("merge tokens", function () {
                var _a = _.range(0, 10).map(function (x) { return members.ctor(); }), fst = _a[0], rest = _a.slice(1);
                var merged = fst.and.apply(fst, rest);
                expect(merged instanceof src_1.Subscription).toBe(true);
                merged.close();
                expect(tally).toBe(_.repeat(members.closeValue, 10));
            });
        });
    });
};
testsFor({
    ctor: function () {
        var _this = this;
        return new src_1.Subscription({
            close: function () { return tally += _this.closeValue; },
            freeze: function () { return tally += _this.freezeValue; },
            unfreeze: function () { return tally += _this.unfreezeValue; }
        });
    },
    closeValue: "a",
    freezeValue: "b",
    unfreezeValue: "c",
    name: "Subscription"
});
testsFor({
    name: "MultiSubscriptionx1",
    closeValue: "c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,",
    unfreezeValue: "u0,u1,u2,u3,u4,u5,u6,u7,u8,u9,",
    freezeValue: "f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,",
    ctor: function () {
        var tokens = [];
        var _loop_1 = function(i) {
            tokens.push(new src_1.Subscription({
                close: function () { return tally += "c" + i + ","; },
                freeze: function () { return tally += "f" + i + ","; },
                unfreeze: function () { return tally += "u" + i + ","; }
            }));
        };
        for (var i = 0; i < 10; i++) {
            _loop_1(i);
        }
        var fst = tokens[0], rest = tokens.slice(1);
        return fst.and.apply(fst, rest);
    }
});
//# sourceMappingURL=subscription.spec.js.map