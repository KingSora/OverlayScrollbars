import {
  Cache,
  CacheValues,
  createCache,
  createDOM,
  style,
  appendChildren,
  offsetSize,
  scrollLeft,
  scrollTop,
  runEach,
  prependChildren,
  removeElements,
  on,
  preventDefault,
  stopPropagation,
  addClass,
  equalWH,
  push,
  cAF,
  rAF,
  ResizeObserverConstructor,
  isArray,
  indexOf,
  each,
  isBoolean,
} from 'support';
import { getEnvironment } from 'environment';
import {
  classNameSizeObserver,
  classNameSizeObserverAppear,
  classNameSizeObserverListener,
  classNameSizeObserverListenerScroll,
  classNameSizeObserverListenerItem,
  classNameSizeObserverListenerItemFinal,
} from 'classnames';

interface SizeObserverEntry {
  contentRect: DOMRectReadOnly;
}

export type SizeObserverOptions = { _direction?: boolean; _appear?: boolean };

export interface SizeObserver {
  _destroy(): void;
  _getCurrentCacheValues(
    force?: boolean
  ): {
    _directionIsRTL: CacheValues<boolean>;
  };
}

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const directionIsRTLMap = {
  direction: ['rtl'],
  // 'writing-mode': ['sideways-rl', 'tb', 'tb-rl', 'vertical-rl'],
};
const directionIsRTL = (elm: HTMLElement): boolean => {
  let isRTL = false;
  const styles = style(elm, ['direction' /* , 'writing-mode' */]);
  each(styles, (value, key) => {
    isRTL = isRTL || indexOf(directionIsRTLMap[key], value) > -1;
  });
  return isRTL;
};
const domRectHasDimensions = (rect?: DOMRectReadOnly) => rect && (rect.height || rect.width);

export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (directionIsRTLCache?: CacheValues<boolean>) => any,
  options?: SizeObserverOptions
): SizeObserver => {
  const { _direction: observeDirectionChange = false, _appear: observeAppearChange = false } = options || {};
  const { _rtlScrollBehavior: rtlScrollBehavior } = getEnvironment();
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0] as HTMLElement;
  const listenerElement = sizeObserver.firstChild as HTMLElement;
  const { _update: updateResizeObserverContentRectCache } = createCache<DOMRectReadOnly, DOMRectReadOnly>(0, {
    _alwaysUpdateValues: true,
    _equal: (currVal, newVal) =>
      !(
        !currVal || // if no initial value
        // if from display: none to display: block
        (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal))
      ),
  });
  const onSizeChangedCallbackProxy = (sizeChangedContext?: CacheValues<boolean> | SizeObserverEntry[] | Event) => {
    const hasDirectionCache = sizeChangedContext && isBoolean((sizeChangedContext as CacheValues<boolean>)._value);

    let skip = false;
    let doDirectionScroll = true; // always true if sizeChangedContext is Event (appear callback or RO. Polyfill)

    // if triggered from RO.
    if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
      const { _previous, _value, _changed } = updateResizeObserverContentRectCache(0, sizeChangedContext.pop()!.contentRect);
      skip = !_previous || !domRectHasDimensions(_value); // skip on initial RO. call or if display is none
      doDirectionScroll = !skip && _changed; // direction scroll when not skipping and changing from display: none to block, false otherwise
    }
    // else if its triggered with DirectionCache
    else if (hasDirectionCache) {
      doDirectionScroll = (sizeChangedContext as CacheValues<boolean>)._changed; // direction scroll when DirectionCache changed, false toherwise
    }

    if (observeDirectionChange) {
      const rtl = hasDirectionCache ? (sizeChangedContext as CacheValues<boolean>)._value : directionIsRTL(sizeObserver);
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }

    if (!skip) {
      onSizeChangedCallback(hasDirectionCache ? (sizeChangedContext as CacheValues<boolean>) : undefined);
    }
  };
  const offListeners: (() => void)[] = [];
  let appearCallback: ((...args: any) => any) | false = observeAppearChange ? onSizeChangedCallbackProxy : false;
  let directionIsRTLCache: Cache<boolean> | undefined;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    push(offListeners, () => resizeObserverInstance.disconnect());
  } else {
    const observerElementChildren = createDOM(
      `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
    );
    appendChildren(listenerElement, observerElementChildren);
    addClass(listenerElement, classNameSizeObserverListenerScroll);
    const observerElementChildrenRoot = observerElementChildren[0] as HTMLElement;
    const shrinkElement = observerElementChildrenRoot.lastChild as HTMLElement;
    const expandElement = observerElementChildrenRoot.firstChild as HTMLElement;
    const expandElementChild = expandElement?.firstChild as HTMLElement;

    let cacheSize = offsetSize(listenerElement);
    let currSize = cacheSize;
    let isDirty = false;
    let rAFId: number;

    const reset = () => {
      scrollLeft(expandElement, scrollAmount);
      scrollTop(expandElement, scrollAmount);
      scrollLeft(shrinkElement, scrollAmount);
      scrollTop(shrinkElement, scrollAmount);
    };
    const onResized = () => {
      rAFId = 0;
      if (isDirty) {
        cacheSize = currSize;
        onSizeChangedCallbackProxy();
      }
    };
    const onScroll = (scrollEvent?: Event) => {
      currSize = offsetSize(listenerElement);
      isDirty = !scrollEvent || !equalWH(currSize, cacheSize);

      if (scrollEvent && isDirty && !rAFId) {
        cAF!(rAFId);
        rAFId = rAF!(onResized);
      } else if (!scrollEvent) {
        onResized();
      }

      reset();

      if (scrollEvent) {
        preventDefault(scrollEvent);
        stopPropagation(scrollEvent);
      }
      return false;
    };

    push(offListeners, [on(expandElement, scrollEventName, onScroll), on(shrinkElement, scrollEventName, onScroll)]);

    // lets assume that the divs will never be that large and a constant value is enough
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = observeAppearChange ? () => onScroll() : reset;
  }

  if (observeDirectionChange) {
    directionIsRTLCache = createCache(() => directionIsRTL(sizeObserver));
    const { _update: updateDirectionIsRTLCache } = directionIsRTLCache;
    push(
      offListeners,
      on(sizeObserver, scrollEventName, (event: Event) => {
        const directionIsRTLCacheValues = updateDirectionIsRTLCache();
        const { _value, _changed } = directionIsRTLCacheValues;
        if (_changed) {
          if (_value) {
            style(listenerElement, { left: 'auto', right: 0 });
          } else {
            style(listenerElement, { left: 0, right: 'auto' });
          }
          onSizeChangedCallbackProxy(directionIsRTLCacheValues);
        }

        preventDefault(event);
        stopPropagation(event);
        return false;
      })
    );
  }

  // appearCallback is always needed on scroll-observer strategy to reset it
  if (appearCallback) {
    addClass(sizeObserver, classNameSizeObserverAppear);
    push(
      offListeners,
      on(sizeObserver, animationStartEventName, appearCallback, {
        // Fire only once for "CSS is ready" event if ResizeObserver strategy is used
        _once: !!ResizeObserverConstructor,
      })
    );
  }

  prependChildren(target, sizeObserver);

  return {
    _destroy() {
      runEach(offListeners);
      removeElements(sizeObserver);
    },
    _getCurrentCacheValues(force?: boolean) {
      return {
        _directionIsRTL: directionIsRTLCache
          ? directionIsRTLCache._current(force)
          : {
              _value: false,
              _previous: false,
              _changed: false,
            },
      };
    },
  };
};
