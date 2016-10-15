"use strict";
/**
 * Created by Greg on 02/10/2016.
 */
var src_1 = require('../src');
var index_1 = require("../src/errors/index");
var src_2 = require("../src");
var throwsClosed = function (f) {
    expect(f).toThrowError(index_1.ClosedError);
};
var tally = "";
beforeEach(function () { return tally = ""; });
var baseTests = function (ctor) {
    describe("basic tests", function () {
        var Var = ctor(0);
        beforeEach(function () {
            Var = ctor(0);
        });
        it("can read", function () {
            expect(Var.value).toBe(0);
        });
        it("can write", function () {
            Var.value = 1;
            expect(Var.value).toBe(1);
        });
        it("notifies change", function () {
            Var.changed.on(function (x) { return tally += "a"; });
            Var.value = 1;
            expect(tally).toBe("a");
        });
        describe("does not notify change when set to current value", function () {
            it("for numbers", function () {
                var num_ = ctor(0);
                num_.value = 0;
                num_.changed.on(function () { return tally += "a"; });
                num_.value = 0;
                expect(tally).toBe("");
            });
            it("for strings", function () {
                var str_ = ctor("a");
                str_.changed.on(function () { return tally += "a"; });
            });
        });
        describe("operations on closed", function () {
            beforeEach(function () { return Var.close(); });
            it("can close again", function () { return Var.close(); });
            it("throws on read", function () { return throwsClosed(function () { return Var.value; }); });
            it("throws on write", function () { return throwsClosed(function () { return Var.value = 1; }); });
            it("can access passive props", function () {
                Var.meta.name = "hi";
                var x = Var.info.type;
                var a = Var.depends;
            });
        });
        describe("special write operations", function () {
            var oVar = ctor({ a: 1 });
            beforeEach(function () {
                oVar = ctor({ a: 1 });
            });
            it("mutate", function () {
                var cToken = oVar.changed.on(function (x) { return tally += "a"; });
                var original = oVar.value;
                oVar.mutate(function (o) { return o.a = 2; });
                expect(tally).toBe("a");
                expect(oVar.value.a).toBe(2);
                //mutate should change the reference:
                expect(oVar.value).not.toBe(original);
            });
            it("reduce", function () {
                oVar.reduce(function (_a) {
                    var a = _a.a;
                    return ({ a: a + 1 });
                });
                expect(oVar.value.a).toBe(2);
            });
        });
    });
};
describe("scalars", function () {
    describe("var", function () {
        baseTests(src_1.Rexes.var_);
    });
    describe("convert", function () {
        baseTests(function (x) { return src_1.Rexes.var_(x).convert_(function (x) { return x; }, function (x) { return x; }); });
        var link1 = src_1.Rexes.var_(1);
        var link2 = link1.convert_(function (x) { return x * 2; }, function (x) { return x / 2; });
        beforeEach(function () {
            link1 = src_1.Rexes.var_(1);
            link2 = link1.convert_(function (x) { return x * 2; }, function (x) { return x / 2; });
        });
        describe("consistency tests", function () {
            it("notifies change in link1", function () {
                link2.changed.on(function (x) {
                    tally += "a";
                });
                link1.value = 2;
                expect(link2.value).toBe(4);
                expect(tally).toBe("a");
            });
            it("sends change back to link1", function () {
                link1.changed.on(function (x) {
                    tally += "a";
                });
                link2.value = 4;
                expect(tally).toBe("a");
                expect(link1.value).toBe(2);
            });
            it("link2 invalid when link1 is closed", function () {
                link1.close();
                expect(function () { return link2.value; }).toThrow();
            });
            it("when link2 is closed, link1 works", function () {
                link2.close();
                link1.value = -1;
                expect(link1.value).toBe(-1);
                throwsClosed(function () { return link2.value; });
            });
            it("has dependency info", function () {
                expect(link2.depends.source).toBe(link1);
            });
            describe("3 links", function () {
                var link3 = link2.convert_(function (x) { return x * 2; }, function (x) { return x / 2; });
                beforeEach(function () {
                    link3 = link2.convert_(function (x) { return x * 2; }, function (x) { return x / 2; });
                });
                it("update propogates", function () {
                    link3.value = 8;
                    expect(link1.value).toBe(2);
                    expect(link2.value).toBe(4);
                    link2.value = 8;
                    expect(link3.value).toBe(16);
                    expect(link1.value).toBe(4);
                });
                it("closing link2 has the right effect", function () {
                    link2.close();
                    var a = link1.value;
                    expect(function () { return link3.value; }).toThrow();
                    link1.value = 5;
                    expect(link1.value).toBe(5);
                });
            });
        });
    });
    describe("member", function () {
        var memberTest = function (memberMaker) {
            baseTests(function (x) { return memberMaker(src_1.Rexes.var_({ a: x })); });
            var link1 = src_1.Rexes.var_({ a: 1 });
            var link2 = memberMaker(link1);
            beforeEach(function () {
                link1 = src_1.Rexes.var_({ a: 1 });
                link2 = memberMaker(link1);
            });
            describe("consistency tests", function () {
                it("change propagates forward", function () {
                    link2.changed.on(function (x) { return tally += x.value; });
                    link1.value = { a: 2 };
                    expect(tally).toBe("2");
                });
                it("change propagates back", function () {
                    link1.value = { a: 1, b: 2 };
                    link1.changed.on(function (x) { return tally += x.value.a; });
                    link2.value = 5;
                    expect(tally).toBe("5");
                    expect(link1.value.b).toBe(2);
                });
            });
        };
        memberTest(function (sc) { return sc.member_('a'); });
        memberTest(function (sc) { return sc.member_(function (x) { return x.a; }); });
    });
    describe("notify", function () {
        var notifier = new src_2.RexEvent();
        baseTests(function (x) { return src_1.Rexes.var_(x).notify_(function (x) { return notifier; }); });
        //this is the intended usage of the notify_ Rex:
        var notifierObject = function (val) {
            var _val = val;
            return {
                notifier: new src_2.RexEvent(),
                get val() {
                    return _val;
                },
                set val(newVal) {
                    _val = newVal;
                    this.notifier.fire(_val);
                }
            };
        };
        //note that notify_ doesn't make sense by itself, but it does when followed by member_.
        var link1 = src_1.Rexes.var_(notifierObject(0));
        var link2 = link1.notify_(function (obj) { return obj.value.notifier; });
        var link3 = link2.member_('val');
        beforeEach(function () {
            link1 = src_1.Rexes.var_(notifierObject(0));
            link2 = link1.notify_(function (obj) { return obj.value.notifier; });
            link3 = link2.member_('val');
        });
        describe("value propogation", function () {
            it("propagate back", function () {
                link3.value = 3;
                expect(link1.value.val).toBe(3);
            });
            it("propagate forward", function () {
                link1.value.val = 5;
                expect(link3.value).toBe(5);
            });
            it("set link1", function () {
                var origObject = link1.value;
                link1.value = notifierObject(2);
                expect(origObject.val).toBe(0);
                expect(link3.value).toBe(2);
                link3.value = 6;
                expect(link3.value).toBe(6);
                expect(link1.value.val).toBe(6);
                expect(origObject.val).toBe(0);
            });
        });
    });
    describe("silence", function () {
        //silence is tricky to test because it breaks the normal change propagation flow
        var link1 = src_1.Rexes.var_(0);
        var link2 = link1.silence_(function (change) { return change.value > 5; });
        beforeEach(function () {
            link1 = src_1.Rexes.var_(0);
            link2 = link1.silence_(function (change) { return change.value > 5; });
        });
        describe("change propagation", function () {
            it("raises/doesn't raise change correctly", function () {
                link2.changed.on(function (x) { return tally += x.value; });
                link1.value = 1;
                expect(tally).toBe("1");
                link1.value = 6;
                expect(tally).toBe("1");
            });
        });
    });
});
//# sourceMappingURL=scalars.spec.js.map