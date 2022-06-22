type PartialOptions<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? PartialOptions<T[P]> : T[P];
};
type OSTargetElement = HTMLElement | HTMLTextAreaElement;
/**
 * Static elements MUST be present.
 */
type StructureInitializationStaticElement = HTMLElement;
/**
 * Dynamic element CAN be present.
 * If its a element the element will be handled as the repsective element.
 * True means that the respective dynamic element is forced to be generated.
 * False means that the respective dynamic element is forced NOT to be generated.
 */
type StructureInitializationDynamicElement = HTMLElement | boolean;
/**
 * Object for special initialization.
 *
 * Target is always required, if element is not provided or undefined it will be generated.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Undefined means that the environment initialization strategy for the respective element is used.
 */
interface StructureInitialization {
    target: OSTargetElement;
    host?: StructureInitializationStaticElement; // only relevant for textarea
    viewport?: StructureInitializationStaticElement;
    padding?: StructureInitializationDynamicElement;
    content?: StructureInitializationDynamicElement;
}
/**
 * Object for special initialization.
 *
 * scrollbarsSlot is the element to which the scrollbars are applied to. If null or undefined the plugin decides by itself whats the scrollbars slot.
 */
interface ScrollbarsInitialization {
    scrollbarsSlot?: null | HTMLElement | ((target: OSTargetElement, host: HTMLElement, viewport: HTMLElement) => null | HTMLElement);
}
interface OSInitializationObject extends StructureInitialization, ScrollbarsInitialization {
}
type OSTarget = OSTargetElement | OSInitializationObject;
type ResizeBehavior = "none" | "both" | "horizontal" | "vertical";
type OverflowBehavior = "hidden" | "scroll" | "visible" | "visible-hidden";
type VisibilityBehavior = "visible" | "hidden" | "auto";
type AutoHideBehavior = "never" | "scroll" | "leave" | "move";
interface OSOptions {
    resize: ResizeBehavior;
    paddingAbsolute: boolean;
    updating: {
        elementEvents: Array<[
            string,
            string
        ]> | null;
        attributes: string[] | null;
        debounce: number | [
            number,
            number
        ] | null;
    };
    overflow: {
        x: OverflowBehavior;
        y: OverflowBehavior;
    };
    scrollbars: {
        visibility: VisibilityBehavior;
        autoHide: AutoHideBehavior;
        autoHideDelay: number;
        dragScroll: boolean;
        clickScroll: boolean;
        touch: boolean;
    };
    textarea: {
        dynWidth: boolean;
        dynHeight: boolean;
        inheritedAttrs: string | Array<string> | null;
    };
    nativeScrollbarsOverlaid: {
        show: boolean;
        initialize: boolean;
    };
    callbacks: {
        onUpdated: (() => any) | null;
    };
}
type OSPluginInstance = Record<string, unknown> | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
type OSPlugin<T extends OSPluginInstance = OSPluginInstance> = [
    string,
    T
];
interface OverlayScrollbarsStatic {
    (target: OSTarget | OSInitializationObject, options?: PartialOptions<OSOptions>, extensions?: any): OverlayScrollbars;
    extend(osPlugin: OSPlugin | OSPlugin[]): void;
}
interface OverlayScrollbars {
    options(): OSOptions;
    options(newOptions?: PartialOptions<OSOptions>): OSOptions;
    update(force?: boolean): void;
    destroy(): void;
    state(): any;
}
declare const OverlayScrollbars: OverlayScrollbarsStatic;
export { OverlayScrollbars as default };
