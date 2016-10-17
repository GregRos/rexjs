import { Rex } from "../base";
import { ScalarBinding } from '../../binding';
import { BindPriority } from "../../binding/base-binding";
/**
 * Created by Greg on 17/10/2016.
 */
export interface ScalarChange<T> {
    value: T;
}
export declare abstract class RexScalar<T> extends Rex<ScalarChange<T>> {
    value: T;
    _binding: ScalarBinding<T>;
    protected notifyChange(): void;
    binding: ScalarBinding<T>;
    toBinding(priority?: BindPriority): ScalarBinding<T>;
    toString(): string;
}
