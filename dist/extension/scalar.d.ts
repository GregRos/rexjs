import { Conversion } from "../rexes/scalar/convert";
import { RexEvent } from "../events/rex-event";
import { Rectifier } from "../rexes/scalar/rectify";
/**
 * This file contains "extension methods" for RexScalar objects.
 */
declare module '../rexes/scalar' {
    interface RexScalar<T> {
        /**
         * Applies a forward and back conversion to this Rex, returning a Convert rex.
         * @param conversion The conversion object.
         */
        convert_<TTo>(conversion: Conversion<T, TTo>): RexScalar<TTo>;
        /**
         * Applies a forward and back conversion to this Rex, returning a Convert rex.
         * @param to The function used to convert outwards. If falsy/omitted, the Rex will not support reading.
         * @param from The function used to convert inwards. If falsy/omitted, the Rex will not support writing.
         */
        convert_<TTo>(to?: (from: T) => TTo, from?: (to: TTo) => T): RexScalar<TTo>;
        /**
         * Applies an assymetric conversion:
         * Forward conversion will use the {to} function.
         * Back conversion will use the {rectifier} function. Here, the {current} parameter is a clone of the current value of this Rex and the {to} parameter is the coerced value. Mutate the {current} parameter to rectify the two values.
         * @param to The forward conversion function.
         * @param rectifier The backward mutation function.
         */
        rectify_<TTo>(to?: (from: T) => TTo, rectifier?: (current: T, to: TTo) => void): RexScalar<TTo>;
        rectify_<TTo>(rectifier: Rectifier<T, TTo>): any;
        /**
         * Gets the member of the specified name from the Rex.
         * In the back conversion, the current value is cloned and the clone's member is set. Then this rex is updated with the new object.
         * @param name The name of the member to get.
         */
        member_<TTo>(name: string): RexScalar<TTo>;
        member_<TTo>(accessFunction: (v: T) => TTo): RexScalar<TTo>;
        /**
         * Applies a Silencer Rex that suppresses change notifications that match a certain criterion.
         * This does not change the value of the Rex.
         * @param silencer
         */
        silence_(silencer?: (change: ScalarChange<T>) => boolean): RexScalar<T>;
        /**
         * Applies a linking Rex that mirrors this Rex.
         * Used to manage event subscriptions.
         */
        link_(): RexScalar<T>;
        /**
         * Creates a Rex that monitors an external event for change notification.
         * @param eventGetter A function that, given a change notification, constructs an event that can be used to listen for hidden changes.
         */
        notify_(eventGetter: (change: ScalarChange<T>) => RexEvent<any>): RexScalar<T>;
        /**
         * Creates a Rex that monitors an external event for change notification.
         * @param event An event that, when fired, means a change in the Rex may have occurred.
         */
        notify_(event: RexEvent<void>): RexScalar<T>;
        /**
         * Attaches an array of listeners to the Rex and returns it.
         * @param listeners The listeners to attach.
         */
        listen_(...listeners: ((change: ScalarChange<T>) => void)[]): any;
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
