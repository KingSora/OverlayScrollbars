import { animateNumber, noop, selfClearTimeout } from '~/support';
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
        let stopAnimation = noop;
        const [setFirstIterationPauseTimeout, clearFirstIterationPauseTimeout] =
          selfClearTimeout(222);
        const animateClickScroll = (clickScrollProgress: number) =>
          animateNumber(
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
              const animationCompletedAction = () => {
                stopAnimation = animateClickScroll(animationProgress);
              };

              if (animationCompleted && !mouseBetweenHandleBounds) {
                if (iteration) {
                  animationCompletedAction();
                } else {
                  setFirstIterationPauseTimeout(animationCompletedAction);
                }

                iteration++;
              }
            }
          );

        // never stop the first animation iteration because in case of a tap / very fast click scrolling would be canceled instantly
        // stopAnimation = animateClickScroll(0);
        animateClickScroll(0);

        return () => {
          clearFirstIterationPauseTimeout();
          stopAnimation();
        };
      },
  },
}))() satisfies StaticPlugin<typeof clickScrollPluginModuleName>;
