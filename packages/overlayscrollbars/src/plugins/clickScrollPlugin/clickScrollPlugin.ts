import { animateNumber, noop } from '~/support';
import type { StaticPlugin } from '~/plugins';

export const clickScrollPluginModuleName = '__osClickScrollPlugin';

export const ClickScrollPlugin = /* @__PURE__ */ (() => ({
  [clickScrollPluginModuleName]: {
    static:
      () =>
      (
        moveHandleRelative: (deltaMovement: number) => void,
        getHandleOffset: (handleRect?: DOMRect, trackRect?: DOMRect) => number,
        startOffset: number,
        handleLength: number,
        relativeTrackPointerOffset: number
      ): (() => void) => {
        // click scroll animation
        let iteration = 0;
        let clear = noop;
        const animateClickScroll = (clickScrollProgress: number) => {
          clear = animateNumber(
            clickScrollProgress,
            clickScrollProgress + handleLength * Math.sign(startOffset),
            133,
            (animationProgress, _, animationCompleted) => {
              moveHandleRelative(animationProgress);
              const handleStartBound = getHandleOffset();
              const handleEndBound = handleStartBound + handleLength;
              const mouseBetweenHandleBounds =
                relativeTrackPointerOffset >= handleStartBound &&
                relativeTrackPointerOffset <= handleEndBound;

              if (animationCompleted && !mouseBetweenHandleBounds) {
                if (iteration) {
                  animateClickScroll(animationProgress);
                } else {
                  const firstIterationPauseTimeout = setTimeout(() => {
                    animateClickScroll(animationProgress);
                  }, 222);
                  clear = () => {
                    clearTimeout(firstIterationPauseTimeout);
                  };
                }
                iteration++;
              }
            }
          );
        };

        animateClickScroll(0);

        return () => clear();
      },
  },
}))() satisfies StaticPlugin<typeof clickScrollPluginModuleName>;
