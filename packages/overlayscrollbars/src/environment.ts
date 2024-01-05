import {
  createDOM,
  addClass,
  appendChildren,
  fractionalSize,
  clientSize,
  absoluteCoordinates,
  offsetSize,
  removeAttr,
  removeElements,
  equalBCRWH,
  getBoundingClientRect,
  assignDeep,
  cssProperty,
  createCache,
  equalXY,
  createEventListenerHub,
  scrollT,
  bind,
  wnd,
  noop,
  scrollElementTo,
  strHidden,
  strOverflowX,
  strOverflowY,
  getStyles,
  setStyles,
} from '~/support';
import {
  classNameEnvironment,
  classNameEnvironmentFlexboxGlue,
  classNameEnvironmentFlexboxGlueMax,
  classNameEnvironmentScrollbarHidden,
} from '~/classnames';
import { defaultOptions } from '~/options';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '~/plugins';
import type { XY, EventListener } from '~/support';
import type { Options, PartialOptions } from '~/options';
import type { ScrollbarsHidingPlugin } from '~/plugins';
import type { Initialization, PartialInitialization } from '~/initialization';
import type { StyleObjectKey } from './typings';

type EnvironmentEventArgs = {
  r: [scrollbarSizeChanged?: boolean];
};

/**
 * Describes the OverlayScrollbars environment.
 */
export interface Environment {
  /** The native scrollbars size of the browser / system. */
  scrollbarsSize: XY<number>;
  /** Whether the native scrollbars are overlaid. */
  scrollbarsOverlaid: XY<boolean>;
  /** Whether the browser supports native scrollbars hiding. */
  scrollbarsHiding: boolean;
  /** The rtl scroll behavior of the browser. */
  rtlScrollBehavior: { n: boolean; i: boolean };
  /** Whether the browser supports all needed Flexbox features for OverlayScrollbars to work in a more performant way. */
  flexboxGlue: boolean;
  /** Whether the browser supports custom css properties. (also known as css variables) */
  cssCustomProperties: boolean;
  /** Whether the browser supports the ScrollTimeline API. */
  scrollTimeline: boolean;
  /** The default Initialization to use if nothing else is specified. */
  staticDefaultInitialization: Initialization;
  /** The default Options to use if nothing else is specified. */
  staticDefaultOptions: Options;

  /** Returns the current default Initialization. */
  getDefaultInitialization(): Initialization;
  /** Returns the current default Options. */
  getDefaultOptions(): Options;

  /**
   * Sets a new default Initialization.
   * If the new default Initialization is partially filled, its deeply merged with the current default Initialization.
   * @param newDefaultInitialization The new default Initialization.
   * @returns The current default Initialization.
   */
  setDefaultInitialization(newDefaultInitialization: PartialInitialization): Initialization;
  /**
   * Sets new default Options.
   * If the new default Options are partially filled, they're deeply merged with the current default Options.
   * @param newDefaultOptions The new default Options.
   * @returns The current default options.
   */
  setDefaultOptions(newDefaultOptions: PartialOptions): Options;
}

export interface InternalEnvironment {
  readonly _nativeScrollbarsSize: XY;
  readonly _nativeScrollbarsOverlaid: XY<boolean>;
  readonly _nativeScrollbarsHiding: boolean;
  readonly _rtlScrollBehavior: { n: boolean; i: boolean };
  readonly _flexboxGlue: boolean;
  readonly _cssCustomProperties: boolean;
  readonly _scrollTimeline: boolean;
  readonly _staticDefaultInitialization: Initialization;
  readonly _staticDefaultOptions: Options;
  _addResizeListener(listener: EventListener<EnvironmentEventArgs, 'r'>): () => void;
  _getDefaultInitialization(): Initialization;
  _setDefaultInitialization(newInitialization: PartialInitialization): Initialization;
  _getDefaultOptions(): Options;
  _setDefaultOptions(newDefaultOptions: PartialOptions): Options;
}

let environmentInstance: InternalEnvironment;

const getNativeScrollbarSize = (
  body: HTMLElement,
  measureElm: HTMLElement,
  measureElmChild: HTMLElement,
  clear?: boolean
): XY => {
  appendChildren(body, measureElm);

  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);
  const fSize = fractionalSize(measureElmChild);

  clear && removeElements(measureElm);

  return {
    x: oSize.h - cSize.h + fSize.h,
    y: oSize.w - cSize.w + fSize.w,
  };
};

const getNativeScrollbarsHiding = (testElm: HTMLElement): boolean => {
  let result = false;
  const revertClass = addClass(testElm, classNameEnvironmentScrollbarHidden);
  try {
    result =
      getStyles(testElm, cssProperty('scrollbar-width') as StyleObjectKey) === 'none' ||
      getStyles(testElm, 'display', '::-webkit-scrollbar') === 'none';
  } catch {}
  revertClass();
  return result;
};

