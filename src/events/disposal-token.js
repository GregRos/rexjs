/**
 * Created by Greg on 03/10/2016.
 */
/**
 * Created by Greg on 01/10/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
/**
 * A special token used for performing deterministic cleanup. Part of rexjs infrastructure.
 */
var DisposalToken = (function () {
    /**
     * Constructs a new `DisposalToken`.
     * @param _close The action to perform when the token is closed. This function will only be called once.
     */
    function DisposalToken(_close) {
        this._close = _close;
    }
    DisposalToken.prototype.and = function () {
        var otherTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            otherTokens[_i - 0] = arguments[_i];
        }
        return DisposalToken.all([this].concat(otherTokens));
    };
    DisposalToken.all = function (tokens) {
        var arr = tokens.map(function (x) { return x instanceof DisposalTokenList ? x._disposalList : [x]; });
        var flat = _.flatten(arr);
        return new DisposalTokenList(flat);
    };
    /**
     * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
     */
    DisposalToken.prototype.close = function () {
        if (this._close) {
            this._close();
            this._close = null;
        }
    };
    return DisposalToken;
}());
exports.DisposalToken = DisposalToken;
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
}(DisposalToken));
//# sourceMappingURL=disposal-token.js.map