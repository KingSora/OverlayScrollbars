type CacheValues<T> = [
    value: T,
    changed: boolean,
    previous?: T
];
type UpdateCache<Value> = (force?: boolean) => CacheValues<Value>;
interface WH<T> {
    w: T;
    h: T;
}
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};
type StyleObject<CustomCssProps> = {
    [Key in keyof CSSStyleDeclaration | (CustomCssProps extends string ? CustomCssProps : "")]?: string | number;
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
type ScrollbarVisibilityBehavior = "visible" | "hidden" | "auto";
type ScrollbarAutoHideBehavior = "never" | "scroll" | "leave" | "move";
interface Options {
    paddingAbsolute: boolean;
    showNativeOverlaidScrollbars: boolean;
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
        theme: string | null;
        visibility: ScrollbarVisibilityBehavior;
        autoHide: ScrollbarAutoHideBehavior;
        autoHideDelay: number;
        dragScroll: boolean;
        clickScroll: boolean;
        pointers: string[] | null;
    };
}
type PluginInstance = Record<string, unknown> | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
type Plugin<T extends PluginInstance> = {
    [pluginName: string]: T;
};
type SizeObserverPluginInstance = {
    _: (listenerElement: HTMLElement, onSizeChangedCallback: (appear: boolean) => any, observeAppearChange: boolean) => [
        appearCallback: () => any,
        offFns: (() => any)[]
    ];
};
declare const sizeObserverPlugin: Plugin<SizeObserverPluginInstance>;
type StaticInitialization = HTMLElement | false | null;
type DynamicInitialization = HTMLElement | boolean | null;
type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;
type Initialization = Omit<StructureInitialization, "target"> & ScrollbarsInitialization & {
    cancel: {
        nativeScrollbarsOverlaid: boolean;
        body: boolean | null;
    };
};
type InitializationTargetObject = DeepPartial<Initialization> & Pick<StructureInitialization, "target">;
type InitializationTarget = InitializationTargetElement | InitializationTargetObject;
/**
 * Static elements MUST be present.
 * With false, null or undefined the element will be generated, otherwise the specified element is taken.
 */
type StaticInitializationElement<Args extends any[]> = ((...args: Args) => StaticInitialization) | StaticInitialization;
/**
 * Dynamic element CAN be present.
 * If its a element the element will be taken as the repsective element.
 * With true the element will be generated.
 * With false, null or undefined the element won't be generated.
 */
