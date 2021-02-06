import {
  Cache,
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
} from 'support';
import { CSSDirection } from 'typings';
import { getEnvironment } from 'environment';
import {
  classNameSizeObserver,
  classNameSizeObserverAppear,
  classNameSizeObserverListener,
  classNameSizeObserverListenerScroll,
  classNameSizeObserverListenerItem,
  classNameSizeObserverListenerItemFinal,
} from 'classnames';

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const getDirection = (elm: HTMLElement): CSSDirection => style(elm, 'direction') as CSSDirection;
const domRectHasDimensions = (rect?: DOMRectReadOnly) => rect && (rect.height > 0 || rect.width > 0);

interface SizeObserverEntry {
  contentRect: DOMRectReadOnly;
}
export type SizeObserverOptions = { _direction?: boolean; _appear?: boolean };
export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (directionCache?: Cache<CSSDirection>) => any,
  options?: SizeObserverOptions
): (() => void) => {
  const { _direction: observeDirectionChange = false, _appear: observeAppearChange = false } = options || {};
  const rtlScrollBehavior = getEnvironment()._rtlScrollBehavior;
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0] as HTMLElement;
  const listenerElement = sizeObserver.firstChild as HTMLElement;
  const updateResizeObserverContentRectCache = createCache<DOMRectReadOnly, DOMRectReadOnly>(0, {
    _alwaysUpdateValues: true,
    _equal: (currVal, newVal) =>
      !(
        !currVal || // if no initial value
        // if from display: none to display: block
        (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal))
      ),
  });
  const onSizeChangedCallbackProxy = (sizeChangedContext?: Cache<CSSDirection> | SizeObserverEntry[] | Event) => {
    const directionCacheValue = sizeChangedContext && (sizeChangedContext as Cache<CSSDirection>)._value;

    let skip: boolean = false;
    let doDirectionScroll = true; // always true if sizeChangedContext is Event

    // if triggered from RO.
    if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
      const { _previous, _value, _changed } = updateResizeObserverContentRectCache(0, sizeChangedContext.pop()!.contentRect);
      skip = !_previous || !domRectHasDimensions(_value); // skip on initial RO. call or if display is none
      doDirectionScroll = !skip && _changed; // direction scroll when not skipping and changing from display: none to block, false otherwise
    }
    // else if its triggered with DirectionCache
    else if (directionCacheValue) {
      doDirectionScroll = (sizeChangedContext as Cache<CSSDirection>)._changed; // direction scroll when DirectionCache changed, false toherwise
    }

    if (observeDirectionChange && doDirectionScroll) {
      const rtl = (directionCacheValue || getDirection(sizeObserver)) === 'rtl';
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }

    if (!skip) {
      onSizeChangedCallback(directionCacheValue ? (sizeChangedContext as Cache<CSSDirection>) : undefined);
    }
  };
  const offListeners: (() => void)[] = [];
  let appearCallback: ((...args: any) => any) | false = observeAppearChange ? onSizeChangedCallbackProxy : false;

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
    const updateDirectionCache = createCache(() => getDirection(sizeObserver));
    push(
      offListeners,
      on(sizeObserver, scrollEventName, (event: Event) => {
        const directionCache = updateDirectionCache();
        const { _value, _changed } = directionCache;
        if (_changed) {
          if (_value === 'rtl') {
            style(listenerElement, { left: 'auto', right: 0 });
          } else {
            style(listenerElement, { left: 0, right: 'auto' });
          }
          onSizeChangedCallbackProxy(directionCache);
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

  return () => {
    runEach(offListeners);
    removeElements(sizeObserver);
  };
};
