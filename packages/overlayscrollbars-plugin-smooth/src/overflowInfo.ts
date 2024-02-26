import { OverlayScrollbars } from 'overlayscrollbars';
import type { XY } from './utils';

export interface OverflowInfo {
  /** The overflow amount. */
  overflowAmount: XY<number>;
  /** The overflow edge. */
  overflowEdge: XY<number>;
  /** The overflow style. */
  overflowStyle: XY<OverflowStyle>;
  /** The RTL scroll behavior. */
  rtlScrollBehavior: RtlScrollBehavior;
  /** Whether the direction is rtl. */
  directionRTL: boolean;
}

export type OverflowStyle = 'scroll' | 'hidden' | 'visible';

export interface RtlScrollBehavior {
  n: boolean;
  i: boolean;
}

export const getOverflowInfo = (osInstance: OverlayScrollbars): OverflowInfo => {
  const { overflowEdge, overflowAmount, overflowStyle, directionRTL } = osInstance.state();
  const { rtlScrollBehavior } = OverlayScrollbars.env();

  return {
    overflowAmount,
    overflowEdge,
    overflowStyle,
    directionRTL,
    rtlScrollBehavior,
  };
};
