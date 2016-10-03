"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var convert_1 = require("./convert");
var _ = require("lodash");
var names_1 = require('../names');
var RexRectify = (function (_super) {
    __extends(RexRectify, _super);
    function RexRectify(parent, rectifier) {
        var rectifyAsFrom = function (to) {
            var currentClone = _.cloneDeep(parent.value);
            rectifier.rectify(currentClone, to);
            return currentClone;
        };
        _super.call(this, parent, {
            to: rectifier.to,
            from: rectifyAsFrom
        });
        this.info.type = names_1.RexNames.Rectify;
    }
    return RexRectify;
}(convert_1.RexConvert));
exports.RexRectify = RexRectify;
//# sourceMappingURL=rectify.js.map