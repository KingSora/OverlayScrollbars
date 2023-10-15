import {
  createCache,
  createDOM,
  runEachAndClear,
  addEventListener,
  addClass,
  push,
  ResizeObserverConstructor,
  removeClass,
  stopPropagation,
  appendChildren,
  getDirectionIsRTL,
  domRectHasDimensions,
  bind,
  noop,
  isArray,
  getRTLCompatibleScrollPosition,
  scrollElementTo,
  selfClearTimeout,
  wnd,
  domRectAppeared,
} from '~/support';
import { getEnvironment } from '~/environment';
import {
  classNameSizeObserver,
  classNameSizeObserverAppear,
  classNameSizeObserverListener,
} from '~/classnames';
import { getStaticPluginModuleInstance, sizeObserverPluginName } from '~/plugins';
import type { CacheValues } from '~/support';
import type { SizeObserverPlugin } from '~/plugins';

export interface SizeObserverOptions {
  /** Whether direction changes should be observed. */
  _direction?: boolean;
  /** Whether appearing should be observed. */
  _appear?: boolean;
  /** Whether window resizes should be detected and ignored. */
  _ignoreWindowResize?: boolean;
}

export interface SizeObserverCallbackParams {
  _sizeChanged: boolean;
  _directionIsRTLCache?: CacheValues<boolean>;
  _appear?: boolean;
}

export type SizeObserver = () => () => void;

/**
 * Creates a size observer which observes any size, padding, border, margin and box-sizing changes of the target element. Depending on the options also direction and appear can be observed.
 * @param target The target element which shall be observed.
 * @param onSizeChangedCallback The callback which gets called after a size change was detected.
 * @param options The options for size detection, whether to observe also direction and appear.
 * @returns A object which represents the instance of the size observer.
 */
export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (params: SizeObserverCallbackParams) => any,
  options?: SizeObserverOptions
): SizeObserver => {
  let isWindowResize = false;
  const scrollAmount = 3333333;
  const {
    _direction: observeDirectionChange,
    _appear: observeAppearChange,
    _ignoreWindowResize,
  } = options || {};
  const sizeObserverPlugin =
    getStaticPluginModuleInstance<typeof SizeObserverPlugin>(sizeObserverPluginName);
  const { _rtlScrollBehavior: rtlScrollBehavior } = getEnvironment();
  const getIsDirectionRTL = bind(getDirectionIsRTL, target);
  const [setIsWindowResizeResetTimeout, clearIsWindowResizeResetTimeout] = selfClearTimeout(33); // assume 1000 / 30 (30fps)
  const [updateResizeObserverContentRectCache] = createCache<DOMRectReadOnly | false>({
    _initialValue: false,
    _alwaysUpdateValues: true,
  });

  return () => {
    const destroyFns: (() => void)[] = [
      clearIsWindowResizeResetTimeout,
      addEventListener(wnd, 'resize', () => {
        isWindowResize = !!_ignoreWindowResize;
        setIsWindowResizeResetTimeout(() => {
          isWindowResize = false;
        });
      }),
    ];
    const baseElements = createDOM(
      `<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`
    );
    const sizeObserver = baseElements[0] as HTMLElement;
    const listenerElement = sizeObserver.firstChild as HTMLElement;
    const onSizeChangedCallbackProxy = (
      sizeChangedContext?: CacheValues<boolean> | ResizeObserverEntry | boolean
    ) => {
      const isResizeObserverCall = sizeChangedContext instanceof ResizeObserverEntry;
      const hasDirectionCache = !isResizeObserverCall && isArray(sizeChangedContext);

      let skip = false;
      let appear = false;
      let doDirectionScroll = true; // always true if sizeChangedContext is Event (appear callback or RO. Polyfill)

      // if triggered from RO.
      if (isResizeObserverCall) {
        const [currRContentRect, , prevContentRect] = updateResizeObserverContentRectCache(
          sizeChangedContext.contentRect
        );
        const hasDimensions = domRectHasDimensions(currRContentRect);
        const appeared = domRectAppeared(currRContentRect, prevContentRect);
        const firstCall = !prevContentRect;
        appear = firstCall || appeared;
        skip = !appear && (!hasDimensions || isWindowResize); // skip if display is none or when window resize

        doDirectionScroll = !skip; // direction scroll when not skipping
      }
      // else if its triggered with DirectionCache
      else if (hasDirectionCache) {
        [, doDirectionScroll] = sizeChangedContext; // direction scroll when DirectionCache changed, false otherwise
      }
      // else if it triggered with appear from polyfill
      else {
        appear = sizeChangedContext === true;
      }

      if (observeDirectionChange && doDirectionScroll) {
        const rtl = hasDirectionCache ? sizeChangedContext[0] : getDirectionIsRTL(sizeObserver);
        scrollElementTo(sizeObserver, {
          x: getRTLCompatibleScrollPosition(scrollAmount, scrollAmount, rtl && rtlScrollBehavior),
          y: scrollAmount,
        });
      }

      if (!skip) {
        onSizeChangedCallback({
          _directionIsRTLCache: hasDirectionCache ? sizeChangedContext : undefined,
          _sizeChanged: !hasDirectionCache,
          _appear: appear,
        });
      }

      isWindowResize = false;
    };

    if (ResizeObserverConstructor) {
      const resizeObserverInstance = new ResizeObserverConstructor((entries) =>
        onSizeChangedCallbackProxy(entries.pop())
      );
      resizeObserverInstance.observe(listenerElement);
      push(destroyFns, () => {
        resizeObserverInstance.disconnect();
      });
    } else if (sizeObserverPlugin) {
      const [pluginAppearCallback, pluginDestroyFns] = sizeObserverPlugin(
        listenerElement,
        onSizeChangedCallbackProxy,
        observeAppearChange
      );
      push(
        destroyFns,
        [
          addClass(sizeObserver, classNameSizeObserverAppear),
          addEventListener(sizeObserver, 'animationstart', pluginAppearCallback),
        ].concat(pluginDestroyFns)
      );
    } else {
      return noop;
    }

    if (observeDirectionChange) {
      const [updateDirectionIsRTLCache] = createCache(
        {
          _initialValue: undefined,
        },
        getIsDirectionRTL
      );

      push(
        destroyFns,
        addEventListener(sizeObserver, 'scroll', (event) => {
          const directionIsRTLCacheValues = updateDirectionIsRTLCache();
          const [directionIsRTLCache, directionIsRTLCacheChanged, directionIsRTLCachePrevious] =
            directionIsRTLCacheValues;
          if (directionIsRTLCacheChanged) {
            removeClass(listenerElement, 'ltr rtl');
            addClass(listenerElement, directionIsRTLCache ? 'rtl' : 'ltr');

            onSizeChangedCallbackProxy([
              !!directionIsRTLCache,
              directionIsRTLCacheChanged,
              directionIsRTLCachePrevious,
            ]);
          }

          stopPropagation(event);
        })
      );
    }

    return bind(runEachAndClear, push(destroyFns, appendChildren(target, sizeObserver)));
  };
};
