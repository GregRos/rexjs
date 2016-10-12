import { RexScalar } from "./index";
import { RexRectify } from "./rectify";
/**
 * Created by Greg on 03/10/2016.
 */
export declare class RexMember<T> extends RexRectify<Object, T> {
    private memberName;
    constructor(parent: RexScalar<Object>, memberName: string);
}
