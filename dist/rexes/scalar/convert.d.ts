import { RexScalar } from "./";
import { IRexInfo } from "../base";
/**
 * Created by Greg on 01/10/2016.
 */
export interface Conversion<TFrom, TTo> {
    from?: (to: TTo) => TFrom;
    to?: (to: TFrom) => TTo;
}
export declare class RexConvert<TFrom, TTo> extends RexScalar<TTo> {
    private parent;
    private conversion;
    private _last;
    private _parentSub;
    info: IRexInfo;
    constructor(parent: RexScalar<TFrom>, conversion: Conversion<TFrom, TTo>);
    value: TTo;
    close(): void;
}
