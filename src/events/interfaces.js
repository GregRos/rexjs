/**
 * Created by Greg on 01/10/2016.
 */
"use strict";
var DisposalToken = (function () {
    function DisposalToken(_close) {
        this._close = _close;
    }
    DisposalToken.prototype.close = function () {
        this._close();
    };
    return DisposalToken;
}());
exports.DisposalToken = DisposalToken;
var ARexEvent = (function () {
    function ARexEvent() {
    }
    return ARexEvent;
}());
exports.ARexEvent = ARexEvent;
//# sourceMappingURL=interfaces.js.map