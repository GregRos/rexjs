/**
 * Created by Greg on 01/10/2016.
 */
export declare class ClosedError extends Error {
    name: string;
    constructor(name?: string);
}
export declare class AccessError extends Error {
    name: string;
    constructor(name?: string, access?: string);
}
export declare module Errors {
    function closed(name: string): ClosedError;
    function cannotWrite(name: string): AccessError;
    function cannotRead(name: string): AccessError;
}
