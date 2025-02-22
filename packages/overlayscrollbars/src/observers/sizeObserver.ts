import type { SizeObserverPlugin } from '../plugins';
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
  debounce,
  isBoolean,
} from '../support';
import {
  classNameSizeObserver,
  classNameSizeObserverAppear,
  classNameSizeObserverListener,
} from '../classnames';
import { getStaticPluginModuleInstance, sizeObserverPluginName } from '../plugins';

export interface SizeObserverOptions {
  /** Whether appearing should be observed. */
  _appear?: boolean;
}

export interface SizeObserverCallbackParams {
  _sizeChanged: boolean;
  _appear?: boolean;
}

export type SizeObserver = () => () => void;

let resizeObserverBoxSupport: boolean | null = null;

/**
 * Creates a size observer which observes any size, padding, border, margin and box-sizing changes of the target element. Depending on the options also direction and appear can be observed.
 * @param target The target element which shall be observed.
 * @param onSizeChangedCallback The callback which gets called after a size change was detected.
 * @param options The options for size detection, whether to observe also direction and appear.
 * @returns A object which represents the instance of the size observer.
 */
export const createSizeObserver = (
  target: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const polyfillElements = createDOM(
      `<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`
    );
    const polyfillRootElement = polyfillElements[0] as HTMLElement;
    const polyfillTargetElement = polyfillRootElement.firstChild as HTMLElement;

    const onSizeChangedCallbackProxy = (sizeChangedContext?: ResizeObserverEntry | boolean) => {
      const isResizeObserverCall = sizeChangedContext instanceof ResizeObserverEntry;

      let skip = false;
      let appear = false;

      // if triggered from RO.
      if (isResizeObserverCall) {
        const [currContentRect, , prevContentRect] = updateResizeObserverContentRectCache(
          sizeChangedContext.contentRect
        );
        const hasDimensions = domRectHasDimensions(currContentRect);
        appear = domRectAppeared(currContentRect, prevContentRect);
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
      if (!isBoolean(resizeObserverBoxSupport)) {
        const dummyObserver = new ResizeObserverConstructor(noop);
        dummyObserver.observe(target, {
          get box() {
            resizeObserverBoxSupport = true;
            return undefined;
          },
        });
        resizeObserverBoxSupport = resizeObserverBoxSupport || false;
        dummyObserver.disconnect();
      }

      const debouncedOnSizeChangedCallbackProxy = debounce(onSizeChangedCallbackProxy, {
        _timeout: 0,
        _maxDelay: 0,
      });
      const resizeObserverCallback = (entries: ResizeObserverEntry[]) =>
        debouncedOnSizeChangedCallbackProxy(entries.pop());
      const contentBoxResizeObserver = new ResizeObserverConstructor(resizeObserverCallback);
      contentBoxResizeObserver.observe(resizeObserverBoxSupport ? target : polyfillTargetElement);

      push(destroyFns, [
        () => contentBoxResizeObserver.disconnect(),
        !resizeObserverBoxSupport && appendChildren(target, polyfillRootElement),
      ]);

      if (resizeObserverBoxSupport) {
        const borderBoxResizeObserver = new ResizeObserverConstructor(resizeObserverCallback);
        borderBoxResizeObserver.observe(target, {
          box: 'border-box',
        });
        push(destroyFns, () => borderBoxResizeObserver.disconnect());
      }
    } else if (sizeObserverPlugin) {
      const [pluginAppearCallback, pluginDestroyFns] = sizeObserverPlugin(
        polyfillTargetElement,
        onSizeChangedCallbackProxy,
        observeAppearChange
      );
      push(
        destroyFns,
        concat(
          [
            addClass(polyfillRootElement, classNameSizeObserverAppear),
            addEventListener(polyfillRootElement, 'animationstart', pluginAppearCallback),
            appendChildren(target, polyfillRootElement),
          ],
          pluginDestroyFns
        )
      );
    } else {
      return noop;
    }

    return bind(runEachAndClear, destroyFns);
  };
};
