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

export type DestroyTrinsicObserver = () => void;

const isHeightIntrinsic = (ioEntryOrSize: IntersectionObserverEntry | WH<number>): boolean =>
  (ioEntryOrSize as WH<number>).h === 0 ||
  (ioEntryOrSize as IntersectionObserverEntry).isIntersecting ||
  (ioEntryOrSize as IntersectionObserverEntry).intersectionRatio > 0;

/**
 * Creates a trinsic observer which observes changes to intrinsic or extrinsic sizing for the height of the target element.
 * @param target The element which shall be observed.
 * @param onTrinsicChangedCallback The callback which gets called after a change was detected.
 * @returns A object which represents the instance of the trinsic observer.
 */
export const createTrinsicObserver = (
  target: HTMLElement,
  onTrinsicChangedCallback: (heightIntrinsic: CacheValues<boolean>) => any
): DestroyTrinsicObserver => {
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const offListeners: (() => void)[] = [];
  const [updateHeightIntrinsicCache] = createCache({
    _initialValue: false,
  });

  const triggerOnTrinsicChangedCallback = (
    updateValue?: IntersectionObserverEntry | WH<number>
  ) => {
    if (updateValue) {
      const heightIntrinsic = updateHeightIntrinsicCache(isHeightIntrinsic(updateValue));
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
    push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged));
    onSizeChanged();
  }

  prependChildren(target, trinsicObserver);

  return () => {
    runEach(offListeners);
    removeElements(trinsicObserver);
  };
};
