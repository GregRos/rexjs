"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Greg on 01/10/2016.
 */
var ClosedError = (function (_super) {
    __extends(ClosedError, _super);
    function ClosedError(name) {
        if (name === void 0) { name = ""; }
        _super.call(this, "The operation failed because the object '" + name + "' was closed.");
        this.name = "ClosedError";
    }
    return ClosedError;
}(Error));
exports.ClosedError = ClosedError;
var AccessError = (function (_super) {
    __extends(AccessError, _super);
    function AccessError(name, access) {
        if (name === void 0) { name = ""; }
        if (access === void 0) { access = "unknown"; }
        _super.call(this, "The operation failed because the object '" + name + "' does not support access of type '" + access + "'.");
        this.name = "AccessError";
    }
    return AccessError;
}(Error));
exports.AccessError = AccessError;
var Errors;
(function (Errors) {
    function closed(name) {
        return new ClosedError(name);
    }
    Errors.closed = closed;
    function cannotWrite(name) {
        return new AccessError(name, "write");
    }
    Errors.cannotWrite = cannotWrite;
    function cannotRead(name) {
        return new AccessError(name, "read");
    }
    Errors.cannotRead = cannotRead;
})(Errors = exports.Errors || (exports.Errors = {}));
//# sourceMappingURL=index.js.map