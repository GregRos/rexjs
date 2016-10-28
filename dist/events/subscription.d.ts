/**
 * Interface for abstracting over disposal tokens.
 */
export interface ISubscription {
    /**
     * Called when the subscription is closed. Will not be called on a closed subscription.
     */
    close(): void;
    /**
     * Called to freeze the subscription. While a subscription is frozen, the behavior is activates is disabled.
     * If called on a frozen subscription, should do nothing.
     */
    freeze(): void;
    /**
     * Called to unfreeze the subscription.
     * If called on an unfrozen subscription, should do nothing.
     */
    unfreeze(): void;
}
/**
 * A special token that represents a subscription to a RexEvent and allows certain operations to be performed on the subscription.
 */
export declare class Subscription implements ISubscription {
    private _members;
    /**
     * Constructs a new subscription token.
     * @param members The actions this Subscription supports or just the Close action.
     */
    constructor(members: ISubscription | (() => void));
    /**
     * Combines this subscription token with others to create a single token that controls them all.
     * @param otherTokens The other tokens.
     * @returns {Subscription} A multi-subscription token.
     */
    and(...otherTokens: ISubscription[]): Subscription;
    /**
     * Freezes this subscription, executes the action, and unfreezes it.
     * @param action An action to do while the subscription is frozen.
     */
    freezeWhile(action: () => void): void;
    static all(tokens: ISubscription[]): MultiSubscription;
    /**
     * Freezes this subscription until it is unfrozen or closed. Does nothing if the subscription is frozen or closed.
     */
    freeze(): void;
    /**
     * Unfreezes the subscription if it's frozen. Does nothing if the subscription is not frozen or has been closed.
     */
    unfreeze(): void;
    /**
     * Closes the subscription managed by this token. If called on a closed subscription, does nothing.
     */
    close(): void;
    /**
     * Whether this subscription has been closed.
     * @returns {boolean}
     */
    readonly isClosed: boolean;
}
export declare class MultiSubscription extends Subscription {
    private _disposalList;
    constructor(list: ISubscription[]);
    close(): void;
}
