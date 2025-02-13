import type { StaticPlugin } from '../plugins';
import { animateNumber, noop, selfClearTimeout } from '../../support';

export const clickScrollPluginModuleName = '__osClickScrollPlugin';

export const ClickScrollPlugin = /* @__PURE__ */ (() => ({
  [clickScrollPluginModuleName]: {
    static:
      () =>
      (
        moveHandleRelative: (deltaMovement: number) => void,
        targetOffset: number,
        handleLength: number,
        onClickScrollCompleted: (stopped: boolean) => void
      ) => {
        // click scroll animation has 2 main parts:
        // 1. the "click" which scrolls 100% of the viewport in a certain amount of time
        // 2. the "press" which scrolls to the point where the cursor is located, the "press" always waits for the "click" to finish
        // The "click" should not be canceled by a "pointerup" event because very fast clicks or taps would cancel it too fast
        // The "click" should only be canceled by a subsequent "pointerdown" event because otherwise 2 animations would run
        // The "press" should be canceld by the next "pointerup" event

        let stopped = false;
        let stopPressAnimation = noop;
        const linearScrollMs = 133;
        const easedScrollMs = 222;
        const [setPressAnimationTimeout, clearPressAnimationTimeout] =
          selfClearTimeout(linearScrollMs);
        const targetOffsetSign = Math.sign(targetOffset);
        const handleLengthWithTargetSign = handleLength * targetOffsetSign;
        const handleLengthWithTargetSignHalf = handleLengthWithTargetSign / 2;
        const easing = (x: number) => 1 - (1 - x) * (1 - x); // easeOutQuad;
        const easedEndPressAnimation = (from: number, to: number) =>
          animateNumber(from, to, easedScrollMs, moveHandleRelative, easing);
        const linearPressAnimation = (linearFrom: number, msFactor: number) =>
          animateNumber(
            linearFrom,
            targetOffset - handleLengthWithTargetSign,
            linearScrollMs * msFactor,
            (progress, _, completed) => {
              moveHandleRelative(progress);

              if (completed) {
                stopPressAnimation = easedEndPressAnimation(progress, targetOffset);
              }
            }
          );
        const stopClickAnimation = animateNumber(
          0,
          handleLengthWithTargetSign,
          easedScrollMs,
          (clickAnimationProgress, _, clickAnimationCompleted) => {
            moveHandleRelative(clickAnimationProgress);

            if (clickAnimationCompleted) {
              onClickScrollCompleted(stopped);

              if (!stopped) {
                const remainingScrollDistance = targetOffset - clickAnimationProgress;
                const continueWithPress =
                  Math.sign(remainingScrollDistance - handleLengthWithTargetSignHalf) ===
                  targetOffsetSign;

                if (continueWithPress) {
                  setPressAnimationTimeout(() => {
                    const remainingLinearScrollDistance =
                      remainingScrollDistance - handleLengthWithTargetSign;
                    const linearBridge =
                      Math.sign(remainingLinearScrollDistance) === targetOffsetSign;

                    stopPressAnimation = linearBridge
                      ? linearPressAnimation(
                          clickAnimationProgress,
                          Math.abs(remainingLinearScrollDistance) / handleLength
                        )
                      : easedEndPressAnimation(clickAnimationProgress, targetOffset);
                  });
                }
              }
            }
          },
          easing
        );

        return (stopClick?: boolean) => {
          stopped = true;

          if (stopClick) {
            stopClickAnimation();
          }

          clearPressAnimationTimeout();
          stopPressAnimation();
        };
      },
  },
}))() satisfies StaticPlugin<typeof clickScrollPluginModuleName>;
