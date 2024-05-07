import {
  createCache,
  createDOM,
  runEachAndClear,
  addEventListener,
  addClass,
  push,
  ResizeObserverConstructor,
  appendChildren,
  domRectHasDimensions,
  bind,
  noop,
  domRectAppeared,
  concat,
} from '~/support';
import {
  classNameSizeObserver,
  classNameSizeObserverAppear,
  classNameSizeObserverListener,
} from '~/classnames';
import { getStaticPluginModuleInstance, sizeObserverPluginName } from '~/plugins';
import type { SizeObserverPlugin } from '~/plugins';

export interface SizeObserverOptions {
  /** Whether appearing should be observed. */
  _appear?: boolean;
}

export interface SizeObserverCallbackParams {
  _sizeChanged: boolean;
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
  const { _appear: observeAppearChange } = options || {};
  const sizeObserverPlugin =
    getStaticPluginModuleInstance<typeof SizeObserverPlugin>(sizeObserverPluginName);
  const [updateResizeObserverContentRectCache] = createCache<DOMRectReadOnly | false>({
    _initialValue: false,
    _alwaysUpdateValues: true,
  });

  return () => {
    const destroyFns: (() => void)[] = [];
    const baseElements = createDOM(
      `<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`
    );
    const sizeObserver = baseElements[0] as HTMLElement;
    const listenerElement = sizeObserver.firstChild as HTMLElement;
    const onSizeChangedCallbackProxy = (sizeChangedContext?: ResizeObserverEntry | boolean) => {
      const isResizeObserverCall = sizeChangedContext instanceof ResizeObserverEntry;

      let skip = false;
      let appear = false;

      // if triggered from RO.
      if (isResizeObserverCall) {
        const [currRContentRect, , prevContentRect] = updateResizeObserverContentRectCache(
          sizeChangedContext.contentRect
        );
        const hasDimensions = domRectHasDimensions(currRContentRect);
        const appeared = domRectAppeared(currRContentRect, prevContentRect);
        const firstCall = !prevContentRect;
        appear = firstCall || appeared;
        skip = !appear && !hasDimensions; // skip if display is none or when window resize
      }
      // else if it triggered with appear from polyfill
      else {
        appear = sizeChangedContext === true;
      }

      if (!skip) {
        onSizeChangedCallback({
          _sizeChanged: true,
          _appear: appear,
        });
      }
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
        concat(
          [
            addClass(sizeObserver, classNameSizeObserverAppear),
            addEventListener(sizeObserver, 'animationstart', pluginAppearCallback),
          ],
          pluginDestroyFns
        )
      );
    } else {
      return noop;
    }

    return bind(runEachAndClear, push(destroyFns, appendChildren(target, sizeObserver)));
  };
};
