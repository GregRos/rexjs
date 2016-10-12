import { RexScalar, IRexInfo } from '../';
/**
 * Created by Greg on 12/10/2016.
 */
export declare class RexComputed<T> extends RexScalar<T> {
    protected onRead: () => T;
    protected onWrite: (input: T) => void;
    info: IRexInfo;
    constructor(onRead: () => T, onWrite?: (input: T) => void);
    value: T;
}
