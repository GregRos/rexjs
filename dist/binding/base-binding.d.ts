import { Rex } from "../rexes/base";
/**
 * Created by Greg on 16/10/2016.
 */
export declare type BindPriority = "origin" | "target";
export declare type ChangeSource = "origin" | "target";
export declare abstract class BaseBinding<TChange, TRex extends Rex<TChange>> {
    /**
     * Subscription to the origin's notifier.
     * @private
     */
    private _originToken;
    /**
     * Subscription to the target's notifier.
     * @private
     */
    private _targetToken;
    /**
     * Whether the binding is currently updating itself. Used to avoid infinite recursion.
     * @type {boolean}
     * @private
     */
    private _isUpdating;
    /**
     * Whether the binding has been disposed.
     * @type {boolean}
     * @readonly
     */
    readonly isClosed: boolean;
    /**
     * Whether the binding prioritizes the source or the origin.
     * @readonly
     */
    readonly priority: BindPriority;
    /**
     * The origin of the binding.
     * @readonly
     */
    readonly origin: TRex;
    /**
     * The target of the binding.
     * @readonly
     */
    readonly target: TRex;
    constructor(origin: TRex, priority: BindPriority);
    /**
     * Returns true if the binding has been initialized, i.e. if it has been assigned a target.
     * @returns {boolean}
     */
    readonly isInitialized: boolean;
    protected _initialize(target: TRex): void;
    private _onChange(data, notifier);
    protected abstract _rectify(source: ChangeSource, data: TChange): any;
    close(): void;
}
