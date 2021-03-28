import { OSTarget, OSTargetObject, InternalVersionOf } from 'typings';
export interface OSTargetContext {
    _isTextarea: boolean;
    _isBody: boolean;
    _htmlElm: HTMLHtmlElement;
    _bodyElm: HTMLBodyElement;
    _windowElm: Window;
    _documentElm: HTMLDocument;
}
export interface PreparedOSTargetObject extends Required<InternalVersionOf<OSTargetObject>> {
    _host: HTMLElement;
    _contentArrange: HTMLElement | null;
}
export interface StructureSetup {
    _targetObj: PreparedOSTargetObject;
    _targetCtx: OSTargetContext;
    _destroy: () => void;
}
export declare const createStructureSetup: (target: OSTarget | OSTargetObject) => StructureSetup;
