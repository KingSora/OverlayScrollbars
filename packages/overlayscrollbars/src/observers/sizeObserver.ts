import {
  createCache,
  createDOM,
  scrollLeft,
  scrollTop,
  runEachAndClear,
  removeElements,
  on,
  addClass,
  push,
  ResizeObserverConstructor,
  isArray,
  isBoolean,
  removeClass,
  isObject,
  stopPropagation,
  appendChildren,
  getDirectionIsRTL,
  domRectHasDimensions,
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
  _direction?: boolean;
  _appear?: boolean;
}

export interface SizeObserverCallbackParams {
  _sizeChanged: boolean;
  _directionIsRTLCache?: CacheValues<boolean>;
  _appear?: boolean;
}

export type SizeObserver = () => () => void;

const scrollAmount = 3333333;

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
  const { _direction: observeDirectionChange, _appear: observeAppearChange } = options || {};
  const sizeObserverPlugin = getStaticPluginModuleInstance<
    typeof sizeObserverPluginName,
    typeof SizeObserverPlugin
  >(sizeObserverPluginName);
  const { _rtlScrollBehavior: rtlScrollBehavior } = getEnvironment();
  const getIsDirectionRTL = getDirectionIsRTL.bind(0, target);
  const [updateResizeObserverContentRectCache] = createCache<DOMRectReadOnly | false>({
    _initialValue: false,
    _alwaysUpdateValues: true,
    _equal: (currVal, newVal) =>
      !(
        !currVal || // if no initial value
        // if from display: none to display: block
        (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal))
      ),
  });

  return () => {
    const destroyFns: (() => void)[] = [];
    const baseElements = createDOM(
      `<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`
    );
    const sizeObserver = baseElements[0] as HTMLElement;
    const listenerElement = sizeObserver.firstChild as HTMLElement;
    const onSizeChangedCallbackProxy = (
      sizeChangedContext?: CacheValues<boolean> | ResizeObserverEntry[] | Event | boolean
    ) => {
      const isResizeObserverCall =
        isArray(sizeChangedContext) &&
        sizeChangedContext.length > 0 &&
        isObject(sizeChangedContext[0]);

      const hasDirectionCache =
        !isResizeObserverCall && isBoolean((sizeChangedContext as CacheValues<boolean>)[0]);

      let skip = false;
      let appear: boolean | number | undefined = false;
      let doDirectionScroll = true; // always true if sizeChangedContext is Event (appear callback or RO. Polyfill)

      // if triggered from RO.
      if (isResizeObserverCall) {
        const [currRContentRect, , prevContentRect] = updateResizeObserverContentRectCache(
          (sizeChangedContext as ResizeObserverEntry[]).pop()!.contentRect
        );
        const hasDimensions = domRectHasDimensions(currRContentRect);
        const hadDimensions = domRectHasDimensions(prevContentRect);
        const firstCall = !prevContentRect;
        skip = (firstCall && !!hadDimensions) || !hasDimensions; // skip on initial RO. call (if the element visible) or if display is none
        appear = !hadDimensions && hasDimensions;

        doDirectionScroll = !skip; // direction scroll when not skipping
      }
      // else if its triggered with DirectionCache
      else if (hasDirectionCache) {
        [, doDirectionScroll] = sizeChangedContext as CacheValues<boolean>; // direction scroll when DirectionCache changed, false otherwise
      }
      // else if it triggered with appear from polyfill
      else {
        appear = sizeChangedContext === true;
      }

      if (observeDirectionChange && doDirectionScroll) {
        const rtl = hasDirectionCache
          ? (sizeChangedContext as CacheValues<boolean>)[0]
          : getDirectionIsRTL(sizeObserver);
        scrollLeft(
          sizeObserver,
          rtl
            ? rtlScrollBehavior.n
              ? -scrollAmount
              : rtlScrollBehavior.i
              ? 0
              : scrollAmount
            : scrollAmount
        );
        scrollTop(sizeObserver, scrollAmount);
      }

      if (!skip) {
        onSizeChangedCallback({
          _sizeChanged: !hasDirectionCache,
          _directionIsRTLCache: hasDirectionCache
            ? (sizeChangedContext as CacheValues<boolean>)
            : undefined,
          _appear: !!appear,
        });
      }
    };
    let appearCallback: ((...args: any) => any) | undefined | false =
      observeAppearChange && onSizeChangedCallbackProxy;

    if (ResizeObserverConstructor) {
      const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
      resizeObserverInstance.observe(listenerElement);
      push(destroyFns, () => {
        resizeObserverInstance.disconnect();
      });
    } else if (sizeObserverPlugin) {
      const [pluginAppearCallback, pluginOffListeners] = sizeObserverPlugin(
        listenerElement,
        onSizeChangedCallbackProxy,
        observeAppearChange
      );
      appearCallback = pluginAppearCallback;
      push(destroyFns, pluginOffListeners);
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
        on(sizeObserver, 'scroll', (event: Event) => {
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

    // appearCallback is always needed on scroll-observer strategy to reset it
    if (appearCallback) {
      addClass(sizeObserver, classNameSizeObserverAppear);
      push(
        destroyFns,
        on(sizeObserver, 'animationstart', appearCallback, {
          // Fire only once for "CSS is ready" event if ResizeObserver strategy is used
          _once: !!ResizeObserverConstructor,
        })
      );
    }

    if (ResizeObserverConstructor || sizeObserverPlugin) {
      appendChildren(target, sizeObserver);
    }

    return () => {
      runEachAndClear(destroyFns);
      removeElements(sizeObserver);
    };
  };
};
