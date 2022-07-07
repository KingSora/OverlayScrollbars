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
type OverflowStyle = "scroll" | "hidden" | "visible";
interface TRBL {
    t: number;
    r: number;
    b: number;
    l: number;
}
interface XY<T> {
    x: T;
    y: T;
}
type EventListener<NameArgsMap extends Record<string, any>, Name extends Extract<keyof NameArgsMap, string>> = (...args: NameArgsMap[Name] extends undefined ? [
] : [
    args: NameArgsMap[Name]
]) => void;
type EventListenerGroup<NameArgsMap extends Record<string, any>, Name extends Extract<keyof NameArgsMap, string>> = EventListener<NameArgsMap, Name> | EventListener<NameArgsMap, Name>[];
type AddEventListener<NameArgsMap extends Record<string, any>> = <Name extends Extract<keyof NameArgsMap, string>>(name: Name, listener: EventListenerGroup<NameArgsMap, Name>) => () => void;
type RemoveEventListener<NameArgsMap extends Record<string, any>> = <Name extends Extract<keyof NameArgsMap, string>>(name?: Name, listener?: EventListenerGroup<NameArgsMap, Name>) => void;
type InitialEventListeners<NameArgsMap extends Record<string, any>> = {
    [K in Extract<keyof NameArgsMap, string>]?: EventListenerGroup<NameArgsMap, K>;
};
type OverflowBehavior = "hidden" | "scroll" | "visible" | "visible-hidden" | "visible-scroll";
type VisibilityBehavior = "visible" | "hidden" | "auto";
type AutoHideBehavior = "never" | "scroll" | "leave" | "move";
interface OSOptions {
    paddingAbsolute: boolean;
    updating: {
        elementEvents: Array<[
            elementSelector: string,
            eventNames: string
        ]> | null;
        attributes: string[] | null;
        debounce: [
            timeout: number,
            maxWait: number
        ] | number | null; // (if tuple: [timeout: 0, maxWait: 33], if number: [timeout: number, maxWait: false]) debounce for content Changes
        ignoreMutation: ((mutation: MutationRecord) => any) | null;
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
    nativeScrollbarsOverlaid: {
        show: boolean;
        initialize: boolean;
    };
}
type StructureInitializationStrategyElementFn<T> = ((target: OSTargetElement) => HTMLElement | T) | T;
type ScrollbarsInitializationStrategyElementFn<T> = ((target: OSTargetElement, host: HTMLElement, viewport: HTMLElement) => HTMLElement | T) | T;
/**
 * A Static element is an element which MUST be generated.
 * If null or undefined (or the returned result is null or undefined), the initialization function is generatig the element, otherwise
 * the element returned by the function acts as the generated element.
 */
type StructureInitializationStrategyStaticElement = StructureInitializationStrategyElementFn<null | undefined>;
/**
 * A Dynamic element is an element which CAN be generated.
 * If boolean (or the returned result is boolean), the generation of the element is forced (or not).
 * If the function returns and element, the element returned by the function acts as the generated element.
 */
type StructureInitializationStrategyDynamicElement = StructureInitializationStrategyElementFn<boolean>;
interface StructureInitializationStrategy {
    _host: StructureInitializationStrategyStaticElement;
    _viewport: StructureInitializationStrategyStaticElement;
    _padding: StructureInitializationStrategyDynamicElement;
    _content: StructureInitializationStrategyDynamicElement;
}
interface ScrollbarsInitializationStrategy {
    /**
     * The scrollbars slot.  If null or undefined (or the returned result is null or undefined), the initialization function is deciding the element, otherwise
     * the element returned by the function acts as the scrollbars slot.
     */
    _scrollbarsSlot: ScrollbarsInitializationStrategyElementFn<null | undefined>;
}
interface InitializationStrategy extends StructureInitializationStrategy, ScrollbarsInitializationStrategy {
}
type DefaultInitializationStrategy = {
    [K in keyof InitializationStrategy]: Extract<InitializationStrategy[K], boolean | null | undefined>;
};
type OSPluginInstance = Record<string, unknown> | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
type OSPlugin<T extends OSPluginInstance> = [
    string,
    T
];
/*
onScrollStart               : null,
onScroll                    : null,
onScrollStop                : null,
onOverflowChanged           : null,
onOverflowAmountChanged     : null, // fusion with onOverflowChanged
onDirectionChanged          : null, // gone
onContentSizeChanged        : null, // gone
onHostSizeChanged           : null, // gone
*/
interface OnUpdatedEventListenerArgs {
    updateHints: {
        sizeChanged: boolean;
        directionChanged: boolean;
        heightIntrinsicChanged: boolean;
        overflowAmountChanged: boolean;
        overflowStyleChanged: boolean;
        hostMutation: boolean;
        contentMutation: boolean;
    };
    changedOptions: PartialOptions<OSOptions>;
    force: boolean;
}
interface OSEventListenersNameArgsMap {
    initialized: undefined;
    initializationWithdrawn: undefined;
    updated: OnUpdatedEventListenerArgs;
    destroyed: undefined;
}
type AddOSEventListener = AddEventListener<OSEventListenersNameArgsMap>;
type RemoveOSEventListener = RemoveEventListener<OSEventListenersNameArgsMap>;
type InitialOSEventListeners = InitialEventListeners<OSEventListenersNameArgsMap>;
interface OverlayScrollbarsStatic {
    (target: OSTarget | OSInitializationObject, options?: PartialOptions<OSOptions>, eventListeners?: InitialOSEventListeners): OverlayScrollbars;
    plugin(osPlugin: OSPlugin | OSPlugin[]): void;
    env(): OverlayScrollbarsEnv;
}
interface OverlayScrollbarsEnv {
    scrollbarSize: XY<number>;
    scrollbarIsOverlaid: XY<boolean>;
    scrollbarStyling: boolean;
    rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    flexboxGlue: boolean;
    cssCustomProperties: boolean;
    defaultInitializationStrategy: DefaultInitializationStrategy;
    defaultDefaultOptions: OSOptions;
    getInitializationStrategy(): InitializationStrategy;
    setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
    getDefaultOptions(): OSOptions;
    setDefaultOptions(newDefaultOptions: PartialOptions<OSOptions>): void;
}
interface OverlayScrollbarsState {
    padding: TRBL;
    paddingAbsolute: boolean;
    overflowAmount: XY<number>;
    overflowStyle: XY<OverflowStyle>;
    hasOverflow: XY<boolean>;
}
interface OverlayScrollbarsElements {
    target: HTMLElement;
    host: HTMLElement;
    padding: HTMLElement;
    viewport: HTMLElement;
    content: HTMLElement;
}
interface OverlayScrollbars {
    options(): OSOptions;
    options(newOptions?: PartialOptions<OSOptions>): OSOptions;
    update(force?: boolean): void;
    destroy(): void;
    state(): OverlayScrollbarsState;
    elements(): OverlayScrollbarsElements;
    on: AddOSEventListener;
    off: RemoveOSEventListener;
}
/**
 * Notes:
 * Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer
 */
declare const OverlayScrollbars: OverlayScrollbarsStatic;
export { OverlayScrollbars as default };
