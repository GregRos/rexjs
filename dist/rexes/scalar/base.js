"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("../base");
var binding_1 = require('../../binding');
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
    Object.defineProperty(RexScalar.prototype, "binding", {
        get: function () {
            return this._binding;
        },
        set: function (binding) {
            var _binding = this._binding;
            if (_binding === binding) {
                //handle self-assignment gracefully :)
                return;
            }
            if (_binding) {
                _binding._justClose();
            }
            this._resetBinding();
            if (binding) {
                binding._initialize(this);
                this._binding = binding;
            }
        },
        enumerable: true,
        configurable: true
    });
    RexScalar.prototype._resetBinding = function () {
        this._binding = null;
    };
    RexScalar.prototype.toBinding = function (attrs) {
        return new binding_1.ScalarBinding(this, attrs);
    };
    RexScalar.prototype.toString = function () {
        return "[RexScalar " + this.info.type + " " + this.value + "]";
    };
    return RexScalar;
}(base_1.Rex));
exports.RexScalar = RexScalar;

//# sourceMappingURL=base.js.map
