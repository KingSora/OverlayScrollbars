import { animateNumber, noop, selfClearTimeout } from '~/support';
import type { EasingFn } from '~/support';
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
      ) => {
        // click scroll animation has 2 parts:
        // 1. the "click" which scrolls 100% of the viewport in a certain amount of time
        // 2. the "press" which scrolls to the point where the cursor is located, the "press" always waits for the "click" to finish
        // The "click" should not be canceled by a "pointerup" event because very fast clicks or taps would cancel it too fast
        // The "click" should only be canceled by a subsequent "pointerdown" event because otherwise 2 animations would run
        // The "press" should be canceld by the next "pointerup" event
        let stop = false;
        let stopClickAnimation = noop;
        let stopPressAnimation = noop;
        const [setFirstIterationPauseTimeout, clearFirstIterationPauseTimeout] =
          selfClearTimeout(222);
        const animateClickScroll = (
          clickScrollProgress: number,
          iteration: number,
          easing?: EasingFn | false
        ) =>
          animateNumber(
            clickScrollProgress,
            clickScrollProgress + handleLength * Math.sign(startOffset),
            iteration ? 133 : 222,
            (animationProgress, _, animationCompleted) => {
              moveHandleRelative(animationProgress);
              const handleStartBound = getHandleOffset();
              const handleEndBound = handleStartBound + handleLength;
              const mouseBetweenHandleBounds =
                relativeTrackPointerOffset >= handleStartBound &&
                relativeTrackPointerOffset <= handleEndBound;
              const animationCompletedAction = () => {
                stopPressAnimation = animateClickScroll(animationProgress, iteration + 1);
              };

              if (!stop && animationCompleted && !mouseBetweenHandleBounds) {
                if (iteration) {
                  animationCompletedAction();
                } else {
                  setFirstIterationPauseTimeout(animationCompletedAction);
                }
              }
            },
            easing
          );

        stopClickAnimation = animateClickScroll(0, 0, (x) => 1 - (1 - x) * (1 - x));

        return (stopClick?: boolean) => {
          stop = true;
          clearFirstIterationPauseTimeout();
          if (stopClick) {
            stopClickAnimation();
            stopPressAnimation();
          } else {
            stopPressAnimation();
          }
        };
      },
  },
}))() satisfies StaticPlugin<typeof clickScrollPluginModuleName>;
