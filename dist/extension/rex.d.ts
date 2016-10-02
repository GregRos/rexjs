import { RexVar } from "../rexes/scalar/var";
/**
 * Created by Greg on 02/10/2016.
 */
export declare module Rexs {
    function var_<T>(initial: T): RexVar<T>;
    function const_<T>(initial: T): RexVar<T>;
}
