import { OSTarget, OSTargetObject, OSTargetElement } from 'typings';
export interface OSTargetContext {
    _isTextarea: boolean;
    _isBody: boolean;
    _htmlElm: HTMLHtmlElement;
    _bodyElm: HTMLBodyElement;
    _windowElm: Window;
    _documentElm: HTMLDocument;
}
export interface PreparedOSTargetObject {
    _target: OSTargetElement;
    _host: HTMLElement;
    _viewport: HTMLElement;
    _padding: HTMLElement | false | null;
    _content: HTMLElement | false | null;
    _viewportArrange: HTMLStyleElement | false | null;
}
export interface StructureSetup {
    _targetObj: PreparedOSTargetObject;
    _targetCtx: OSTargetContext;
    _destroy: () => void;
}
export declare const createStructureSetup: (target: OSTarget | OSTargetObject) => StructureSetup;
