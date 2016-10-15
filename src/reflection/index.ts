/**
 * Created by Greg on 14/10/2016.
 */
import _ = require('lodash');
export module ReflectHelper {
	const memberAccessRegex = /\.([^.;]+);?\s*}?$/;
	export function getMemberName(memberAccessFunction : Function) : string {
		if (!_.isFunction(memberAccessFunction)) {
			throw new TypeError("Argument was not a function!");
		}
		let strMemberAccess = memberAccessFunction.toString();
		let result = memberAccessRegex.exec(strMemberAccess);
		if (!result) {
			throw new Error(`The function was not a simple member access function!`)
		}
		return result[1];
	}

	export function mixin(targetCtor : any, ...baseCtors : any[]) {
		baseCtors.forEach(x => {
			Object.getOwnPropertyNames(x.prototype).forEach(name => {
				if (name === "constructor") return;
				targetCtor.prototype[name] = x.prototype[name];
			});
		});
	}
}