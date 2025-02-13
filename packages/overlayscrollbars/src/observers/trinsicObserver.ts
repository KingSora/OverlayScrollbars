import type { WH, CacheValues } from '../support';
import { createSizeObserver } from './sizeObserver';
import { classNameTrinsicObserver } from '../classnames';
import {
  createDiv,
  getOffsetSize,
  runEachAndClear,
  createCache,
  push,
  IntersectionObserverConstructor,
  appendChildren,
  bind,
} from '../support';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrinsicObserverCallback = (heightIntrinsic: CacheValues<boolean>) => any;
export type TrinsicObserver = [
  construct: () => () => void,
  update: () => void | false | null | undefined | Parameters<TrinsicObserverCallback>,
];

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
  const isHeightIntrinsic = (ioEntryOrSize: IntersectionObserverEntry | WH<number>): boolean =>
    (ioEntryOrSize as WH<number>).h === 0 ||
    (ioEntryOrSize as IntersectionObserverEntry).isIntersecting ||
    (ioEntryOrSize as IntersectionObserverEntry).intersectionRatio > 0;
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const [updateHeightIntrinsicCache] = createCache({
    _initialValue: false,
  });
  const triggerOnTrinsicChangedCallback = (
    updateValue: IntersectionObserverEntry | WH<number> | undefined,
    fromRecords?: boolean
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
  const intersectionObserverCallback = (
    fromRecords: boolean,
    entries: IntersectionObserverEntry[]
  ) => triggerOnTrinsicChangedCallback(entries.pop(), fromRecords);

  return [
    () => {
      const destroyFns: (() => void)[] = [];

      if (IntersectionObserverConstructor) {
        intersectionObserverInstance = new IntersectionObserverConstructor(
          bind(intersectionObserverCallback, false),
          { root: target }
        );
        intersectionObserverInstance.observe(trinsicObserver);
        push(destroyFns, () => {
          intersectionObserverInstance!.disconnect();
        });
      } else {
        const onSizeChanged = () => {
          const newSize = getOffsetSize(trinsicObserver);
          triggerOnTrinsicChangedCallback(newSize);
        };
        push(destroyFns, createSizeObserver(trinsicObserver, onSizeChanged)());
        onSizeChanged();
      }

      return bind(runEachAndClear, push(destroyFns, appendChildren(target, trinsicObserver)));
    },
    () =>
      intersectionObserverInstance &&
      intersectionObserverCallback(true, intersectionObserverInstance.takeRecords()),
  ];
};
