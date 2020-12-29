import {
  Cache,
  createCache,
  createDOM,
  style,
  appendChildren,
  offsetSize,
  scrollLeft,
  scrollTop,
  jsAPI,
  runEach,
  prependChildren,
  removeElements,
  on,
  preventDefault,
  stopPropagation,
  addClass,
  isString,
  equalWH,
} from 'support';
import { CSSDirection } from 'typings';
import { getEnvironment } from 'environment';

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerScroll = `${classNameSizeObserverListener}-scroll`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const cAF = cancelAnimationFrame;
const rAF = requestAnimationFrame;
const getDirection = (elm: HTMLElement): CSSDirection => style(elm, 'direction') as CSSDirection;

export type SizeObserverOptions = { _direction?: boolean; _appear?: boolean };
export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (directionCache?: Cache<CSSDirection>) => any,
  options?: SizeObserverOptions
): (() => void) => {
  const { _direction: direction = false, _appear: appear = false } = options || {};
  const rtlScrollBehavior = getEnvironment()._rtlScrollBehavior;
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0] as HTMLElement;
  const listenerElement = sizeObserver.firstChild as HTMLElement;
  const onSizeChangedCallbackProxy = (directionCache?: Cache<CSSDirection>) => {
    if (direction) {
      const rtl = getDirection(sizeObserver) === 'rtl';
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }
    onSizeChangedCallback(isString((directionCache || {})._value) ? directionCache : undefined);
  };
  const offListeners: (() => void)[] = [];
  let appearCallback: ((...args: any) => any) | null = appear ? onSizeChangedCallbackProxy : null;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    offListeners.push(() => resizeObserverInstance.disconnect());
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
        cAF(rAFId);
        rAFId = rAF(onResized);
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

    offListeners.push(on(expandElement, scrollEventName, onScroll));
    offListeners.push(on(shrinkElement, scrollEventName, onScroll));

    // lets assume that the divs will never be that large and a constant value is enough
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = appear ? () => onScroll() : reset;
  }

  if (direction) {
    const updateDirectionCache = createCache(() => getDirection(sizeObserver));
    offListeners.push(
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
    offListeners.push(on(sizeObserver, animationStartEventName, appearCallback));
  }

  prependChildren(target, sizeObserver);

  return () => {
    runEach(offListeners);
    removeElements(sizeObserver);
  };
};
