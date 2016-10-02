/**
 * Created by Greg on 01/10/2016.
 */
"use strict";
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

//# sourceMappingURL=interfaces.js.map