const getRtlScrollBehavior = (
  parentElm: HTMLElement,
  childElm: HTMLElement
): { i: boolean; n: boolean } => {
  setStyles(parentElm, { [strOverflowX]: strHidden, [strOverflowY]: strHidden, direction: 'rtl' });
  scrollElementTo(parentElm, { x: 0 });

  const parentOffset = absoluteCoordinates(parentElm);
  const childOffset = absoluteCoordinates(childElm);
  scrollElementTo(parentElm, { x: -999 }); // https://github.com/KingSora/OverlayScrollbars/issues/187
  const childOffsetAfterScroll = absoluteCoordinates(childElm);
  return {
    /**
     * origin direction = determines if the zero scroll position is on the left or right side
     * 'i' means 'invert' (i === true means that the axis must be inverted to be correct)
     * true = on the left side
     * false = on the right side
     */
    i: parentOffset.x === childOffset.x,
    /**
     * negative = determines if the maximum scroll is positive or negative
     * 'n' means 'negate' (n === true means that the axis must be negated to be correct)
     * true = negative
     * false = positive
     */
    n: childOffset.x !== childOffsetAfterScroll.x,
  };
};

const getFlexboxGlue = (parentElm: HTMLElement, childElm: HTMLElement): boolean => {
  // IE11 doesn't support "flexbox glue"
  const revertFbxGlue = addClass(parentElm, classNameEnvironmentFlexboxGlue);
  const minOffsetsizeParent = getBoundingClientRect(parentElm);
  const minOffsetsize = getBoundingClientRect(childElm);
  const supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);

  const revertFbxGlueMax = addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
  const maxOffsetsizeParent = getBoundingClientRect(parentElm);
  const maxOffsetsize = getBoundingClientRect(childElm);
  const supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);

  revertFbxGlue();
  revertFbxGlueMax();

  return supportsMin && supportsMax;
};

const createEnvironment = (): InternalEnvironment => {
  const { body } = document;
  const envDOM = createDOM(`<div class="${classNameEnvironment}"><div></div></div>`);
  const envElm = envDOM[0] as HTMLElement;
  const envChildElm = envElm.firstChild as HTMLElement;
  const [addEvent, , triggerEvent] = createEventListenerHub<EnvironmentEventArgs>();
  const [updateNativeScrollbarSizeCache, getNativeScrollbarSizeCache] = createCache(
    {
      _initialValue: getNativeScrollbarSize(body, envElm, envChildElm),
      _equal: equalXY,
    },
    bind(getNativeScrollbarSize, body, envElm, envChildElm, true)
  );
  const [nativeScrollbarsSize] = getNativeScrollbarSizeCache();
  const nativeScrollbarsHiding = getNativeScrollbarsHiding(envElm);
  const nativeScrollbarsOverlaid = {
    x: nativeScrollbarsSize.x === 0,
    y: nativeScrollbarsSize.y === 0,
  };
  const staticDefaultInitialization: Initialization = {
    elements: {
      host: null,
      padding: !nativeScrollbarsHiding,
      viewport: (target) =>
        nativeScrollbarsHiding && target === target.ownerDocument.body && target,
      content: false,
    },
    scrollbars: {
      slot: true,
    },
    cancel: {
      nativeScrollbarsOverlaid: false,
      body: null,
    },
  };
  const staticDefaultOptions = assignDeep({}, defaultOptions);
  const getDefaultOptions = bind(
    assignDeep as typeof assignDeep<Options, Options>,
    {} as Options,
    staticDefaultOptions
  );
  const getDefaultInitialization = bind(
    assignDeep as typeof assignDeep<Initialization, Initialization>,
    {} as Initialization,
    staticDefaultInitialization
  );

  const env: InternalEnvironment = {
    _nativeScrollbarsSize: nativeScrollbarsSize,
    _nativeScrollbarsOverlaid: nativeScrollbarsOverlaid,
    _nativeScrollbarsHiding: nativeScrollbarsHiding,
    _cssCustomProperties: getStyles(envElm, 'zIndex') === '-1', // IE11 doesn't support css custom props
    _scrollTimeline: !!scrollT,
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
    _flexboxGlue: getFlexboxGlue(envElm, envChildElm),
    _addResizeListener: bind(addEvent, 'r'),
    _getDefaultInitialization: getDefaultInitialization,
    _setDefaultInitialization: (newInitializationStrategy) =>
      assignDeep(staticDefaultInitialization, newInitializationStrategy) &&
      getDefaultInitialization(),
    _getDefaultOptions: getDefaultOptions,
    _setDefaultOptions: (newDefaultOptions) =>
      assignDeep(staticDefaultOptions, newDefaultOptions) && getDefaultOptions(),
    _staticDefaultInitialization: assignDeep({}, staticDefaultInitialization),
    _staticDefaultOptions: assignDeep({}, staticDefaultOptions),
  };

  removeAttr(envElm, 'style');
  removeElements(envElm);

  // needed in case content has css viewport units
  wnd.addEventListener('resize', () => {
    let scrollbarSizeChanged;
    if (!nativeScrollbarsHiding && (!nativeScrollbarsOverlaid.x || !nativeScrollbarsOverlaid.y)) {
      const scrollbarsHidingPlugin = getStaticPluginModuleInstance<typeof ScrollbarsHidingPlugin>(
        scrollbarsHidingPluginName
      );
      const zoomFn = scrollbarsHidingPlugin ? scrollbarsHidingPlugin._envWindowZoom() : noop;
      scrollbarSizeChanged = !!zoomFn(env, updateNativeScrollbarSizeCache);
    }

    triggerEvent('r', [scrollbarSizeChanged]);
  });

  return env;
};

const getEnvironment = (): InternalEnvironment => {
  if (!environmentInstance) {
    environmentInstance = createEnvironment();
  }
  return environmentInstance;
};

export { getEnvironment };
