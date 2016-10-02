"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require("../index");
var DisposalTokenList = (function (_super) {
    __extends(DisposalTokenList, _super);
    function DisposalTokenList(list) {
        var _this = this;
        _super.call(this, function () {
            _this._disposalList.forEach(function (x) { return x.close(); });
        });
        this._disposalList = list;
    }
    DisposalTokenList.prototype.and = function () {
        var otherTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            otherTokens[_i - 0] = arguments[_i];
        }
        var newList = this._disposalList.slice(0);
        for (var _a = 0, otherTokens_1 = otherTokens; _a < otherTokens_1.length; _a++) {
            var tok = otherTokens_1[_a];
            if (tok instanceof DisposalTokenList) {
                newList.push.apply(newList, tok._disposalList);
            }
            else {
                newList.push(tok);
            }
        }
        return new DisposalTokenList(newList);
    };
    DisposalTokenList.prototype.close = function () {
        _super.prototype.close.call(this);
        this._disposalList = [];
    };
    return DisposalTokenList;
}(index_1.DisposalToken));
var DisposableTokenExtensions = {
    and: function () {
        var otherTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            otherTokens[_i - 0] = arguments[_i];
        }
        otherTokens.unshift(this);
        return new DisposalTokenList(otherTokens);
    }
};
Object.assign(index_1.DisposalToken.prototype, DisposableTokenExtensions);

//# sourceMappingURL=disposalToken.js.map
