import {
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
} from 'support';
import { getEnvironment } from 'environment';

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const cAF = cancelAnimationFrame;
const rAF = requestAnimationFrame;
const getDirection = (elm: HTMLElement) => style(elm, 'direction');

// TODO:
// 1. MAYBE add comparison function to offsetSize etc.

export type SizeObserverOptions = { _direction?: boolean; _appear?: boolean };
export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (direction?: boolean) => any,
  options?: SizeObserverOptions
): (() => void) => {
  const { _direction: direction = false, _appear: appear = false } = options || {};
  const rtlScrollBehavior = getEnvironment()._rtlScrollBehavior;
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0] as HTMLElement;
  const listenerElement = sizeObserver.firstChild as HTMLElement;
  const onSizeChangedCallbackProxy = (dir?: boolean) => {
    if (direction) {
      const rtl = getDirection(sizeObserver) === 'rtl';
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }
    onSizeChangedCallback(dir === true);
  };
  const offListeners: (() => void)[] = [];
  let appearCallback: (...args: any) => any = onSizeChangedCallbackProxy;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    offListeners.push(() => resizeObserverInstance.disconnect());
  } else {
    const observerElementChildren = createDOM(
      `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
    );
    appendChildren(listenerElement, observerElementChildren);
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
    const onResized = function () {
      rAFId = 0;
      if (!isDirty) return;

      cacheSize = currSize;
      onSizeChangedCallbackProxy();
    };
    const onScroll = (scrollEvent?: Event) => {
      currSize = offsetSize(listenerElement);
      isDirty = !scrollEvent || currSize.w !== cacheSize.w || currSize.h !== cacheSize.h;

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
    appearCallback = onScroll;
  }

  if (direction) {
    let dirCache: string | undefined;
    offListeners.push(
      on(sizeObserver, scrollEventName, (event: Event) => {
        const dir = getDirection(sizeObserver);
        const changed = dir !== dirCache;
        if (changed) {
          if (dir === 'rtl') {
            style(listenerElement, { left: 'auto', right: 0 });
          } else {
            style(listenerElement, { left: 0, right: 'auto' });
          }
          dirCache = dir;
          onSizeChangedCallbackProxy(true);
        }

        preventDefault(event);
        stopPropagation(event);
        return false;
      })
    );
  }

  if (appear) {
    addClass(sizeObserver, classNameSizeObserverAppear);
    offListeners.push(on(sizeObserver, animationStartEventName, appearCallback));
  }

  prependChildren(target, sizeObserver);

  return () => {
    runEach(offListeners);
    removeElements(sizeObserver);
  };
};
