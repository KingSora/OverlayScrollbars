export declare const cssPrefixes: ReadonlyArray<string>;
export declare const jsPrefixes: ReadonlyArray<string>;
export declare const jsCache: {
    [key: string]: any;
};
export declare const cssCache: {
    [key: string]: string;
};
/**
 * Gets the name of the given CSS property with vendor prefix if it isn't supported without it, or and empty string if unsupported.
 * @param name The name of the CSS property which shall be get.
 */
export declare const cssProperty: (name: string) => string;
/**
 * Get the name of the given CSS property value(s), with vendor prefix if it isn't supported without it, or an empty string if no value is supported.
 * @param property The CSS property to which the CSS property value(s) belong.
 * @param values The value(s) separated by spaces which shall be get.
 * @param suffix A suffix which is added to each value in case the value is a function or something else more advanced.
 */
export declare const cssPropertyValue: (property: string, values: string, suffix?: string | undefined) => string;
/**
 * Get the requested JS function, object or constructor with vendor prefix if it isn't supported without or undefined if unsupported.
 * @param name The name of the JS function, object or constructor.
 */
export declare const jsAPI: <T = any>(name: string) => T | undefined;
