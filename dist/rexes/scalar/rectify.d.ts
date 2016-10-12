import { RexConvert } from "./convert";
import { RexScalar } from "./index";
/**
 * Created by Greg on 03/10/2016.
 */
export interface Rectifier<TFrom, TTo> {
    to?: (from: TFrom) => TTo;
    rectify?: (current: TFrom, input: TTo) => void;
}
export declare class RexRectify<TFrom, TTo> extends RexConvert<TFrom, TTo> {
    constructor(parent: RexScalar<TFrom>, rectifier: Rectifier<TFrom, TTo>);
}
