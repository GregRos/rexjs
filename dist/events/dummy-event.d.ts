import { RexEvent } from "./rex-event";
import { Subscription } from "./subscription";
/**
 * Created by Greg on 13/10/2016.
 */
/**
 * An empty implementation of a RexEvent. Can be used when a non-functional event is required.
 */
export declare class DummyEvent<TParam> extends RexEvent<TParam> {
    constructor(name: string);
    on<S extends TParam>(handler: ((arg: S) => void) | RexEvent<S>): Subscription;
    fire(arg: TParam): void;
    toString(): string;
}
