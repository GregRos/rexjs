"use strict";
/**
 * Created by Greg on 02/10/2016.
 */
var src_1 = require('../src');
var index_1 = require("../src/errors/index");
var throwsClosed = function (f) {
    expect(f).toThrowError(index_1.ClosedError);
};
var baseTests = function (ctor) {
    describe("basic tests", function () {
        var tally = "";
        var Var = ctor(0);
        beforeEach(function () {
            tally = "";
            Var = ctor(0);
        });
        it("isn't closed", function () { return expect(Var.isClosed).toBe(false); });
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
        it("notifies close", function () {
            Var.closing.on(function (x) { return tally += "closing"; });
            Var.close();
            expect(tally).toBe("closing");
        });
        describe("operations on closed", function () {
            beforeEach(function () { return Var.close(); });
            it("is closed", function () {
                return expect(Var.isClosed).toBe(true);
            });
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
        baseTests(src_1.Rexs.var_);
    });
    describe("convert", function () {
        baseTests(function (x) { return src_1.Rexs.var_(x).convert(function (x) { return x; }, function (x) { return x; }); });
        var link1 = src_1.Rexs.var_(1);
        var link2 = link1.convert(function (x) { return x * 2; }, function (x) { return x / 2; });
        var tally = "";
        beforeEach(function () {
            link1 = src_1.Rexs.var_(1);
            link2 = link1.convert(function (x) { return x * 2; }, function (x) { return x / 2; });
            tally = "";
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
            it("closes when link1 is closed", function () {
                link2.closing.on(function () { return tally += "a"; });
                link1.close();
                expect(link2.isClosed).toBe(true);
                expect(tally).toBe("a");
            });
            it("when link2 is closed, link1 works", function () {
                link2.close();
                expect(link1.isClosed).toBe(false);
                link1.value = -1;
                expect(link1.value).toBe(-1);
                throwsClosed(function () { return link2.value; });
            });
            it("has dependency info", function () {
                expect(link2.depends.source).toBe(link1);
            });
            describe("3 links", function () {
                var link3 = link2.convert(function (x) { return x * 2; }, function (x) { return x / 2; });
                beforeEach(function () {
                    link3 = link2.convert(function (x) { return x * 2; }, function (x) { return x / 2; });
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
                    expect(link1.isClosed).toBe(false);
                    expect(link3.isClosed).toBe(true);
                });
            });
        });
    });
});
//# sourceMappingURL=scalars.spec.js.map