type DynamicInitializationElement<Args extends any[]> = ((...args: Args) => DynamicInitialization) | DynamicInitialization;
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
    scrollbarsSlot: ScrollbarsDynamicInitializationElement;
}
interface StructureSetupState {
    _padding: TRBL;
    _paddingAbsolute: boolean;
    _viewportPaddingStyle: StyleObject;
    _overflowEdge: XY<number>;
    _overflowAmount: XY<number>;
    _overflowStyle: XY<OverflowStyle>;
    _hasOverflow: XY<boolean>;
    _heightIntrinsic: boolean;
    _directionIsRTL: boolean;
}
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
    host: StructureStaticInitializationElement; // only relevant for textarea
    viewport: StructureStaticInitializationElement;
    padding: StructureDynamicInitializationElement;
    content: StructureDynamicInitializationElement;
}
interface ViewportOverflowState {
    _scrollbarsHideOffset: XY<number>;
    _scrollbarsHideOffsetArrange: XY<boolean>;
    _overflowScroll: XY<boolean>;
    _overflowStyle: XY<OverflowStyle>;
}
type GetViewportOverflowState = (showNativeOverlaidScrollbars: boolean, viewportStyleObj?: StyleObject) => ViewportOverflowState;
type HideNativeScrollbars = (viewportOverflowState: ViewportOverflowState, directionIsRTL: boolean, viewportArrange: boolean, viewportStyleObj: StyleObject) => void;
type EnvironmentEventMap = {
    _: [
    ];
};
interface InternalEnvironment {
    readonly _nativeScrollbarsSize: XY;
    readonly _nativeScrollbarsOverlaid: XY<boolean>;
    readonly _nativeScrollbarsHiding: boolean;
    readonly _rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    readonly _flexboxGlue: boolean;
    readonly _cssCustomProperties: boolean;
    readonly _staticDefaultInitialization: Initialization;
    readonly _staticDefaultOptions: Options;
    _addListener(listener: EventListener<EnvironmentEventMap, "_">): () => void;
    _getDefaultInitialization(): Initialization;
    _setDefaultInitialization(newInitialization: DeepPartial<Initialization>): void;
    _getDefaultOptions(): Options;
    _setDefaultOptions(newDefaultOptions: DeepPartial<Options>): void;
}
type ArrangeViewport = (viewportOverflowState: ViewportOverflowState, viewportScrollSize: WH<number>, sizeFraction: WH<number>, directionIsRTL: boolean) => boolean;
type UndoViewportArrangeResult = [
    redoViewportArrange: () => void,
    overflowState?: ViewportOverflowState
];
type UndoArrangeViewport = (showNativeOverlaidScrollbars: boolean, directionIsRTL: boolean, viewportOverflowState?: ViewportOverflowState) => UndoViewportArrangeResult;
type ScrollbarsHidingPluginInstance = {
    _createUniqueViewportArrangeElement(env: InternalEnvironment): HTMLStyleElement | false;
    _overflowUpdateSegment(doViewportArrange: boolean, flexboxGlue: boolean, viewport: HTMLElement, viewportArrange: HTMLStyleElement | false | null | undefined, getState: () => StructureSetupState, getViewportOverflowState: GetViewportOverflowState, hideNativeScrollbars: HideNativeScrollbars): [
        ArrangeViewport,
        UndoArrangeViewport
    ];
    _envWindowZoom(): (envInstance: InternalEnvironment, updateNativeScrollbarSizeCache: UpdateCache<XY<number>>, triggerEvent: () => void) => void;
};
declare const scrollbarsHidingPlugin: Plugin<ScrollbarsHidingPluginInstance>;
type GeneralInitialEventListeners = InitialEventListeners;
type GeneralEventListener = EventListener;
interface OverlayScrollbarsStatic {
    (target: InitializationTarget, options?: DeepPartial<Options>, eventListeners?: GeneralInitialEventListeners<EventListenerMap>): OverlayScrollbars;
    plugin(plugin: Plugin | Plugin[]): void;
    env(): Environment;
}
interface Environment {
    scrollbarsSize: XY<number>;
    scrollbarsOverlaid: XY<boolean>;
    scrollbarsHiding: boolean;
    rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    flexboxGlue: boolean;
    cssCustomProperties: boolean;
    staticDefaultInitialization: Initialization;
    staticDefaultOptions: Options;
    getDefaultInitialization(): Initialization;
    setDefaultInitialization(newDefaultInitialization: DeepPartial<Initialization>): void;
    getDefaultOptions(): Options;
    setDefaultOptions(newDefaultOptions: DeepPartial<Options>): void;
}
interface State {
    padding: TRBL;
    paddingAbsolute: boolean;
    overflowEdge: XY<number>;
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
        overflowEdgeChanged: boolean;
        overflowAmountChanged: boolean;
        overflowStyleChanged: boolean;
        hostMutation: boolean;
        contentMutation: boolean;
    };
    changedOptions: DeepPartial<Options>;
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
        canceled: boolean
    ];
};
type EventListener$0<Name extends keyof EventListenerMap> = GeneralEventListener<EventListenerMap, Name>;
interface OverlayScrollbars {
    options(): Options;
    options(newOptions?: DeepPartial<Options>): Options;
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
export { OverlayScrollbars, scrollbarsHidingPlugin, sizeObserverPlugin };
