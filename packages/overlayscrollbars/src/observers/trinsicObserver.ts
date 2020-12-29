import { WH, Cache, createDOM, offsetSize, jsAPI, runEach, prependChildren, removeElements, createCache } from 'support';
import { createSizeObserver } from 'observers/sizeObserver';

const classNameTrinsicObserver = 'os-trinsic-observer';
const IntersectionObserverConstructor = jsAPI('IntersectionObserver');

export const createTrinsicObserver = (
  target: HTMLElement,
  onTrinsicChangedCallback: (widthIntrinsic: boolean, heightIntrinsicCache: Cache<boolean>) => any
): (() => void) => {
  const trinsicObserver = createDOM(`<div class="${classNameTrinsicObserver}"></div>`)[0] as HTMLElement;
  const offListeners: (() => void)[] = [];
  const updateHeightIntrinsicCache = createCache<boolean, IntersectionObserverEntry | WH<number>>(
    (ioEntryOrSize) =>
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
            const heightIntrinsicCache = updateHeightIntrinsicCache(0, last);

            if (heightIntrinsicCache._changed) {
              onTrinsicChangedCallback(false, heightIntrinsicCache);
            }
          }
        }
      },
      { root: target }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    offListeners.push(() => intersectionObserverInstance.disconnect());
  } else {
    offListeners.push(
      createSizeObserver(trinsicObserver, () => {
        const newSize = offsetSize(trinsicObserver);
        const heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

        if (heightIntrinsicCache._changed) {
          onTrinsicChangedCallback(false, heightIntrinsicCache);
        }
      })
    );
  }

  prependChildren(target, trinsicObserver);

  return () => {
    runEach(offListeners);
    removeElements(trinsicObserver);
  };
};
