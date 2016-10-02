import { Conversion } from "../rexes/scalar/convert";
declare module '../rexes/scalar' {
    interface RexScalar<T> {
        convert<TTo>(conversion: Conversion<T, TTo>): RexScalar<TTo>;
        convert<TTo>(to?: (from: T) => TTo, from?: (to: TTo) => T): RexScalar<TTo>;
        rectify<TTo>(to?: (from: T) => TTo, rectify?: (to: TTo, from: T) => void): RexScalar<TTo>;
        member<TTo>(name: string): RexScalar<TTo>;
        mutate(mutation: (copy: T) => void): void;
        reduce(reducer: (current: T) => T): void;
    }
}
