"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var convert_1 = require("./convert");
var names_1 = require('../names');
/**
 * Created by Greg on 03/10/2016.
 */
var RexLink = (function (_super) {
    __extends(RexLink, _super);
    function RexLink(parent) {
        _super.call(this, parent, {
            from: function (x) { return x; },
            to: function (x) { return x; }
        });
        this.info = {
            type: names_1.RexNames.Link,
            lazy: true,
            functional: false
        };
    }
    return RexLink;
}(convert_1.RexConvert));
exports.RexLink = RexLink;
//# sourceMappingURL=link.js.map