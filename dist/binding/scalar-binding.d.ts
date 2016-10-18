import { BaseBinding, ChangeSource } from "./base-binding";
import { ScalarChange, RexScalar } from "../rexes/scalar/index";
/**
 * Created by Greg on 16/10/2016.
 */
export declare class ScalarBinding<T> extends BaseBinding<ScalarChange<T>, RexScalar<T>> {
    protected _rectify(source: ChangeSource, data: ScalarChange<T>): void;
    private _justClose();
    /**
     * Disposes of this binding, also resetting the `binding` property of its target to null.
     */
    close(): void;
}
