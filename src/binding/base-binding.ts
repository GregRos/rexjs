import {Subscription} from "../events/subscription";
import {RexScalar, ScalarChange} from "../rexes/scalar/index";
import {ReflectHelper} from '../reflection';
import {Errors} from '../errors';
import {readonly} from 'core-decorators';
import {Rex} from "../rexes/base";
/**
 * Created by Greg on 16/10/2016.
 */


export type BindPriority = "origin" | "target";
export type ChangeSource = "origin" | "target";
export abstract class BaseBinding<TChange, TRex extends Rex<TChange>> {

	/**
	 * Subscription to the origin's notifier.
	 * @private
	 */
	private _originToken: Subscription;
	/**
	 * Subscription to the target's notifier.
	 * @private
	 */
	private _targetToken: Subscription;
	/**
	 * Whether the binding is currently updating itself. Used to avoid infinite recursion.
	 * @type {boolean}
	 * @private
	 */
	private _isUpdating = false;

	/**
	 * Whether the binding has been disposed.
	 * @type {boolean}
	 * @readonly
	 */
	readonly isClosed = false;

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

	constructor(origin: TRex, priority: BindPriority) {
		this.origin = origin;
		this.priority = priority;
	}

	/**
	 * Returns true if the binding has been initialized, i.e. if it has been assigned a target.
	 * @returns {boolean}
	 */
	get isInitialized() {
		return !!this.target;
	}

	protected _initialize(target: TRex) : void {
		let {priority, origin, isInitialized} = this;
		if (isInitialized) {
			throw Errors.alreadyBound();
		}
		if (priority === "target") {
			this._onChange(null, target);
		} else if (priority === "origin") {
			this._onChange(null, origin)
		}
		//force-assign to this fake readonly property
		(this as any).target = target;

		this._targetToken = target.changed.on(data => this._onChange(data, target));
		this._originToken = origin.changed.on(data => this._onChange(data, origin));
	}

	private _onChange(data: TChange, notifier: TRex) {
		let {_isUpdating, origin, target, isInitialized, priority} = this;
		if (!isInitialized) {
			return;
		}
		if (_isUpdating) {
			return;
		}
		this._isUpdating = true;
		this._rectify(notifier === origin ? "origin" : "target", data);
		this._isUpdating = false;
	}

	protected abstract _rectify(source : ChangeSource, data : TChange);

	close() {
		let {_targetToken, _originToken}= this;
		_originToken.close();
		_targetToken.close();
		(this as any).isClosed = true;
	}
}