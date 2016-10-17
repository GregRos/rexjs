"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Greg on 17/10/2016.
 */
var base_1 = require('../rexes/scalar/base');
var reflection_1 = require('../reflection');
var _ = require('lodash');
var RexScalarMutations = (function (_super) {
    __extends(RexScalarMutations, _super);
    function RexScalarMutations() {
        _super.apply(this, arguments);
    }
    RexScalarMutations.prototype.mutate = function (mutation) {
        var copy = _.cloneDeep(this.value);
        mutation(copy);
        this.value = copy;
    };
    RexScalarMutations.prototype.reduce = function (reducer) {
        this.value = reducer(this.value);
    };
    return RexScalarMutations;
}(base_1.RexScalar));
reflection_1.ReflectHelper.mixin(base_1.RexScalar, RexScalarMutations);
//# sourceMappingURL=scalar-mutations.js.map