"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require("../index");
var _ = require("lodash");
var DisposalTokenList = (function (_super) {
    __extends(DisposalTokenList, _super);
    function DisposalTokenList(list) {
        var _this = this;
        _super.call(this, function () {
            _this._disposalList.forEach(function (x) { return x.close(); });
        });
        this._disposalList = list;
    }
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
        var arr = [this].concat(otherTokens).map(function (x) { return x instanceof DisposalTokenList ? x._disposalList : [x]; });
        var flat = _.flatten(arr);
        return new DisposalTokenList(flat);
    }
};
Object.assign(index_1.DisposalToken.prototype, DisposableTokenExtensions);

//# sourceMappingURL=disposalToken.js.map
