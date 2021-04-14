import {
  WH,
  CacheValues,
  createDiv,
  offsetSize,
  runEach,
  prependChildren,
  removeElements,
  createCache,
  push,
  IntersectionObserverConstructor,
} from 'support';
import { createSizeObserver } from 'observers/sizeObserver';
import { classNameTrinsicObserver } from 'classnames';

export interface TrinsicObserver {
  _destroy(): void;
  _getCurrentCacheValues(
    force?: boolean
  ): {
    _heightIntrinsic: CacheValues<boolean>;
  };
}

export const createTrinsicObserver = (
  target: HTMLElement,
  onTrinsicChangedCallback: (heightIntrinsic: CacheValues<boolean>) => any
): TrinsicObserver => {
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const offListeners: (() => void)[] = [];
  const { _update: updateHeightIntrinsicCache, _current: getCurrentHeightIntrinsicCache } = createCache<
    boolean,
    IntersectionObserverEntry | WH<number>
  >(
    (ioEntryOrSize: IntersectionObserverEntry | WH<number>) =>
      (ioEntryOrSize! as WH<number>).h === 0 ||
      (ioEntryOrSize! as IntersectionObserverEntry).isIntersecting ||
      (ioEntryOrSize! as IntersectionObserverEntry).intersectionRatio > 0,
    {
      _initialValue: false,
    }
  );

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance: IntersectionObserver = new IntersectionObserverConstructor(
      (entries: IntersectionObserverEntry[]) => {
        if (entries && entries.length > 0) {
          const last = entries.pop();
          if (last) {
            const heightIntrinsic = updateHeightIntrinsicCache(0, last);

            if (heightIntrinsic._changed) {
              onTrinsicChangedCallback(heightIntrinsic);
            }
          }
        }
      },
      { root: target }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    push(offListeners, () => intersectionObserverInstance.disconnect());
  } else {
    const onSizeChanged = () => {
      const newSize = offsetSize(trinsicObserver);
      const heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);
      if (heightIntrinsicCache._changed) {
        onTrinsicChangedCallback(heightIntrinsicCache);
      }
    };
    push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged)._destroy);
    onSizeChanged();
  }

  prependChildren(target, trinsicObserver);

  return {
    _destroy() {
      runEach(offListeners);
      removeElements(trinsicObserver);
    },
    _getCurrentCacheValues(force?: boolean) {
      return {
        _heightIntrinsic: getCurrentHeightIntrinsicCache(force),
      };
    },
  };
};
