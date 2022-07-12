type PartialOptions<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? PartialOptions<T[P]> : T[P];
};
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
type EventListener<EventMap extends Record<string, any[]>, Name extends keyof EventMap> = (...args: EventMap[Name]) => void;
type InitialEventListeners<EventMap extends Record<string, any[]>> = {
    [K in keyof EventMap]?: EventListener<EventMap> | EventListener<EventMap>[];
};
type OverflowBehavior = "hidden" | "scroll" | "visible" | "visible-hidden" | "visible-scroll";
type VisibilityBehavior = "visible" | "hidden" | "auto";
type AutoHideBehavior = "never" | "scroll" | "leave" | "move";
interface Options {
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
type OSPluginInstance = Record<string, unknown> | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
type OSPlugin<T extends OSPluginInstance> = [
    string,
    T
];
type ScrollbarsDynamicInitializationElement = DynamicInitializationElement<[
    target: InitializationTargetElement,
    host: HTMLElement,
    viewport: HTMLElement
]>;
/**
 * Object for special initialization.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Null or Undefined means that the environment initialization strategy is used.
 */
interface ScrollbarsInitialization {
    scrollbarsSlot?: ScrollbarsDynamicInitializationElement;
}
type ScrollbarsInitializationStrategy = {
    [K in keyof ScrollbarsInitialization as `_${K}`]: InitializtationElementStrategy<ScrollbarsInitialization[K]>;
};
type StructureStaticInitializationElement = StaticInitializationElement<[
    target: InitializationTargetElement
]>;
type StructureDynamicInitializationElement = DynamicInitializationElement<[
    target: InitializationTargetElement
]>;
/**
 * Object for special initialization.
 *
 * Target is always required, if element is not provided or undefined it will be generated.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Null or Undefined means that the environment initialization strategy is used.
 */
interface StructureInitialization {
    target: InitializationTargetElement;
    host?: StructureStaticInitializationElement; // only relevant for textarea
    viewport?: StructureStaticInitializationElement;
    padding?: StructureDynamicInitializationElement;
    content?: StructureDynamicInitializationElement;
}
type StructureInitializationStrategy = {
    [K in keyof Omit<StructureInitialization, "target"> as `_${K}`]: InitializtationElementStrategy<StructureInitialization[K]>;
};
type StaticInitialization = HTMLElement | null | undefined;
type DynamicInitialization = HTMLElement | boolean | null | undefined;
type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;
type InitializationTargetObject = StructureInitialization & ScrollbarsInitialization;
type InitializationTarget = InitializationTargetElement | InitializationTargetObject;
type InitializationStrategy = StructureInitializationStrategy & ScrollbarsInitializationStrategy;
/**
 * Static elements MUST be present.
 * Null or undefined behave like if this element wasn't specified during initialization.
 */
type StaticInitializationElement<Args extends any[]> = ((...args: Args) => StaticInitialization) | StaticInitialization;
/**
 * Dynamic element CAN be present.
 * If its a element the element will be handled as the repsective element.
 * True means that the respective dynamic element is forced to be generated.
 * False means that the respective dynamic element is forced NOT to be generated.
 * Null or undefined behave like if this element wasn't specified during initialization.
 */
type DynamicInitializationElement<Args extends any[]> = ((...args: Args) => DynamicInitialization) | DynamicInitialization;
type InitializtationElementStrategy<InitElm> = Exclude<InitElm, HTMLElement>;
type GeneralInitialEventListeners = InitialEventListeners;
type GeneralEventListener = EventListener;
interface OverlayScrollbarsStatic {
    (target: InitializationTarget | InitializationTargetObject, options?: PartialOptions<Options>, eventListeners?: GeneralInitialEventListeners<EventListenerMap>): OverlayScrollbars;
    plugin(osPlugin: OSPlugin | OSPlugin[]): void;
    env(): Environment;
}
interface Environment {
    scrollbarSize: XY<number>;
    scrollbarIsOverlaid: XY<boolean>;
    scrollbarStyling: boolean;
    rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    flexboxGlue: boolean;
    cssCustomProperties: boolean;
    defaultInitializationStrategy: InitializationStrategy;
    defaultDefaultOptions: Options;
    getInitializationStrategy(): InitializationStrategy;
    setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
    getDefaultOptions(): Options;
    setDefaultOptions(newDefaultOptions: PartialOptions<Options>): void;
}
interface State {
    padding: TRBL;
    paddingAbsolute: boolean;
    overflowAmount: XY<number>;
    overflowStyle: XY<OverflowStyle>;
    hasOverflow: XY<boolean>;
    destroyed: boolean;
}
interface Elements {
    target: HTMLElement;
    host: HTMLElement;
    padding: HTMLElement;
    viewport: HTMLElement;
    content: HTMLElement;
}
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
    changedOptions: PartialOptions<Options>;
    force: boolean;
}
type EventListenerMap = {
    /**
     * Triggered after all elements are initialized and appended.
     */
    initialized: [
        instance: OverlayScrollbars
    ];
    /**
     * Triggered after an update.
     */
    updated: [
        instance: OverlayScrollbars,
        onUpdatedArgs: OnUpdatedEventListenerArgs
    ];
    /**
     * Triggered after all elements, observers and events are destroyed.
     */
    destroyed: [
        instance: OverlayScrollbars,
        withdrawn: boolean
    ];
};
type EventListener$0<Name extends keyof EventListenerMap> = GeneralEventListener<EventListenerMap, Name>;
interface OverlayScrollbars {
    options(): Options;
    options(newOptions?: PartialOptions<Options>): Options;
    update(force?: boolean): OverlayScrollbars;
    destroy(): void;
    state(): State;
    elements(): Elements;
    on<Name extends keyof EventListenerMap>(name: Name, listener: EventListener$0<Name>): () => void;
    on<Name extends keyof EventListenerMap>(name: Name, listener: EventListener$0<Name>[]): () => void;
    off<Name extends keyof EventListenerMap>(name: Name, listener: EventListener$0<Name>): void;
    off<Name extends keyof EventListenerMap>(name: Name, listener: EventListener$0<Name>[]): void;
}
/**
 * Notes:
 * Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer
 */
declare const OverlayScrollbars: OverlayScrollbarsStatic;
export { OverlayScrollbars as default };
