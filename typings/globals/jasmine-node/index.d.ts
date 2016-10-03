// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/c38064c1864c5c4b92c073ada511cf23b348582b/jasmine-node/jasmine-node.d.ts
declare function it(expectation:string, assertion:(done:(err?:any) => void) => void, timeout?:number):void;

declare namespace jasmine {
	interface Env {
		defaultTimeoutInterval: number;
	}
}

declare module "jasmine-node" {
    interface ExecuteSpecsOptions {
        specFolders: string[],
        onComplete?: (runner:jasmine.Runner) => void,
        isVerbose?: boolean,
        showColors?: boolean,
        teamcity?: string | boolean,
        useRequireJs?: boolean,
        regExpSpec: RegExp,
        junitreport?: {
            report: boolean,
            savePath: string,
            useDotNotation: boolean,
            consolidate: boolean
        },
        includeStackTrace?: boolean,
        growl?: boolean
    }

    interface JasmineNode {
        executeSpecsInFolder(options:ExecuteSpecsOptions): void;
        loadHelpersInFolder(path:string, pattern:RegExp): void;
    }

    var jasmine:JasmineNode;

    export = jasmine;
}