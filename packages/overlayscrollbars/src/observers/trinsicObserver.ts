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

/**
 * Creates a trinsic observer which observes changes to intrinsic or extrinsic sizing for the height of the target element.
 * @param target The element which shall be observed.
 * @param onTrinsicChangedCallback The callback which gets called after a change was detected.
 * @returns A object which represents the instance of the trinsic observer.
 */
export const createTrinsicObserver = (
  target: HTMLElement,
  onTrinsicChangedCallback: (heightIntrinsic: CacheValues<boolean>) => any
): TrinsicObserver => {
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const offListeners: (() => void)[] = [];
  const [updateHeightIntrinsicCache, getCurrentHeightIntrinsicCache] = createCache<
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

  const triggerOnTrinsicChangedCallback = (
    updateValue?: IntersectionObserverEntry | WH<number>
  ) => {
    if (updateValue) {
      const heightIntrinsic = updateHeightIntrinsicCache(0, updateValue);
      const [, heightIntrinsicChanged] = heightIntrinsic;

      if (heightIntrinsicChanged) {
        onTrinsicChangedCallback(heightIntrinsic);
      }
    }
  };

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance: IntersectionObserver = new IntersectionObserverConstructor(
      (entries: IntersectionObserverEntry[]) => {
        if (entries && entries.length > 0) {
          triggerOnTrinsicChangedCallback(entries.pop());
        }
      },
      { root: target }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    push(offListeners, () => {
      intersectionObserverInstance.disconnect();
    });
  } else {
    const onSizeChanged = () => {
      const newSize = offsetSize(trinsicObserver);
      triggerOnTrinsicChangedCallback(newSize);
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
