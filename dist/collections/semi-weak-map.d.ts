export declare class SemiWeakMap<T> {
    private _keys;
    private _weakMap;
    constructor();
    set(key: Object, value: T): void;
    clear(): void;
    remove(key: Object): void;
    get(key: Object): T;
    forEach(f: (obj: T) => void): void;
}
