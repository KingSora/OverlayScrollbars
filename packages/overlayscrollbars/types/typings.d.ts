export declare type PlainObject<T = any> = {
    [name: string]: T;
};
export declare type InternalVersionOf<T> = {
    [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
};
export declare type OSTargetElement = HTMLElement | HTMLTextAreaElement;
export interface OSTargetObject {
    target: OSTargetElement;
    host?: HTMLElement;
    padding?: HTMLElement | null;
    viewport?: HTMLElement;
    content?: HTMLElement | null;
}
export declare type OSTarget = OSTargetElement | OSTargetObject;
