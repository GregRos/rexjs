/**
 * Created by Greg on 01/10/2016.
 */

export interface IDisposable {
	close() : void;
}

export class DisposalToken implements IDisposable {
	constructor(private _close : () => void) {

	}

	close() {
		this._close();
	}
}



export abstract class ARexEvent<T> {
	abstract on(handler : (arg : T) => void) : DisposalToken;
}

export interface IChangeInfo {

}