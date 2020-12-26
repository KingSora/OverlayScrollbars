export declare type PlainObject<T = any> = {
    [name: string]: T;
};
export declare type OSTargetElement = HTMLElement | HTMLTextAreaElement;
export interface OSTargetObject {
    target: OSTargetElement;
    host: HTMLElement;
    viewport: HTMLElement;
    content: HTMLElement;
}
export declare type OSTarget = OSTargetElement | OSTargetObject;
