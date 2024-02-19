import type { OverlayScrollbars } from 'overlayscrollbars';
import type { AxisInfo } from './utils';
import type { AxisScrollAnimationLoopUpdateInfo } from './scrollAnimationLoop';

export interface ScrollAnimationFrameInfo {
  /** The scroll animations current time in ms. */
  currentTime: number;
  /** The time on the last update including start. (not last frame.) */
  updateTime: number;
  /** The delta time between the current and last frame in ms. */
  deltaTime: number;
  /** The previous frame time in ms. */
  previousTime?: number;
}

export interface ScrollAnimationFrameResult {
  /** Whether to stop the animation. */
  stop?: boolean;
  /** The new scroll values in pixel. */
  scroll?: number;
}

export interface AxisScrollAnimationUpdateInfo extends AxisScrollAnimationLoopUpdateInfo, AxisInfo {
  /** Whether the animation starts with this update. */
  start: boolean;
}

export interface AxisScrollAnimationState extends AxisInfo {
  /** The current scroll position with max. precision. */
  currentScroll: number;
  /** The scroll position on the last update including start with max. precision. */
  updateScroll: number;
  /** The destination scroll position with max. precision. */
  destinationScroll: number;
  /** The destination scroll position clamped to the viewports bounds with max. precision. */
  destinationScrollClamped: number;
  /** The overflow amount. */
  overflowAmount: number;
  /** The direction. [-1, 0, +1] */
  direction: number;
  /** Whether the direction changed. */
  directionChanged: boolean;
  /** A function which applies the precision from the options to the passed number and returns it. */
  precision: (value: number) => number;
  /** The OverlayScrollbars instance. */
  osInstance: OverlayScrollbars;
}

export interface ScrollAnimation {
  /**
   * Function called when the scroll animations state updates.
   * @param updateInfo The update info.
   * @param state The updated animation state.
   */
  update?: (
    updateInfo: Readonly<AxisScrollAnimationUpdateInfo>,
    state: Readonly<AxisScrollAnimationState>
  ) => void;
  /**
   * Function which is called every frame of the animation.
   * @param state The current animation state.
   * @param frameInfo The frame info.
   * @returns The frame result.
   */
  frame(
    state: Readonly<AxisScrollAnimationState>,
    frameInfo: Readonly<ScrollAnimationFrameInfo>
  ): Readonly<ScrollAnimationFrameResult> | false | null | undefined | void;
}
