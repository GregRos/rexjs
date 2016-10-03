"use strict";
/**
 * Created by Greg on 02/10/2016.
 */
var src_1 = require("../src");
describe("disposal token", function () {
    var tally = "";
    var nTally = 0;
    beforeEach(function () {
        tally = "";
        nTally = 0;
    });
    it("disposes", function () {
        var token = new src_1.Subscription(function () { return tally += "a"; });
        token.close();
        expect(tally).toBe("a");
    });
    it("disposes twice, 2nd time is harmless", function () {
        var token = new src_1.Subscription(function () { return tally += "a"; });
        token.close();
        token.close();
        expect(tally).toBe("a");
    });
    it("merges", function () {
        var tokens = [];
        var _loop_1 = function(i) {
            tokens.push(new src_1.Subscription(function () { return tally += i; }));
        };
        for (var i = 0; i < 10; i++) {
            _loop_1(i);
        }
        var fst = tokens[0], toks = tokens.slice(1);
        var total = fst.and.apply(fst, toks);
        total.close();
        expect(tally).toBe("0123456789");
    });
    it("mutli-merges", function () {
        var tokens1 = [];
        var _loop_2 = function(i) {
            tokens1.push(new src_1.Subscription(function () { return tally += i; }));
        };
        for (var i = 0; i < 10; i++) {
            _loop_2(i);
        }
        var tokens2 = [];
        var _loop_3 = function(i) {
            tokens2.push(new src_1.Subscription(function () { return tally += i; }));
        };
        for (var i = 0; i < 10; i++) {
            _loop_3(i);
        }
        var fst1 = tokens1[0], rest1 = tokens1.slice(1);
        var fst2 = tokens2[0], rest2 = tokens2.slice(1);
        var group1 = fst1.and.apply(fst1, rest1);
        var group2 = fst2.and.apply(fst2, rest2);
        var all = group1.and(group2);
        //check the merge was performed correctly...
        var privateList = all._disposalList;
        expect(privateList.length).toBe(20);
        all.close();
        expect(tally).toBe("01234567890123456789");
    });
});
//# sourceMappingURL=disposal.spec.js.map