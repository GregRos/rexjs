"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require("../");
var link_1 = require("./link");
/**
 * Created by Greg on 12/10/2016.
 */
var RexListen = (function (_super) {
    __extends(RexListen, _super);
    function RexListen(parent, callback) {
        _super.call(this, parent);
        this.info = {
            lazy: true,
            type: _1.RexNames.Listen,
            functional: false
        };
        this._token = this.changed.on(callback);
    }
    RexListen.prototype.close = function () {
        if (!this._token)
            return;
        this._token.close();
        _super.prototype.close.call(this);
    };
    return RexListen;
}(link_1.RexLink));
exports.RexListen = RexListen;
//# sourceMappingURL=listen.js.map