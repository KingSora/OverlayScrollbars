declare type CacheValues<T> = [value: T, changed: boolean, previous?: T];
declare type UpdateCache<Value> = (force?: boolean) => CacheValues<Value>;

interface WH<T = number> {
    w: T;
    h: T;
}

declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};
declare type StyleObject<CustomCssProps = ''> = {
    [Key in keyof CSSStyleDeclaration | (CustomCssProps extends string ? CustomCssProps : '')]?: string | number;
};
declare type OverflowStyle = 'scroll' | 'hidden' | 'visible';

interface TRBL {
    t: number;
    r: number;
    b: number;
    l: number;
}

interface XY<T = number> {
    x: T;
    y: T;
}

declare type EventListener$1<EventMap extends Record<string, any[]>, N extends keyof EventMap = keyof EventMap> = (...args: EventMap[N]) => void;
declare type InitialEventListeners$1<EventMap extends Record<string, any[]>> = {
    [K in keyof EventMap]?: EventListener$1<EventMap> | EventListener$1<EventMap>[];
};

declare type OverflowBehavior = 'hidden' | 'scroll' | 'visible' | 'visible-hidden' | 'visible-scroll';
declare type ScrollbarVisibilityBehavior = 'visible' | 'hidden' | 'auto';
declare type ScrollbarAutoHideBehavior = 'never' | 'scroll' | 'leave' | 'move';
interface Options {
    paddingAbsolute: boolean;
    showNativeOverlaidScrollbars: boolean;
    update: {
        elementEvents: Array<[elementSelector: string, eventNames: string]> | null;
        debounce: [timeout: number, maxWait: number] | number | null;
        attributes: string[] | null;
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

declare type PluginInstance = Record<string, unknown> | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
declare type Plugin<T extends PluginInstance = PluginInstance> = {
    [pluginName: string]: T;
};

declare type SizeObserverPluginInstance = {
    _: (listenerElement: HTMLElement, onSizeChangedCallback: (appear: boolean) => any, observeAppearChange: boolean) => [appearCallback: () => any, offFns: (() => any)[]];
};
declare const sizeObserverPlugin: Plugin<SizeObserverPluginInstance>;

declare type StaticInitialization = HTMLElement | false | null;
declare type DynamicInitialization = HTMLElement | boolean | null;
/**
 * Static elements are elements which MUST be present in the final DOM.
 * With false, null or undefined the element will be generated, otherwise the specified element is taken.
 */
declare type StaticInitializationElement<Args extends any[]> = ((...args: Args) => StaticInitialization) | StaticInitialization;
/**
 * Dynamic element are elements which CAN be present in the final DOM.
 * If its a element the element will be taken as the repsective element.
 * With true the element will be generated.
 * With false, null or undefined the element won't be generated and wont be in the DOM.
 */
declare type DynamicInitializationElement<Args extends any[]> = ((...args: Args) => DynamicInitialization) | DynamicInitialization;
declare type Initialization = {
    elements: {
        host: StaticInitializationElement<[target: InitializationTargetElement]>;
        viewport: StaticInitializationElement<[target: InitializationTargetElement]>;
        padding: DynamicInitializationElement<[target: InitializationTargetElement]>;
        content: DynamicInitializationElement<[target: InitializationTargetElement]>;
    };
    scrollbars: {
        slot: DynamicInitializationElement<[
            target: InitializationTargetElement,
            host: HTMLElement,
            viewport: HTMLElement
        ]>;
    };
    cancel: {
        nativeScrollbarsOverlaid: boolean;
        body: boolean | null;
    };
};
declare type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;
declare type InitializationTargetObject = DeepPartial<Initialization> & {
    target: InitializationTargetElement;
};
declare type InitializationTarget = InitializationTargetElement | InitializationTargetObject;

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

interface ViewportOverflowState {
    _scrollbarsHideOffset: XY<number>;
    _scrollbarsHideOffsetArrange: XY<boolean>;
    _overflowScroll: XY<boolean>;
    _overflowStyle: XY<OverflowStyle>;
}
declare type GetViewportOverflowState = (showNativeOverlaidScrollbars: boolean, viewportStyleObj?: StyleObject) => ViewportOverflowState;
declare type HideNativeScrollbars = (viewportOverflowState: ViewportOverflowState, directionIsRTL: boolean, viewportArrange: boolean, viewportStyleObj: StyleObject) => void;

declare type EnvironmentEventMap = {
    _: [];
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
    _addListener(listener: EventListener$1<EnvironmentEventMap, '_'>): () => void;
    _getDefaultInitialization(): Initialization;
    _setDefaultInitialization(newInitialization: DeepPartial<Initialization>): void;
    _getDefaultOptions(): Options;
    _setDefaultOptions(newDefaultOptions: DeepPartial<Options>): void;
}

declare type ArrangeViewport = (viewportOverflowState: ViewportOverflowState, viewportScrollSize: WH<number>, sizeFraction: WH<number>, directionIsRTL: boolean) => boolean;
declare type UndoViewportArrangeResult = [
    redoViewportArrange: () => void,
    overflowState?: ViewportOverflowState
];
declare type UndoArrangeViewport = (showNativeOverlaidScrollbars: boolean, directionIsRTL: boolean, viewportOverflowState?: ViewportOverflowState) => UndoViewportArrangeResult;
declare type ScrollbarsHidingPluginInstance = {
    _createUniqueViewportArrangeElement(env: InternalEnvironment): HTMLStyleElement | false;
    _overflowUpdateSegment(doViewportArrange: boolean, flexboxGlue: boolean, viewport: HTMLElement, viewportArrange: HTMLStyleElement | false | null | undefined, getState: () => StructureSetupState, getViewportOverflowState: GetViewportOverflowState, hideNativeScrollbars: HideNativeScrollbars): [ArrangeViewport, UndoArrangeViewport];
    _envWindowZoom(): (envInstance: InternalEnvironment, updateNativeScrollbarSizeCache: UpdateCache<XY<number>>, triggerEvent: () => void) => void;
};
declare const scrollbarsHidingPlugin: Plugin<ScrollbarsHidingPluginInstance>;

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
declare type EventListenerMap = {
    /**
     * Triggered after all elements are initialized and appended.
     */
    initialized: [instance: OverlayScrollbars];
    /**
     * Triggered after an update.
     */
    updated: [instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs];
    /**
     * Triggered after all elements, observers and events are destroyed.
     */
    destroyed: [instance: OverlayScrollbars, canceled: boolean];
};
declare type InitialEventListeners = InitialEventListeners$1<EventListenerMap>;
declare type EventListener<N extends keyof EventListenerMap> = EventListener$1<EventListenerMap, N>;

interface OverlayScrollbarsStatic {
    (target: InitializationTarget): OverlayScrollbars | undefined;
    (target: InitializationTarget, options: DeepPartial<Options>, eventListeners?: InitialEventListeners): OverlayScrollbars;
    plugin(plugin: Plugin | Plugin[]): void;
    valid(osInstance: any): boolean;
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
    directionRTL: boolean;
    destroyed: boolean;
}
interface ScrollbarElements {
    scrollbar: HTMLElement;
    track: HTMLElement;
    handle: HTMLElement;
}
interface CloneableScrollbarElements extends ScrollbarElements {
    clone(): ScrollbarElements;
}
interface Elements {
    target: HTMLElement;
    host: HTMLElement;
    padding: HTMLElement;
    viewport: HTMLElement;
    content: HTMLElement;
    scrollOffsetElement: HTMLElement;
    scrollEventElement: HTMLElement | Document;
    scrollbarHorizontal: CloneableScrollbarElements;
    scrollbarVertical: CloneableScrollbarElements;
}
interface OverlayScrollbars {
    options(): Options;
    options(newOptions: DeepPartial<Options>): Options;
    update(force?: boolean): OverlayScrollbars;
    destroy(): void;
    state(): State;
    elements(): Elements;
    on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): () => void;
    on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): () => void;
    off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): void;
    off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): void;
}
declare const OverlayScrollbars: OverlayScrollbarsStatic;

export { DynamicInitializationElement, EventListener, EventListenerMap, InitialEventListeners, Initialization, InitializationTarget, InitializationTargetElement, InitializationTargetObject, OnUpdatedEventListenerArgs, Options, OverflowBehavior, OverlayScrollbars, Plugin, PluginInstance, ScrollbarAutoHideBehavior, ScrollbarVisibilityBehavior, StaticInitializationElement, scrollbarsHidingPlugin, sizeObserverPlugin };
