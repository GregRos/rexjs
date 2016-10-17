declare module '../rexes/scalar/base' {
    interface RexScalar<T> {
        /**
         * Clones the value and applies a mutation on the clone, then updates the Rex with it.
         * @param mutation The mutation.
         */
        mutate(mutation: (copy: T) => void): void;
        /**
         * Takes a function that updates the current value of the Rex to another value.
         * @param reducer The reducer.
         */
        reduce(reducer: (current: T) => T): void;
    }
}
export {};
