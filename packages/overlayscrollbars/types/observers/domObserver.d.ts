export interface DOMObserverOptions {
    _observeContent?: boolean;
    _attributes?: string[];
}
export interface DOMObserver {
    _disconnect: () => void;
    _update: () => void;
}
export declare const createDOMObserver: (target: HTMLElement, callback: (changedTargetAttrs: string[], styleChanged: boolean, contentChanged: boolean) => any, options?: DOMObserverOptions | undefined) => DOMObserver;
