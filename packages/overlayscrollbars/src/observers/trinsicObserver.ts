import {
  WH,
  CacheValues,
  createDiv,
  offsetSize,
  runEachAndClear,
  removeElements,
  createCache,
  push,
  IntersectionObserverConstructor,
  appendChildren,
} from 'support';
import { createSizeObserver } from 'observers/sizeObserver';
import { classNameTrinsicObserver } from 'classnames';

export type TrinsicObserverCallback = (heightIntrinsic: CacheValues<boolean>) => any;
export type TrinsicObserver = [
  destroy: () => void,
  append: () => void,
  update: () => void | Parameters<TrinsicObserverCallback>
];

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
  onTrinsicChangedCallback: TrinsicObserverCallback
): TrinsicObserver => {
  let intersectionObserverInstance: undefined | IntersectionObserver;
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const offListeners: (() => void)[] = [];
  const [updateHeightIntrinsicCache] = createCache({
    _initialValue: false,
  });
  const triggerOnTrinsicChangedCallback = (
    updateValue?: IntersectionObserverEntry | WH<number>,
    fromRecords?: true
  ): void | Parameters<TrinsicObserverCallback> => {
    if (updateValue) {
      const heightIntrinsic = updateHeightIntrinsicCache(isHeightIntrinsic(updateValue));
      const [, heightIntrinsicChanged] = heightIntrinsic;

      if (heightIntrinsicChanged) {
        !fromRecords && onTrinsicChangedCallback(heightIntrinsic);
        return [heightIntrinsic];
      }
    }
  };
  const intersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
    fromRecords?: true
  ) => {
    if (entries && entries.length > 0) {
      return triggerOnTrinsicChangedCallback(entries.pop(), fromRecords);
    }
  };

  return [
    () => {
      runEachAndClear(offListeners);
      removeElements(trinsicObserver);
    },
    () => {
      if (IntersectionObserverConstructor) {
        intersectionObserverInstance = new IntersectionObserverConstructor(
          (entries) => intersectionObserverCallback(entries),
          { root: target }
        );
        intersectionObserverInstance.observe(trinsicObserver);
        push(offListeners, () => {
          intersectionObserverInstance!.disconnect();
        });
      } else {
        const onSizeChanged = () => {
          const newSize = offsetSize(trinsicObserver);
          triggerOnTrinsicChangedCallback(newSize);
        };
        const [destroySizeObserver, appendSizeObserver] = createSizeObserver(
          trinsicObserver,
          onSizeChanged
        );
        push(offListeners, destroySizeObserver);
        appendSizeObserver();
        onSizeChanged();
      }

      appendChildren(target, trinsicObserver);
    },
    () => {
      if (intersectionObserverInstance) {
        return intersectionObserverCallback(intersectionObserverInstance.takeRecords(), true);
      }
    },
  ];
};
