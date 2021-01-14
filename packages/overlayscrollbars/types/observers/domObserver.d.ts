declare type StringNullUndefined = string | null | undefined;
export declare type DOMOvserverEventContentChangeResult = Array<[StringNullUndefined, StringNullUndefined] | null | undefined>;
export declare type DOMOvserverEventContentChange = () => DOMOvserverEventContentChangeResult;
export declare type DOMObserverIgnoreContentChange = (mutation: MutationRecord, domObserverTarget: HTMLElement, domObserverOptions: DOMObserverOptions | undefined) => boolean | null | undefined;
export interface DOMObserverOptions {
    _observeContent?: boolean;
    _attributes?: string[];
    _ignoreContentChange?: DOMObserverIgnoreContentChange;
    _eventContentChange?: DOMOvserverEventContentChange;
}
export interface DOMObserver {
    _disconnect: () => void;
    _update: () => void;
}
export declare const createDOMObserver: (target: HTMLElement, callback: (targetChangedAttrs: string[], targetStyleChanged: boolean, contentChanged: boolean) => any, options?: DOMObserverOptions | undefined) => DOMObserver;
export {};
