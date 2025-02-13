/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StaticPlugin } from '../plugins';
import {
  createDOM,
  appendChildren,
  getOffsetSize,
  addEventListener,
  addClass,
  equalWH,
  cAF,
  rAF,
  stopPropagation,
  bind,
  scrollElementTo,
  strWidth,
  strHeight,
  setStyles,
} from '../../support';
import {
  classNameSizeObserverListenerScroll,
  classNameSizeObserverListenerItem,
  classNameSizeObserverListenerItemFinal,
} from '../../classnames';

export const sizeObserverPluginName = '__osSizeObserverPlugin';

export const SizeObserverPlugin = /* @__PURE__ */ (() => ({
  [sizeObserverPluginName]: {
    static:
      () =>
      (
        listenerElement: HTMLElement,
        onSizeChangedCallback: (appear: boolean) => any,
        observeAppearChange: boolean | null | undefined
      ): [appearCallback: () => void, offFns: (() => any)[]] => {
        const scrollAmount = 3333333;
        const scrollEventName = 'scroll';
        const observerElementChildren = createDOM(
          `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
        );
        const observerElementChildrenRoot = observerElementChildren[0] as HTMLElement;
        const shrinkElement = observerElementChildrenRoot.lastChild as HTMLElement;
        const expandElement = observerElementChildrenRoot.firstChild as HTMLElement;
        const expandElementChild = expandElement?.firstChild as HTMLElement;

        let cacheSize = getOffsetSize(observerElementChildrenRoot);
        let currSize = cacheSize;
        let isDirty = false;
        let rAFId: number;

        const reset = () => {
          scrollElementTo(expandElement, scrollAmount);
          scrollElementTo(shrinkElement, scrollAmount);
        };
        const onResized = (appear?: unknown) => {
          rAFId = 0;
          if (isDirty) {
            cacheSize = currSize;
            onSizeChangedCallback(appear === true);
          }
        };
        const onScroll = (scrollEvent?: Event | false) => {
          currSize = getOffsetSize(observerElementChildrenRoot);
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
        const destroyFns = [
          appendChildren(listenerElement, observerElementChildren),
          addEventListener(expandElement, scrollEventName, onScroll),
          addEventListener(shrinkElement, scrollEventName, onScroll),
        ];

        addClass(listenerElement, classNameSizeObserverListenerScroll);

        // lets assume that the divs will never be that large and a constant value is enough
        setStyles(expandElementChild, {
          [strWidth]: scrollAmount,
          [strHeight]: scrollAmount,
        });

        rAF!(reset);

        return [observeAppearChange ? bind(onScroll, false) : reset, destroyFns];
      },
  },
}))() satisfies StaticPlugin<typeof sizeObserverPluginName>;
