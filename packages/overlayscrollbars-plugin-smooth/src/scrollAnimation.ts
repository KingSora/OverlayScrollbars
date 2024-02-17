import type { OverlayScrollbars } from 'overlayscrollbars';
import type { XY } from './utils';
import type { ScrollAnimationLoopInfo } from './scrollAnimationLoop';

export interface ScrollAnimationFrameInfo {
  /** The scroll animations start (first frame) time in ms. */
  startTime: number;
  /** The scroll animations current time in ms. */
  currentTime: number;
  /** The delta time between the current and last frame in ms. */
  deltaTime: number;
  /** The previous frame time in ms. */
  previousTime?: number;
}

export interface ScrollAnimationFrameResult {
  /** Whether to stop the animation. */
  stop?: Partial<XY<boolean>>;
  /** The new scroll values in pixel. */
  scroll?: Partial<XY<number | false | null>> | false | null;
}

export interface ScrollAnimationInfo extends ScrollAnimationLoopInfo {
  /** The current scroll position with max. precision. */
  currentScroll: Readonly<XY<number>>;
  /** The scroll position on the last update with max. precision. */
  updateScroll: Readonly<XY<number>>;
  /** The destination scroll position with max. precision. */
  destinationScroll: Readonly<XY<number>>;
  /** The destination scroll position clamped to the viewports bounds with max. precision. */
  destinationScrollClamped: Readonly<XY<number>>;
  /** The direction. [-1, 0, +1] */
  direction: Readonly<XY<number>>;
  /** Whether the direction changed. */
  directionChanged: Readonly<XY<boolean>>;
  /** Whether the currentScroll overshoots the min. / max. scroll boundaries of the viewport. */
  overshoot: Readonly<XY<boolean>>;
  /** A function which applies the precision from the options to the passed number and returns it. */
  precision: (value: number) => number;
}

export interface ScrollAnimation {
  /**
   * Function called when the scroll animation starts for the first time.
   * @param initialInfo The initial animation info.
   * @param osInstance The OverlayScrollbars instance.
   */
  start?: (initialInfo: Readonly<ScrollAnimationInfo>, osInstance: OverlayScrollbars) => void;
  /**
   * Function called when the scroll animation info updates.
   * @param updatedInfo The updated animation info.
   * @param osInstance The OverlayScrollbars instance.
   */
  update?: (updatedInfo: Readonly<ScrollAnimationInfo>, osInstance: OverlayScrollbars) => void;
  /**
   * Function which is called every frame of the animation (including the first and last).
   * @param latestInfo The latest animation info supplied`.
   * @param frameInfo The frame info.
   * @param osInstance The OverlayScrollbars instance.
   */
  frame(
    latestInfo: Readonly<ScrollAnimationInfo>,
    frameInfo: Readonly<ScrollAnimationFrameInfo>,
    osInstance: OverlayScrollbars
  ): Readonly<ScrollAnimationFrameResult> | null | undefined | void;
}
