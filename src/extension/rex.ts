import {RexVar} from "../rexes/scalar/var";
import {Rex} from "../rexes/base";
import {RexScalar} from "../rexes/scalar/index";
/**
 * Created by Greg on 02/10/2016.
 */


export module Rexs {
	export function var_<T>(initial : T) {
		return new RexVar<T>(initial);
	}

	export function const_<T>(initial : T) {
		return new RexVar<T>(initial, true, false);
	}
}

export module Rexflect {
	export function isRex(x : any) : x is Rex<any> {
		return x instanceof Rex;
	}

	export function isScalar(x : any) : x is RexScalar<any> {
		return x instanceof RexScalar;
	}

}
