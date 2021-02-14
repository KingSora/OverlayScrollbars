export declare type PlainObject<T = any> = {
    [name: string]: T;
};
export declare type InternalVersionOf<T> = {
    [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
};
export declare type OSTargetElement = HTMLElement | HTMLTextAreaElement;
/**
 * Object for special initialization.
 *
 * Target is always required, if element is not provided or undefined it will be generated.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * If element is null it won't be generated, and the responsibilities (feautes) of this element are lost.
 */
export interface OSTargetObject {
    target: OSTargetElement;
    host?: HTMLElement;
    padding?: HTMLElement | null;
    viewport?: HTMLElement;
    content?: HTMLElement | null;
}
export declare type OSTarget = OSTargetElement | OSTargetObject;
