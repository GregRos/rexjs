import {Subscription} from "../events/subscription";
import {RexScalar, ScalarChange} from "../rexes/scalar/index";
import {ReflectHelper} from '../reflection';
import {Errors} from '../errors';
import {readonly} from 'core-decorators';
import {Rex} from "../rexes/base";
import {BindingAttributes} from "./index";
import {assert} from "chai";


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
	 * Whether the binding has been disposed.
	 * @type {boolean}
	 * @readonly
	 */
	get isClosed() {
		return !this.origin;
	}
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

	constructor(origin: TRex, attrs : BindingAttributes) {
		this.origin = origin;
	}

	/**
	 * Returns true if the binding has been initialized, i.e. if it has been assigned a target.
	 * @returns {boolean}
	 */
	get isInitialized() {
		return !!this.target;
	}

	protected _initialize(target: TRex) : void {
		assert.isOk(target);
		assert.isNotOk(this._targetToken);
		assert.isNotOk(this._originToken);

		let {origin, isInitialized} = this;
		if (isInitialized) {
			throw Errors.alreadyBound();
		}
		this._onChange(null, origin);
		//force-assign to this fake readonly property
		(this as any).target = target;

		this._targetToken = target.changed.on(data => this._onChange(data, target));
		this._originToken = origin.changed.on(data => this._onChange(data, origin));
	}

	private _onChange(data: TChange, notifier: TRex) : void {
		let {origin, target, isInitialized, _targetToken, _originToken} = this;
		if (!isInitialized) {
			return;
		}
		[_targetToken, _originToken].forEach(x => x.freeze());
		try {
			this._rectify(notifier === origin ? "origin" : "target", data);
		}
		finally {
			[_targetToken, _originToken].forEach(x => x.unfreeze());
		}
	}

	protected abstract _rectify(source : ChangeSource, data : TChange);

	close() {

		let {_targetToken, _originToken, target, isClosed}= this;
		if (isClosed) {
			return;
		}
		assert.isTrue(_originToken);
		_originToken.close();
		_targetToken && _targetToken.close();
	}
}