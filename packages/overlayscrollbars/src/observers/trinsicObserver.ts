import {
  createDiv,
  offsetSize,
  runEachAndClear,
  removeElements,
  createCache,
  push,
  IntersectionObserverConstructor,
  appendChildren,
} from '~/support';
import { createSizeObserver } from '~/observers/sizeObserver';
import { classNameTrinsicObserver } from '~/classnames';
import type { WH, CacheValues } from '~/support';

export type TrinsicObserverCallback = (heightIntrinsic: CacheValues<boolean>) => any;
export type TrinsicObserver = [
  construct: () => () => void,
  update: () => void | false | null | undefined | Parameters<TrinsicObserverCallback>
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
      return (
        heightIntrinsicChanged &&
        !fromRecords &&
        onTrinsicChangedCallback(heightIntrinsic) && [heightIntrinsic]
      );
    }
  };
  const intersectionObserverCallback = (entries: IntersectionObserverEntry[], fromRecords?: true) =>
    entries && entries.length > 0 && triggerOnTrinsicChangedCallback(entries.pop(), fromRecords);

  return [
    () => {
      const destroyFns: (() => void)[] = [];

      if (IntersectionObserverConstructor) {
        intersectionObserverInstance = new IntersectionObserverConstructor(
          (entries) => intersectionObserverCallback(entries),
          { root: target }
        );
        intersectionObserverInstance.observe(trinsicObserver);
        push(destroyFns, () => {
          intersectionObserverInstance!.disconnect();
        });
      } else {
        const onSizeChanged = () => {
          const newSize = offsetSize(trinsicObserver);
          triggerOnTrinsicChangedCallback(newSize);
        };
        const constructSizeObserver = createSizeObserver(trinsicObserver, onSizeChanged);
        push(destroyFns, constructSizeObserver());
        onSizeChanged();
      }

      appendChildren(target, trinsicObserver);

      return () => {
        runEachAndClear(destroyFns);
        removeElements(trinsicObserver);
      };
    },
    () =>
      intersectionObserverInstance &&
      intersectionObserverCallback(intersectionObserverInstance.takeRecords(), true),
  ];
};
