import { RexConvert } from "./convert";
import { RexScalar } from "./index";
import { IRexInfo } from "../base";
/**
 * Created by Greg on 03/10/2016.
 */
export declare class RexLink<T> extends RexConvert<T, T> {
    info: IRexInfo;
    constructor(parent: RexScalar<T>);
}
