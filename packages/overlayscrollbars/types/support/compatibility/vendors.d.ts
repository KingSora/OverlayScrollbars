export declare const cssPrefixes: ReadonlyArray<string>;
export declare const jsPrefixes: ReadonlyArray<string>;
export declare const jsCache: {
    [key: string]: any;
};
export declare const cssCache: {
    [key: string]: string;
};
export declare const cssProperty: (name: string) => string | undefined;
export declare const cssPropertyValue: (property: string, values: string, suffix?: string | undefined) => string | undefined;
export declare const jsAPI: <T = any>(name: string) => T | undefined;
