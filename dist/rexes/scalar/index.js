"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("../base");
var RexScalar = (function (_super) {
    __extends(RexScalar, _super);
    function RexScalar() {
        _super.apply(this, arguments);
    }
    RexScalar.prototype.notifyChange = function () {
        var self = this;
        this.changed.fire({
            get value() {
                return self.value;
            }
        });
    };
    RexScalar.prototype.toString = function () {
        return "[RexScalar " + this.info.type + " " + this.value + "]";
    };
    return RexScalar;
}(base_1.Rex));
exports.RexScalar = RexScalar;
var convert_1 = require('./convert');
exports.RexConvert = convert_1.RexConvert;
var var_1 = require('./var');
exports.RexVar = var_1.RexVar;

//# sourceMappingURL=index.js.map
