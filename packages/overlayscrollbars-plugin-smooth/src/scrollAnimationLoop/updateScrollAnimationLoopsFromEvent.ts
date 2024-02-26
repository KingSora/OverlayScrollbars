import type { ScrollAnimationLoop, ScrollAnimationLoopUpdateInfo } from './scrollAnimationLoop';
import type { AxisInfo, XY } from '../utils';
import type { OverflowInfo } from '../overflowInfo';
import { clamp, convertScrollPosition, isNumber, newXY0, perAxis } from '../utils';

export interface UpdateScrollAnimationLoopsFromEventInfo
  extends Omit<
    ScrollAnimationLoopUpdateInfo,
    'delta' | 'overflowAmount' | 'getScroll' | 'applyScroll'
  > {
  /** The scroll animation loops. */
  scrollAnimationLoops: XY<ScrollAnimationLoop>;
  /** The scroll position delta in pixel. */
  delta: XY<ScrollAnimationLoopUpdateInfo['delta']>;
  /** Whether scroll chaining is allowed. Disabling scroll chaining can be bad for accessibility. */
  scrollChaining: boolean;
  /** The current overflow info. */
  overflowInfo: OverflowInfo;
  /** Function which applies the scroll value. */
  applyScroll: (applyScrollInfo: ApplyScrollInfo) => void;
  /** Callback when overscroll occurs. */
  onOverscroll: (overscrollInfo: OverscrollInfo) => void;
}

export type OverflowStyle = 'scroll' | 'hidden' | 'visible';

export interface RtlScrollBehavior {
  n: boolean;
  i: boolean;
}

export interface ApplyScrollInfo extends AxisInfo {
  /** The scroll position to apply. If a scroll position equals `false` there was no change to the scroll position. */
  scroll: number | false;
  /** The element to which the scroll positions should be applied to. */
  target: HTMLElement;
}

export interface OverscrollInfo extends AxisInfo {
  /** Whether there is any overscroll. */
  overscroll: boolean;
  /** Whether there is a "start" overscroll. */
  start: boolean;
  /** Whether there is a "end" overscroll. */
  end: boolean;
}

const getAxisOverscrollInfo = (delta: number, overflowAmount: number, getScroll: () => number) => {
  const axisDelta = delta;
  const axisScroll = getScroll();
  const start = axisDelta < 0 && Math.floor(axisScroll) <= 0;
  const end = axisDelta > 0 && Math.ceil(axisScroll) >= overflowAmount - 1; // -1 because of possible rounding errors
  const overscroll = start || end;

  return {
    start,
    end,
    overscroll,
  };
};

export const updateScrollAnimationLoopsFromEvent = (
  event: Event,
  {
    delta,
    scrollAnimationLoops: scrollAnimationLoop,
    scrollChaining,
    overflowInfo,
    applyScroll,
    onOverscroll,
    ...info
  }: UpdateScrollAnimationLoopsFromEventInfo
): XY<number> => {
  const { currentTarget, cancelable } = event;
  const typedTarget = currentTarget as HTMLElement;
  const { overflowAmount, overflowStyle, directionRTL, rtlScrollBehavior } = overflowInfo;
  const appliedDelta = newXY0();

  perAxis((axis) => {
    const axisIsHorizontal = axis === 'x';
    const axisOverflowAmount = overflowAmount[axis];
    const axisOverflowStyle = overflowStyle[axis];
    const axisScrollAnimationLoop = scrollAnimationLoop[axis];
    const axisCanHaveScrollDelta = axisOverflowAmount > 0 && axisOverflowStyle !== 'hidden';
    const axisDelta = axisCanHaveScrollDelta ? delta[axis] : 0;
    const axisRtlScrollBehavior = axisIsHorizontal && directionRTL && rtlScrollBehavior;

    if (!axisDelta) {
      return;
    }

    // get scroll lazily to not cause browser reflow when its not necessary
    const getScroll = () =>
      convertScrollPosition(
        axisIsHorizontal ? typedTarget.scrollLeft : typedTarget.scrollTop,
        axisOverflowAmount,
        axisRtlScrollBehavior
      );

    const animationLoopRunning = axisScrollAnimationLoop.isRunning();
    const overScrollInfo =
      !animationLoopRunning && getAxisOverscrollInfo(axisDelta, axisOverflowAmount, getScroll);

    // if animation is running or no scroll chaining or no overscroll prevent default
    if (animationLoopRunning || !scrollChaining || (overScrollInfo && !overScrollInfo.overscroll)) {
      // touch events are sometimes not cancelable if scroll can't be interrupted (should only happen on overscroll)
      if (!cancelable) {
        axisScrollAnimationLoop.cancel();
        return;
      }

      event.preventDefault();
    }

    if (overScrollInfo && overScrollInfo.overscroll) {
      onOverscroll({ axis, ...overScrollInfo });
    }
    // only update the animation loop if there is no overscroll
    else {
      appliedDelta[axis] = axisDelta;
      axisScrollAnimationLoop.update({
        delta: axisDelta,
        overflowAmount: axisOverflowAmount,
        applyScroll: (newScroll) => {
          applyScroll({
            axis,
            scroll:
              isNumber(newScroll) &&
              convertScrollPosition(
                clamp(0, axisOverflowAmount, newScroll),
                axisOverflowAmount,
                axisRtlScrollBehavior
              ),
            target: typedTarget,
          });
        },
        getScroll,
        ...info,
      });
    }
  });

  return appliedDelta;
};
