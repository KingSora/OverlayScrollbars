import type { OverlayScrollbars } from 'overlayscrollbars';
import type { XY } from './utils';

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
  stop?: boolean;
  /** The new scroll values in pixel. */
  scroll?: Partial<XY<number | false | null>> | false | null;
}

export interface ScrollAnimationInfo {
  /** The wheel delta values in pixel. */
  delta: XY<number>;
  /** Function to get the current scroll values in pixel. Should be used sparingly because of possible browser reflow. */
  getScroll: () => XY<number>;
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
