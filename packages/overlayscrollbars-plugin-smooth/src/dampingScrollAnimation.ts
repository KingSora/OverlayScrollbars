import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import { newXY0 } from './utils';
import { clamp, damp, roundWithPrecision } from './math';

export interface DampingScrollAnimationOptions {
  /**
   * Damping rate between 0..1. (The proportion of scroll distance remaining after one second.)
   * 0 = is no damping, the destination scroll offset is reached instantly.
   * 1 = is infinite damping, the destination scroll offset is never reached.
   */
  damping: number;
  /** The fractional precision of the numbers. */
  precision: number;
  /** Whether scroll direction changes are applied instantly instead of animated. */
  responsiveDirectionChange: boolean;
  /**
   * Whether the max. velocity is limited by the viewport edges.
   * Enabling this will cause the velocity to always drop near the viewport edges
   * which causes the animation to feel smoother but less responsive near the edges.
   */
  viewportLimitsVelocity: boolean;
  /** When the scroll velocity (in pixel / second) is smaller or equal to the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
}

const defaultOptions: DampingScrollAnimationOptions = {
  damping: 0.042,
  precision: 0,
  responsiveDirectionChange: true,
  viewportLimitsVelocity: false,
  stopVelocity: 1,
};

export const dampingScrollAnimation = (
  options?: Partial<DampingScrollAnimationOptions>
): ScrollAnimation => {
  const { damping, responsiveDirectionChange, viewportLimitsVelocity, stopVelocity, precision } =
    Object.assign({}, defaultOptions, options);

  const precisionNumber = precision < 0 || !isFinite(precision) ? -1 : Math.pow(10, precision);
  const withPrecision = (value: number) =>
    precisionNumber < 0 ? value : roundWithPrecision(value, precisionNumber);

  let currScroll = newXY0();
  let destinationDirection = newXY0();
  let destinationScroll = newXY0();

  const updateAnimationInfo = (
    { delta, scroll }: Readonly<ScrollAnimationInfo>,
    osInstance: OverlayScrollbars
  ) => {
    const { overflowAmount } = osInstance.state();
    const newDestinationDirection = {
      x: Math.sign(delta.x),
      y: Math.sign(delta.y),
    };
    const destinationDirectionChanged = {
      x: destinationDirection.x !== newDestinationDirection.x,
      y: destinationDirection.y !== newDestinationDirection.y,
    };

    if (destinationDirectionChanged.x) {
      destinationScroll.x = clamp(0, overflowAmount.x, destinationScroll.x);

      if (responsiveDirectionChange) {
        destinationScroll.x = currScroll.x = scroll.x;
      }
    }

    if (destinationDirectionChanged.y) {
      destinationScroll.y = clamp(0, overflowAmount.y, destinationScroll.y);

      if (responsiveDirectionChange) {
        destinationScroll.y = currScroll.y = scroll.y;
      }
    }

    const newTargetScroll = {
      x: destinationScroll.x + delta.x,
      y: destinationScroll.y + delta.y,
    };

    destinationScroll = newTargetScroll;
    destinationDirection = newDestinationDirection;
  };

  return {
    start(animationInfo, osInstance) {
      const { scroll } = animationInfo;
      destinationDirection = newXY0();
      currScroll = destinationScroll = { ...scroll };

      updateAnimationInfo(animationInfo, osInstance);
    },
    update: updateAnimationInfo,
    frame(_, frameInfo, osInstance) {
      const { deltaTime } = frameInfo;

      if (!deltaTime) {
        return;
      }

      const frameDeltaSeconds = deltaTime / 1000;
      const { overflowAmount } = osInstance.state();
      const clampedDestinationScroll = {
        x: clamp(0, overflowAmount.x, destinationScroll.x),
        y: clamp(0, overflowAmount.y, destinationScroll.y),
      };

      const dampedScroll = {
        x: damp(
          currScroll.x,
          viewportLimitsVelocity ? clampedDestinationScroll.x : destinationScroll.x,
          damping,
          frameDeltaSeconds
        ),
        y: damp(
          currScroll.y,
          viewportLimitsVelocity ? clampedDestinationScroll.y : destinationScroll.y,
          damping,
          frameDeltaSeconds
        ),
      };
      const dampedScrollDirection = {
        x: Math.sign(dampedScroll.x - currScroll.x),
        y: Math.sign(dampedScroll.y - currScroll.y),
      };
      const newScroll = {
        x: clamp(
          dampedScrollDirection.x < 0 ? clampedDestinationScroll.x : 0,
          dampedScrollDirection.x > 0 ? clampedDestinationScroll.x : overflowAmount.x,
          dampedScroll.x
        ),
        y: clamp(
          dampedScrollDirection.y < 0 ? clampedDestinationScroll.y : 0,
          dampedScrollDirection.y > 0 ? clampedDestinationScroll.y : overflowAmount.y,
          dampedScroll.y
        ),
      };
      const newDistance = {
        x: withPrecision(clampedDestinationScroll.x - newScroll.x),
        y: withPrecision(clampedDestinationScroll.y - newScroll.y),
      };
      const newCurrDirection = {
        x: Math.sign(newDistance.x),
        y: Math.sign(newDistance.y),
      };
      const velocity = {
        x: Math.abs(newDistance.x) / frameDeltaSeconds,
        y: Math.abs(newDistance.y) / frameDeltaSeconds,
      };

      const slowVelocity = velocity.x <= stopVelocity && velocity.y <= stopVelocity;
      const noDirection = !newCurrDirection.x && !newCurrDirection.y;
      const stop = slowVelocity || noDirection;

      currScroll = newScroll;

      return {
        stop,
        scroll: {
          x: withPrecision(newScroll.x),
          y: withPrecision(newScroll.y),
        },
      };
    },
  };
};
