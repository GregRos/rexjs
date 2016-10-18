import { Rex } from "../base";
import { ScalarBinding, BindingAttributes } from '../../binding';
/**
 * Created by Greg on 17/10/2016.
 */
export interface ScalarChange<T> {
    value: T;
}
export declare abstract class RexScalar<T> extends Rex<ScalarChange<T>> {
    abstract value: T;
    private _binding;
    protected notifyChange(): void;
    binding: ScalarBinding<T>;
    private _resetBinding();
    toBinding(attrs: BindingAttributes): ScalarBinding<T>;
    toString(): string;
}
