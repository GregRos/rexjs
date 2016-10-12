"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rectify_1 = require("./rectify");
var names_1 = require('../names');
/**
 * Created by Greg on 03/10/2016.
 */
var RexMember = (function (_super) {
    __extends(RexMember, _super);
    function RexMember(parent, memberName) {
        _super.call(this, parent, {
            to: function (from) { return from[memberName]; },
            rectify: function (current, input) { return current[memberName] = input; }
        });
        this.memberName = memberName;
        this.info.type = names_1.RexNames.Member;
    }
    return RexMember;
}(rectify_1.RexRectify));
exports.RexMember = RexMember;

//# sourceMappingURL=member.js.map
