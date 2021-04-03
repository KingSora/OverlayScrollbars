export type PlainObject<T = any> = { [name: string]: T };

export type StyleObject<CustomCssProps = ''> = {
  [Key in (keyof CSSStyleDeclaration | (CustomCssProps extends string ? CustomCssProps : ''))]?: string | number;
}

export type InternalVersionOf<T> = {
  [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
};

export type OSTargetElement = HTMLElement | HTMLTextAreaElement;

/**
 * Object for special initialization.
 * 
 * Target is always required, if element is not provided or undefined it will be generated.
 * 
 * If element is provided, the provided element takes all its responsibilities. 
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 * 
 * If element is null it won't be generated, and the responsibilities (feautes) of this element are lost.
 */
export interface OSTargetObject {
  target: OSTargetElement;
  host?: HTMLElement;
  padding?: HTMLElement | null;
  viewport?: HTMLElement;
  content?: HTMLElement | null;
}

export type OSTarget = OSTargetElement | OSTargetObject;

/*
export namespace OverlayScrollbars {
  export type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical';

  export type OverflowBehavior = 'hidden' | 'scroll' | 'visible-hidden' | 'visible-scroll';

  export type VisibilityBehavior = 'visible' | 'hidden' | 'auto';

  export type AutoHideBehavior = 'never' | 'scroll' | 'leave' | 'move';

  export type ScrollBehavior = 'always' | 'ifneeded' | 'never';

  export type BlockBehavior = 'begin' | 'end' | 'center' | 'nearest';

  export type Easing = string | null | undefined;

  export type Margin = number | boolean;

  export type Position = number | string;

  export type Extensions = string | ReadonlyArray<string> | { [extensionName: string]: {} };

  export type BasicEventCallback = (this: OverlayScrollbars) => void;

  export type ScrollEventCallback = (this: OverlayScrollbars, args?: UIEvent) => void;

  export type OverflowChangedCallback = (this: OverlayScrollbars, args?: OverflowChangedArgs) => void;

  export type OverflowAmountChangedCallback = (this: OverlayScrollbars, args?: OverflowAmountChangedArgs) => void;

  export type DirectionChangedCallback = (this: OverlayScrollbars, args?: DirectionChangedArgs) => void;

  export type SizeChangedCallback = (this: OverlayScrollbars, args?: SizeChangedArgs) => void;

  export type UpdatedCallback = (this: OverlayScrollbars, args?: UpdatedArgs) => void;

  export type Coordinates =
    | { x?: Position; y?: Position }
    | { l?: Position; t?: Position }
    | { left?: Position; top?: Position }
    | [Position, Position]
    | Position
    | HTMLElement
    | {
        el: HTMLElement;
        scroll?: ScrollBehavior | { x?: ScrollBehavior; y?: ScrollBehavior } | [ScrollBehavior, ScrollBehavior];
        block?: BlockBehavior | { x?: BlockBehavior; y?: BlockBehavior } | [BlockBehavior, BlockBehavior];
        margin?:
          | Margin
          | {
              top?: Margin;
              right?: Margin;
              bottom?: Margin;
              left?: Margin;
            }
          | [Margin, Margin]
          | [Margin, Margin, Margin, Margin];
      };

  export interface OverflowChangedArgs {
    x: boolean;
    y: boolean;
    xScrollable: boolean;
    yScrollable: boolean;
    clipped: boolean;
  }

  export interface OverflowAmountChangedArgs {
    x: number;
    y: number;
  }

  export interface DirectionChangedArgs {
    isRTL: number;
    dir: string;
  }

  export interface SizeChangedArgs {
    width: number;
    height: number;
  }

  export interface UpdatedArgs {
    forced: boolean;
  }

  export interface Options {
    className?: string | null;
    resize?: ResizeBehavior;
    sizeAutoCapable?: boolean;
    clipAlways?: boolean;
    normalizeRTL?: boolean;
    paddingAbsolute?: boolean;
    autoUpdate?: boolean | null;
    autoUpdateInterval?: number;
    updateOnLoad?: string | ReadonlyArray<string> | null;
    nativeScrollbarsOverlaid?: {
      showNativeScrollbars?: boolean;
      initialize?: boolean;
    };
    overflowBehavior?: {
      x?: OverflowBehavior;
      y?: OverflowBehavior;
    };
    scrollbars?: {
      visibility?: VisibilityBehavior;
      autoHide?: AutoHideBehavior;
      autoHideDelay?: number;
      dragScrolling?: boolean;
      clickScrolling?: boolean;
      touchSupport?: boolean;
      snapHandle?: boolean;
    };
    textarea?: {
      dynWidth?: boolean;
      dynHeight?: boolean;
      inheritedAttrs?: string | ReadonlyArray<string> | null;
    };
    callbacks?: {
      onInitialized?: BasicEventCallback | null;
      onInitializationWithdrawn?: BasicEventCallback | null;
      onDestroyed?: BasicEventCallback | null;
      onScrollStart?: ScrollEventCallback | null;
      onScroll?: ScrollEventCallback | null;
      onScrollStop?: ScrollEventCallback | null;
      onOverflowChanged?: OverflowChangedCallback | null;
      onOverflowAmountChanged?: OverflowAmountChangedCallback | null;
      onDirectionChanged?: DirectionChangedCallback | null;
      onContentSizeChanged?: SizeChangedCallback | null;
      onHostSizeChanged?: SizeChangedCallback | null;
      onUpdated?: UpdatedCallback | null;
    };
  }

  export interface ScrollInfo {
    position: {
      x: number;
      y: number;
    };
    ratio: {
      x: number;
      y: number;
    };
    max: {
      x: number;
      y: number;
    };
    handleOffset: {
      x: number;
      y: number;
    };
    handleLength: {
      x: number;
      y: number;
    };
    handleLengthRatio: {
      x: number;
      y: number;
    };
    trackLength: {
      x: number;
      y: number;
    };
    snappedHandleOffset: {
      x: number;
      y: number;
    };
    isRTL: boolean;
    isRTLNormalized: boolean;
  }

  export interface Elements {
    target: HTMLElement;
    host: HTMLElement;
    padding: HTMLElement;
    viewport: HTMLElement;
    content: HTMLElement;
    scrollbarHorizontal: {
      scrollbar: HTMLElement;
      track: HTMLElement;
      handle: HTMLElement;
    };
    scrollbarVertical: {
      scrollbar: HTMLElement;
      track: HTMLElement;
      handle: HTMLElement;
    };
    scrollbarCorner: HTMLElement;
  }

  export interface State {
    destroyed: boolean;
    sleeping: boolean;
    autoUpdate: boolean;
    widthAuto: boolean;
    heightAuto: boolean;
    documentMixed: boolean;
    padding: {
      t: number;
      r: number;
      b: number;
      l: number;
    };
    overflowAmount: {
      x: number;
      y: number;
    };
    hideOverflow: {
      x: boolean;
      y: boolean;
      xs: boolean;
      ys: boolean;
    };
    hasOverflow: {
      x: boolean;
      y: boolean;
    };
    contentScrollSize: {
      width: number;
      height: number;
    };
    viewportSize: {
      width: number;
      height: number;
    };
    hostSize: {
      width: number;
      height: number;
    };
  }

  export interface Extension {
    contract(global: any): boolean;

    added(options?: {}): void;

    removed(): void;

    on(
      callbackName: string,
      callbackArgs?: UIEvent | OverflowChangedArgs | OverflowAmountChangedArgs | DirectionChangedArgs | SizeChangedArgs | UpdatedArgs,
    ): void;
  }

  export interface ExtensionInfo {
    name: string;
    extensionFactory: (this: OverlayScrollbars, defaultOptions: {}, compatibility: Compatibility, framework: any) => Extension;
    defaultOptions?: {};
  }

  export interface Globals {
    defaultOptions: {};
    autoUpdateLoop: boolean;
    autoUpdateRecommended: boolean;
    supportMutationObserver: boolean;
    supportResizeObserver: boolean;
    supportPassiveEvents: boolean;
    supportTransform: boolean;
    supportTransition: boolean;
    restrictedMeasuring: boolean;
    nativeScrollbarStyling: boolean;
    cssCalc: string | null;
    nativeScrollbarSize: {
      x: number;
      y: number;
    };
    nativeScrollbarIsOverlaid: {
      x: boolean;
      y: boolean;
    };
    overlayScrollbarDummySize: {
      x: number;
      y: number;
    };
    rtlScrollBehavior: {
      i: boolean;
      n: boolean;
    };
  }

  export interface Compatibility {
    wW(): number;
    wH(): number;
    mO(): any;
    rO(): any;
    rAF(): (callback: (...args: any[]) => any) => number;
    cAF(): (requestID: number) => void;
    now(): number;
    stpP(event: Event): void;
    prvD(event: Event): void;
    page(event: MouseEvent): { x: number; y: number };
    mBtn(event: MouseEvent): number;
    inA<T>(item: T, array: T[]): number;
    isA(obj: any): boolean;
    type(obj: any): string;
    bind(func: (...args: any[]) => any, thisObj: any, ...args: any[]): any;
  }
}

interface OverlayScrollbars {
  options(): OverlayScrollbars.Options;
  options(options: OverlayScrollbars.Options): void;
  options(optionName: string): any;
  options(optionName: string, optionValue: {} | null): void;

  update(force?: boolean): void;

  sleep(): void;

  scroll(): OverlayScrollbars.ScrollInfo;
  scroll(
    coordinates: OverlayScrollbars.Coordinates,
    duration?: number,
    easing?:
      | OverlayScrollbars.Easing
      | { x?: OverlayScrollbars.Easing; y?: OverlayScrollbars.Easing }
      | [OverlayScrollbars.Easing, OverlayScrollbars.Easing],
    complete?: (...args: any[]) => any,
  ): void;
  scroll(coordinates: OverlayScrollbars.Coordinates, options: {}): void;

  scrollStop(): OverlayScrollbars;

  getElements(): OverlayScrollbars.Elements;
  getElements(elementName: string): any;

  getState(): OverlayScrollbars.State;
  getState(stateProperty: string): any;

  destroy(): void;

  ext(): {};
  ext(extensionName: string): OverlayScrollbars.Extension;

  addExt(extensionName: string, options: {}): OverlayScrollbars.Extension;

  removeExt(extensionName: string): boolean;
}

interface OverlayScrollbarsStatic {
  (element: HTMLElement | Element, options: OverlayScrollbars.Options, extensions?: OverlayScrollbars.Extensions): OverlayScrollbars;
  (element: HTMLElement | Element | null): OverlayScrollbars | undefined;

  (elements: NodeListOf<Element> | ReadonlyArray<Element>, options: OverlayScrollbars.Options, extensions?: OverlayScrollbars.Extensions):
    | OverlayScrollbars
    | OverlayScrollbars[]
    | undefined;
  (elements: NodeListOf<Element> | ReadonlyArray<Element>, filter?: string | ((element: Element, instance: OverlayScrollbars) => boolean)):
    | OverlayScrollbars
    | OverlayScrollbars[]
    | undefined;

  globals(): OverlayScrollbars.Globals;

  defaultOptions(): OverlayScrollbars.Options;
  defaultOptions(newDefaultOptions: OverlayScrollbars.Options): void;

  extension(): {
    [index: number]: OverlayScrollbars.ExtensionInfo;
    length: number;
  };
  extension(extensionName: string): OverlayScrollbars.ExtensionInfo;
  extension(
    extensionName: string,
    extensionFactory: (
      this: OverlayScrollbars,
      defaultOptions: {},
      compatibility: OverlayScrollbars.Compatibility,
      framework: any,
    ) => OverlayScrollbars.Extension,
    defaultOptions?: {},
  ): void;
  extension(extensionName: string, extensionFactory: null | undefined): void;

  valid(osInstance: any): boolean;
}

*/
