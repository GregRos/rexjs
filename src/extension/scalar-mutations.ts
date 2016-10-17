/**
 * Created by Greg on 17/10/2016.
 */
import {RexScalar} from '../rexes/scalar/base';
import {ReflectHelper} from '../reflection';
import _ = require('lodash');

declare module '../rexes/scalar/base' {
	export interface RexScalar<T> {
		/**
		 * Clones the value and applies a mutation on the clone, then updates the Rex with it.
		 * @param mutation The mutation.
		 */
		mutate(mutation : (copy : T) => void) : void;

		/**
		 * Takes a function that updates the current value of the Rex to another value.
		 * @param reducer The reducer.
		 */
		reduce(reducer : (current : T) => T) : void;
	}
}

abstract class RexScalarMutations<T> extends RexScalar<T> {
	mutate(mutation : (copy : T) => void) : void {
		let copy = _.cloneDeep(this.value);
		mutation(copy);
		this.value = copy;
	}

	reduce( reducer : (current : T) => T) {
		this.value = reducer(this.value);
	}
}

ReflectHelper.mixin(RexScalar, RexScalarMutations);