export interface OnOptions {
    _capture?: boolean;
    _passive?: boolean;
    _once?: boolean;
}
export declare const off: (target: EventTarget, eventNames: string, listener: EventListener, capture?: boolean | undefined) => void;
export declare const on: (target: EventTarget, eventNames: string, listener: EventListener, options?: OnOptions | undefined) => (() => void);
export declare const stopPropagation: (evt: Event) => void;
export declare const preventDefault: (evt: Event) => void;
