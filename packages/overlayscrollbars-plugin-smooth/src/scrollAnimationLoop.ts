import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimationFrameInfo, ScrollAnimationInfo } from './scrollAnimation';
import type { OverlayScrollbarsPluginSmoothOptions } from './overlayscrollbars-plugin-smooth';

export interface ScrollAnimationLoop {
  /** Function which returns whether the scroll animation loop is running. */
  isRunning(): boolean;
  /** Starts / Updates the scroll animation loop. */
  update(
    options: Readonly<OverlayScrollbarsPluginSmoothOptions>,
    scrollAnimationUpdateInfo: Readonly<ScrollAnimationInfo>
  ): void;
  /** Cancels (stops) the scroll animation loop. */
  cancel(): void;
}

export const createScrollAnimationLoop = (osInstance: OverlayScrollbars): ScrollAnimationLoop => {
  let animationFrameId: ReturnType<typeof requestAnimationFrame> | undefined;
  let scrollAnimationInfo: ScrollAnimationInfo | undefined;
  let options: OverlayScrollbarsPluginSmoothOptions | undefined;
  const frameInfo: ScrollAnimationFrameInfo = {
    currentTime: 0,
    deltaTime: 0,
    startTime: 0,
  };

  const isRunning = () => typeof animationFrameId === 'number';

  const stopAnimationLoop = (canceled?: boolean) => {
    const { scrollAnimation, onAnimationCancel: onAnimationCanceled } = options || {};
    if (isRunning()) {
      canceled && scrollAnimation && onAnimationCanceled && onAnimationCanceled(frameInfo);
      cancelAnimationFrame(animationFrameId!);
    }

    frameInfo.startTime = frameInfo.currentTime = frameInfo.deltaTime = 0;
    frameInfo.previousTime = animationFrameId = scrollAnimationInfo = options = undefined;
  };

  const osDestroyed = () => {
    const { destroyed } = osInstance.state();

    if (destroyed) {
      stopAnimationLoop();
    }

    return destroyed;
  };

  return {
    update(ops, animationInfo) {
      if (osDestroyed()) {
        return;
      }

      // if the scroll animation changes while a scroll animation is running, cancel the old scroll animation
      if (options && options.scrollAnimation !== ops.scrollAnimation) {
        stopAnimationLoop(true);
      }

      const { scrollAnimation } = ops;
      const { start, update, frame } = scrollAnimation;

      if (!isRunning()) {
        const scrollAnimationLoopFrame: FrameRequestCallback = (currFrameTime) => {
          if (osDestroyed() || !options || !scrollAnimationInfo) {
            stopAnimationLoop();
            return;
          }

          const {
            onAnimationStart: onAnimationStarted,
            onAnimationStop: onAnimationStoped,
            onAnimationFrame,
          } = options || {};
          const { startTime, previousTime } = frameInfo;

          frameInfo.currentTime = currFrameTime;
          frameInfo.deltaTime = currFrameTime - (previousTime || currFrameTime);

          if (!startTime) {
            frameInfo.startTime = currFrameTime;
            onAnimationStarted && onAnimationStarted(frameInfo);
          }

          const frameResult = frame(scrollAnimationInfo, frameInfo, osInstance);
          onAnimationFrame && onAnimationFrame(frameInfo, frameResult || undefined);

          if (frameResult && frameResult.stop) {
            onAnimationStoped && onAnimationStoped(frameInfo);
            stopAnimationLoop();
            return;
          }

          frameInfo.previousTime = currFrameTime;
          animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
        };

        animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
        start && start(animationInfo, osInstance);
      } else {
        update && update(animationInfo, osInstance);
      }

      options = ops as any;
      scrollAnimationInfo = animationInfo;
    },
    cancel: () => {
      if (osDestroyed()) {
        return;
      }

      stopAnimationLoop(true);
    },
    isRunning,
  };
};
