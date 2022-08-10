import {
  createDOM,
  style,
  appendChildren,
  offsetSize,
  scrollLeft,
  scrollTop,
  on,
  addClass,
  equalWH,
  push,
  cAF,
  rAF,
  stopPropagation,
} from 'support';
import {
  classNameSizeObserverListenerScroll,
  classNameSizeObserverListenerItem,
  classNameSizeObserverListenerItemFinal,
} from 'classnames';
import type { Plugin } from 'plugins';

export type SizeObserverPluginInstance = {
  _: (
    listenerElement: HTMLElement,
    onSizeChangedCallback: (appear: boolean) => any,
    observeAppearChange: boolean
  ) => [appearCallback: () => any, offFns: (() => any)[]];
};

const scrollAmount = 3333333;
const scrollEventName = 'scroll';
export const sizeObserverPluginName = '__osSizeObserverPlugin';

export const sizeObserverPlugin: Plugin<SizeObserverPluginInstance> = /* @__PURE__ */ (() => ({
  [sizeObserverPluginName]: {
    _: (listenerElement, onSizeChangedCallback, observeAppearChange) => {
      const observerElementChildren = createDOM(
        `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
      );
      appendChildren(listenerElement, observerElementChildren);
      addClass(listenerElement, classNameSizeObserverListenerScroll);
      const observerElementChildrenRoot = observerElementChildren[0] as HTMLElement;
      const shrinkElement = observerElementChildrenRoot.lastChild as HTMLElement;
      const expandElement = observerElementChildrenRoot.firstChild as HTMLElement;
      const expandElementChild = expandElement?.firstChild as HTMLElement;

      let cacheSize = offsetSize(observerElementChildrenRoot);
      let currSize = cacheSize;
      let isDirty = false;
      let rAFId: number;

      const reset = () => {
        scrollLeft(expandElement, scrollAmount);
        scrollTop(expandElement, scrollAmount);
        scrollLeft(shrinkElement, scrollAmount);
        scrollTop(shrinkElement, scrollAmount);
      };
      const onResized = (appear?: unknown) => {
        rAFId = 0;
        if (isDirty) {
          cacheSize = currSize;
          onSizeChangedCallback(appear === true);
        }
      };
      const onScroll = (scrollEvent?: Event | false) => {
        currSize = offsetSize(observerElementChildrenRoot);
        isDirty = !scrollEvent || !equalWH(currSize, cacheSize);

        if (scrollEvent) {
          stopPropagation(scrollEvent);

          if (isDirty && !rAFId) {
            cAF!(rAFId);
            rAFId = rAF!(onResized);
          }
        } else {
          onResized(scrollEvent === false);
        }

        reset();
      };
      const offListeners = push(
        [],
        [on(expandElement, scrollEventName, onScroll), on(shrinkElement, scrollEventName, onScroll)]
      );

      // lets assume that the divs will never be that large and a constant value is enough
      style(expandElementChild, {
        width: scrollAmount,
        height: scrollAmount,
      });

      rAF!(reset);

      return [observeAppearChange ? onScroll.bind(0, false) : reset, offListeners];
    },
  },
}))();
