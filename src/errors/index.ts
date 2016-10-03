/**
 * Created by Greg on 01/10/2016.
 */
export class ClosedError extends Error {
	name = "ClosedError";
	constructor(name : string = "") {
		super(`The operation failed because the object '${name}' was closed.`);
	}
}

export class AccessError extends Error {
	name = "AccessError";
	constructor(name : string = "", access : string = "unknown") {
		super(`The operation failed because the object '${name}' does not support access of type '${access}'.`)
	}
}

export module Errors {
	export function closed(name : string) {
		return new ClosedError(name);
	}

	export function cannotWrite(name : string) {
		return new AccessError(name, "write");
	}

	export function cannotRead(name : string) {
		return new AccessError(name, "read");
	}
}

