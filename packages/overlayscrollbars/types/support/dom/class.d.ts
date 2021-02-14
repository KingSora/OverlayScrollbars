/**
 * Check whether the given element has the given class name(s).
 * @param elm The element.
 * @param className The class name(s).
 */
export declare const hasClass: (elm: Element | null | undefined, className: string) => boolean;
/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 */
export declare const addClass: (elm: Element | null | undefined, className: string) => void;
/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export declare const removeClass: (elm: Element | null | undefined, className: string) => void;
/**
 * Takes two className strings, compares them and returns the difference as array.
 * @param classNameA ClassName A.
 * @param classNameB ClassName B.
 */
export declare const diffClass: (classNameA: string | null | undefined, classNameB: string | null | undefined) => string[];
