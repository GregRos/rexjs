import { Subscription } from './subscription';
export declare class RexEvent<TParam> {
    private _name;
    private _invocList;
    /**
     * Constructs a new instance of the @RexEvent.
     * @constructor
     * @param _name A human-readable name for the event. Optional.
     */
    constructor(_name?: string);
    /**
     * Returns the human-readable name for the event.
     * @returns {string}
     */
    readonly name: string;
    /**
     * Attaches a handler to this event or subscribes to it. When the event will fire it will also fire the handler.
     * If the handler is a function, it's called, and if it's an event, it's fired.
     * @param handler The handler, which can be another event or a function.
     * @param strong Whether the handler is registered as a weak or strong handler.
     * @returns {Subscription} A token that supports a close() method, upon which this subscription is cancelled.
     */
    on<S extends TParam>(handler: ((arg: S) => void) | RexEvent<S>): Subscription;
    /**
     * Fires the event. This method's visibility is not restricted, but it should be used carefully.
     * @param arg The argument with which the event is raised.
     */
    fire(arg: TParam): void;
    /**
     * Clears the event's subscription list. Use this method carefully.
     */
    clear(): void;
    toString(): string;
}
