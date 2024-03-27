import {
  createDOM,
  addClass,
  appendChildren,
  fractionalSize,
  clientSize,
  absoluteCoordinates,
  offsetSize,
  removeAttrs,
  removeElements,
  assignDeep,
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
  isBodyElement,
} from '~/support';
import { classNameEnvironment, classNameEnvironmentScrollbarHidden } from '~/classnames';
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

export interface Env {
  readonly _nativeScrollbarsSize: XY;
  readonly _nativeScrollbarsOverlaid: XY<boolean>;
  readonly _nativeScrollbarsHiding: boolean;
  readonly _rtlScrollBehavior: { n: boolean; i: boolean };
  readonly _scrollTimeline: boolean;
  readonly _staticDefaultInitialization: Initialization;
  readonly _staticDefaultOptions: Options;
  _addResizeListener(listener: EventListener<EnvironmentEventArgs, 'r'>): () => void;
  _getDefaultInitialization(): Initialization;
  _setDefaultInitialization(newInitialization: PartialInitialization): Initialization;
  _getDefaultOptions(): Options;
  _setDefaultOptions(newDefaultOptions: PartialOptions): Options;
}

let environmentInstance: Env;

const createEnvironment = (): Env => {
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
        getStyles(testElm, 'scrollbar-width' as StyleObjectKey) === 'none' ||
        getStyles(testElm, 'display', '::-webkit-scrollbar') === 'none';
    } catch {}
    revertClass();
    return result;
  };

  const getRtlScrollBehavior = (
    parentElm: HTMLElement,
    childElm: HTMLElement
  ): { i: boolean; n: boolean } => {
    setStyles(parentElm, {
      [strOverflowX]: strHidden,
      [strOverflowY]: strHidden,
      direction: 'rtl',
    });
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
      viewport: (target) => nativeScrollbarsHiding && isBodyElement(target) && target,
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

  const env: Env = {
    _nativeScrollbarsSize: nativeScrollbarsSize,
    _nativeScrollbarsOverlaid: nativeScrollbarsOverlaid,
    _nativeScrollbarsHiding: nativeScrollbarsHiding,
    _scrollTimeline: !!scrollT,
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
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

  removeAttrs(envElm, 'style');
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

const getEnvironment = (): Env => {
  if (!environmentInstance) {
    environmentInstance = createEnvironment();
  }
  return environmentInstance;
};

export { getEnvironment };
