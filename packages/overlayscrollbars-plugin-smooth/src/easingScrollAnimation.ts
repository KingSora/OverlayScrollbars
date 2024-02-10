import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import { newXY0 } from './utils';
import { clamp, lerp } from './math';

export interface EasignScrollAnimationOptions {
  /** A function which returns the scroll duration for both axis. */
  duration: (delta: number) => number;
  /** The easign function for the scroll animation. */
  startEasing: (percent: number) => number;
  updateEasing: (percent: number) => number;
}

const now = () => performance.now() - 8;

const defaultOptions: EasignScrollAnimationOptions = {
  duration: (delta) => delta * 1.76,
  startEasing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  updateEasing: (x) => Math.sin((x * Math.PI) / 2),
};

export const easingScrollAnimation = (
  options?: Partial<EasignScrollAnimationOptions>
): ScrollAnimation => {
  const { duration, startEasing, updateEasing } = Object.assign({}, defaultOptions, options);

  let startTime = newXY0();
  let deltaDuration = newXY0();
  let startScroll = newXY0();
  let destinationScroll = newXY0();
  let currScroll = newXY0();
  let destinationDirection = newXY0();
  let easing = updateEasing;

  const updateAnimationInfo = ({ delta }: Readonly<ScrollAnimationInfo>) => {
    const newDestinationDirection = {
      x: Math.sign(delta.x),
      y: Math.sign(delta.y),
    };
    const destinationDirectionChanged = {
      x: destinationDirection.x !== newDestinationDirection.x,
      y: destinationDirection.y !== newDestinationDirection.y,
    };

    destinationDirection = newDestinationDirection;
    startTime = {
      x: delta.x ? now() : startTime.x,
      y: delta.y ? now() : startTime.y,
    };
    startScroll = { ...currScroll };
    destinationScroll = {
      x: (destinationDirectionChanged.x ? currScroll.x : destinationScroll.x) + delta.x,
      y: (destinationDirectionChanged.y ? currScroll.y : destinationScroll.y) + delta.y,
    };
    deltaDuration = {
      x: Math.abs(duration(delta.x)),
      y: Math.abs(duration(delta.y)),
    };
  };

  return {
    start(animationInfo) {
      startTime = newXY0();
      startScroll = currScroll = destinationScroll = { ...animationInfo.scroll };

      updateAnimationInfo(animationInfo);
      easing = startEasing;
    },
    update(animationInfo) {
      updateAnimationInfo(animationInfo);
      easing = updateEasing;
    },
    frame(_, frameInfo, osInstance) {
      const { currentTime } = frameInfo;
      const { overflowAmount } = osInstance.state();

      const percent = {
        x:
          1 -
          Math.min(
            1,
            Math.max(0, startTime.x + deltaDuration.x - currentTime) / deltaDuration.x || 0
          ),
        y:
          1 -
          Math.min(
            1,
            Math.max(0, startTime.y + deltaDuration.y - currentTime) / deltaDuration.y || 0
          ),
      };

      currScroll = {
        x: clamp(0, overflowAmount.x, lerp(startScroll.x, destinationScroll.x, easing(percent.x))),
        y: clamp(0, overflowAmount.y, lerp(startScroll.y, destinationScroll.y, easing(percent.y))),
      };

      const stopX = currentTime >= startTime.x + deltaDuration.x && percent.x === 1;
      const stopY = currentTime >= startTime.y + deltaDuration.y && percent.y === 1;
      const stop = stopX && stopY;

      return {
        stop,
        scroll: currScroll,
      };
    },
  };
};
