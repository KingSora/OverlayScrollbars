import { createDOM, style, appendChildren, offsetSize, scrollLeft, scrollTop, jsAPI, addClass, each } from 'support';

const animationStartEventName = 'animationstart mozAnimationStart webkitAnimationStart MSAnimationStart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const cAF = cancelAnimationFrame;
const rAF = requestAnimationFrame;

// TODO:
// 1. handling for event listeners (animationStartEventName.split(' '))
// 2. return not just element but also destruction function
// 3. shorthand handling for preventDefault & stopPropagation etc.
// 4. add test for appearance (display: none => display: block)
// 5. add functionality & tests for direction change
// 6. MAYBE add comparison function to offsetSize etc.
// 7. Create test utils (waitFor)

export const createSizeObserver = (onSizeChangedCallback: () => void) => {
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0] as HTMLElement;
  const listenerElement = sizeObserver.firstChild as HTMLElement;
  if (ResizeObserverConstructor) {
    addClass(sizeObserver, 'resize-observer');
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallback);
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
      onSizeChangedCallback();
    };
    const onScroll = (scrollEvent?: Event) => {
      currSize = offsetSize(listenerElement);
      isDirty = currSize.w !== cacheSize.w || currSize.h !== cacheSize.h;

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
    each(animationStartEventName.split(' '), (eventName) => {
      sizeObserver.addEventListener(eventName, () => {
        onScroll();
      });
    });
    // lets assume that the divs will never be that large and a constant value is enough
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
  }

  return sizeObserver;
};
