/**
 * Interface for abstracting over disposal tokens.
 */
export interface ISubscription {
    close(): void;
    freeze: () => void;
    unfreeze: () => void;
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
     * @param action
     */
    freezeWhile(action: () => void): void;
    static all(tokens: ISubscription[]): MultiSubscription;
    /**
     * Freezes this subscription until it is unfrozen or closed.
     */
    freeze(): void;
    /**
     * Unfreezes the subscription if it's frozen.
     */
    unfreeze(): void;
    /**
     * Performs the cleanup specified for the token. Multiple calls to this method do nothing.
     */
    close(): void;
}
export declare class MultiSubscription extends Subscription {
    private _disposalList;
    constructor(list: ISubscription[]);
    close(): void;
}
