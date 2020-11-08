import { createDOM, style, appendChildren, offsetSize, scrollLeft, scrollTop, jsAPI, each, prependChildren, removeElements } from 'support';
import { Environment } from 'environment';

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const cAF = cancelAnimationFrame;
const rAF = requestAnimationFrame;
const getDirection = (elm: HTMLElement) => style(elm, 'direction');

// TODO:
// 1. handling for event listeners (animationStartEventName.split(' '))
// 2. return not just element but also destruction function
// 3. shorthand handling for preventDefault & stopPropagation etc.
// 5. MAYBE add comparison function to offsetSize etc.

export const createSizeObserver = (
  target: HTMLElement,
  onSizeChangedCallback: (direction?: boolean) => any,
  environment: Environment,
  direction?: boolean
) => {
  const rtlScrollBehavior = environment._rtlScrollBehavior;
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
  let appearCallback: (...args: any) => any = onSizeChangedCallbackProxy;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
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
      } else if (!scrollEvent) onResized();

      reset();
      if (scrollEvent) {
        scrollEvent.preventDefault();
        scrollEvent.stopPropagation();
      }
      return false;
    };

    expandElement.addEventListener(scrollEventName, onScroll);
    shrinkElement.addEventListener(scrollEventName, onScroll);

    // lets assume that the divs will never be that large and a constant value is enough
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = onScroll;
  }

  each(animationStartEventName.split(' '), (eventName) => {
    sizeObserver.addEventListener(eventName, () => {
      appearCallback();
    });
  });

  if (direction) {
    let dirCache: string | undefined;
    sizeObserver.addEventListener('scroll', (event: Event) => {
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

      event.preventDefault();
      event.stopPropagation();
      return false;
    });
  }

  prependChildren(target, sizeObserver);

  return () => {
    removeElements(sizeObserver);
  };
};
