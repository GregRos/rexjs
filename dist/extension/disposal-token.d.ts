/**
 * Created by Greg on 02/10/2016.
 */
declare module '../events/interfaces' {
    interface DisposalToken {
        and(...otherTokens: IDisposable[]): any;
    }
}
export {};
