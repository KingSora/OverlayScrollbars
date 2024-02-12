import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import { newXY0, clamp, damp, perAxis, createWithPrecision } from './utils';

export interface DampingScrollAnimationOptions {
  /**
   * Damping rate between 0..1. (The proportion of scroll distance remaining after one second.)
   * 0 = is no damping, the destination scroll offset is reached instantly.
   * 1 = is infinite damping, the destination scroll offset is never reached.
   */
  damping: number;
  /** When the scroll velocity (in pixel / second) is smaller or equal to the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
  /** The fractional precision of the scroll position numbers. Can be Infinity. Negative precision is interpreted as Infinity. */
  precision: number;
  /** Whether scroll direction changes are applied instantly instead of animated. */
  responsiveDirectionChange: boolean;
  /**
   * Whether the destination scroll position is always clamped to the viewport edges.
   * Enabling this will cause the velocity to always drop near the viewport edges which causes the animation to feel smoother but less responsive near the edges.
   */
  clampToViewport: boolean;
}

const defaultOptions: DampingScrollAnimationOptions = {
  damping: 0.033,
  stopVelocity: 1,
  precision: 0,
  responsiveDirectionChange: true,
  clampToViewport: false,
};

export const dampingScrollAnimation = (
  options?: Partial<DampingScrollAnimationOptions>
): ScrollAnimation => {
  const { damping, responsiveDirectionChange, clampToViewport, stopVelocity, precision } =
    Object.assign({}, defaultOptions, options);

  const withPrecision = createWithPrecision(precision);

  const currentScroll = newXY0();
  const destinationDirection = newXY0();
  const destinationScroll = newXY0();

  const update = ({ delta }: Readonly<ScrollAnimationInfo>, osInstance: OverlayScrollbars) => {
    const { overflowAmount } = osInstance.state();

    perAxis((axis) => {
      const axisDelta = delta[axis];
      const axisNewDestinationDirection = Math.sign(axisDelta);
      const axisDestinationDirectionChanged =
        destinationDirection[axis] !== axisNewDestinationDirection;

      destinationScroll[axis] =
        (axisDestinationDirectionChanged
          ? clamp(
              0,
              overflowAmount[axis],
              responsiveDirectionChange ? currentScroll[axis] : destinationScroll[axis]
            )
          : destinationScroll[axis]) + axisDelta;
      destinationDirection[axis] = axisNewDestinationDirection;
    });
  };

  return {
    start(animationInfo, osInstance) {
      const { getScroll } = animationInfo;
      perAxis((axis) => {
        destinationDirection[axis] = 0;
        currentScroll[axis] = destinationScroll[axis] = getScroll()[axis];
      });

      update(animationInfo, osInstance);
    },
    update,
    frame(_, frameInfo, osInstance) {
      const { deltaTime } = frameInfo;
      const frameDeltaSeconds = deltaTime / 1000;
      const { overflowAmount } = osInstance.state();

      let slowVelocity = true;
      let noDirection = true;
      const precisionScroll = newXY0();
      perAxis((axis) => {
        const axisOverflowAmount = overflowAmount[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisClampedDestinationScroll = clamp(0, axisOverflowAmount, axisDestinationScroll);
        const axisNewScroll = clamp(
          0,
          axisOverflowAmount,
          damp(
            currentScroll[axis],
            clampToViewport ? axisClampedDestinationScroll : axisDestinationScroll,
            damping,
            frameDeltaSeconds
          )
        );
        const axisPrecisionScroll = withPrecision(axisNewScroll);
        const axisDistance = withPrecision(axisClampedDestinationScroll - axisNewScroll);
        const direction = Math.sign(axisDistance);
        const velocity = Math.abs(axisDistance) / frameDeltaSeconds;

        currentScroll[axis] = axisNewScroll;
        precisionScroll[axis] = axisPrecisionScroll;
        slowVelocity = slowVelocity && velocity <= stopVelocity;
        noDirection = noDirection && !direction;
      });

      return {
        stop: slowVelocity || noDirection,
        scroll: precisionScroll,
      };
    },
  };
};
