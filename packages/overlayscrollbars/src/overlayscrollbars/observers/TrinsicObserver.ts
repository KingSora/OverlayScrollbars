import { createDOM, offsetSize, jsAPI, runEach, prependChildren, removeElements } from 'support';
import { createSizeObserver } from 'overlayscrollbars/observers/SizeObserver';

const classNameTrinsicObserver = 'os-trinsic-observer';
const IntersectionObserverConstructor = jsAPI('IntersectionObserver');

export const createTrinsicObserver = (
  target: HTMLElement,
  onTrinsicChangedCallback: (widthIntrinsic: boolean, heightIntrinsic: boolean) => any
): (() => void) => {
  const trinsicObserver = createDOM(`<div class="${classNameTrinsicObserver}"></div>`)[0] as HTMLElement;
  const offListeners: (() => void)[] = [];
  let heightIntrinsic = false;

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance: IntersectionObserver = new IntersectionObserverConstructor(
      (entries: IntersectionObserverEntry[]) => {
        if (entries && entries.length > 0) {
          const last = entries.pop();
          if (last) {
            const newHeightIntrinsic = last.isIntersecting || last.intersectionRatio > 0;

            if (newHeightIntrinsic !== heightIntrinsic) {
              onTrinsicChangedCallback(false, newHeightIntrinsic);
              heightIntrinsic = newHeightIntrinsic;
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
        const newHeightIntrinsic = newSize.h === 0;

        if (newHeightIntrinsic !== heightIntrinsic) {
          onTrinsicChangedCallback(false, newHeightIntrinsic);
          heightIntrinsic = newHeightIntrinsic;
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
