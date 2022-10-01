import {
  keys,
  attr,
  style,
  addClass,
  removeClass,
  noop,
  each,
  assignDeep,
  windowSize,
} from '~/support';
import { classNameViewportArrange } from '~/classnames';
import type { WH, UpdateCache, XY } from '~/support';
import type { StyleObject } from '~/typings';
import type { StructureSetupState } from '~/setups/structureSetup';
import type {
  ViewportOverflowState,
  GetViewportOverflowState,
  HideNativeScrollbars,
} from '~/setups/structureSetup/updateSegments/overflowUpdateSegment';
import type { InternalEnvironment } from '~/environment';
import type { Plugin } from '~/plugins';

export type ArrangeViewport = (
  viewportOverflowState: ViewportOverflowState,
  viewportScrollSize: WH<number>,
  sizeFraction: WH<number>,
  directionIsRTL: boolean
) => boolean;

export type UndoViewportArrangeResult = [
  redoViewportArrange: () => void,
  overflowState?: ViewportOverflowState
];

export type UndoArrangeViewport = (
  showNativeOverlaidScrollbars: boolean,
  directionIsRTL: boolean,
  viewportOverflowState?: ViewportOverflowState
) => UndoViewportArrangeResult;

export type ScrollbarsHidingPluginInstance = {
  _createUniqueViewportArrangeElement(env: InternalEnvironment): HTMLStyleElement | false;
  _overflowUpdateSegment(
    doViewportArrange: boolean,
    flexboxGlue: boolean,
    viewport: HTMLElement,
    viewportArrange: HTMLStyleElement | false | null | undefined,
    getState: () => StructureSetupState,
    getViewportOverflowState: GetViewportOverflowState,
    hideNativeScrollbars: HideNativeScrollbars
  ): [ArrangeViewport, UndoArrangeViewport];
  _envWindowZoom(): (
    envInstance: InternalEnvironment,
    updateNativeScrollbarSizeCache: UpdateCache<XY<number>>,
    triggerEvent: () => void
  ) => void;
};

let contentArrangeCounter = 0;
const { round, abs } = Math;
const getWindowDPR = (): number => {
  // eslint-disable-next-line
  // @ts-ignore
  const dDPI = window.screen.deviceXDPI || 0;
  // eslint-disable-next-line
  // @ts-ignore
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const diffBiggerThanOne = (valOne: number, valTwo: number): boolean => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

export const scrollbarsHidingPluginName = '__osScrollbarsHidingPlugin';

export const ScrollbarsHidingPlugin: Plugin<ScrollbarsHidingPluginInstance> =
  /* @__PURE__ */ (() => ({
    [scrollbarsHidingPluginName]: {
      _createUniqueViewportArrangeElement: (env: InternalEnvironment) => {
        const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid, _cssCustomProperties } = env;
        const create =
          !_cssCustomProperties &&
          !_nativeScrollbarsHiding &&
          (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);
        const result = create ? document.createElement('style') : false;

        if (result) {
          attr(result, 'id', `${classNameViewportArrange}-${contentArrangeCounter}`);
          contentArrangeCounter++;
        }

        return result;
      },
      _overflowUpdateSegment: (
        doViewportArrange,
        flexboxGlue,
        viewport,
        viewportArrange,
        getState,
        getViewportOverflowState,
        hideNativeScrollbars
      ) => {
        /**
         * Sets the styles of the viewport arrange element.
         * @param viewportOverflowState The viewport overflow state according to which the scrollbars shall be hidden.
         * @param viewportScrollSize The content scroll size.
         * @param directionIsRTL Whether the direction is RTL or not.
         * @returns A boolean which indicates whether the viewport arrange element was adjusted.
         */
        const arrangeViewport: ArrangeViewport = (
          viewportOverflowState,
          viewportScrollSize,
          sizeFraction,
          directionIsRTL
        ) => {
          if (doViewportArrange) {
            const { _viewportPaddingStyle } = getState();
            const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
            const viewportArrangeHorizontalPaddingKey: keyof StyleObject = directionIsRTL
              ? 'paddingRight'
              : 'paddingLeft';
            const viewportArrangeHorizontalPaddingValue = _viewportPaddingStyle[
              viewportArrangeHorizontalPaddingKey
            ] as number;
            const viewportArrangeVerticalPaddingValue = _viewportPaddingStyle.paddingTop as number;
            const fractionalContentWidth = viewportScrollSize.w + sizeFraction.w;
            const fractionalContenHeight = viewportScrollSize.h + sizeFraction.h;
            const arrangeSize = {
              w:
                hideOffsetY && arrangeY
                  ? `${
                      hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue
                    }px`
                  : '',
              h:
                hideOffsetX && arrangeX
                  ? `${
                      hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue
                    }px`
                  : '',
            };

            // adjust content arrange / before element
            if (viewportArrange) {
              const { sheet } = viewportArrange;
              if (sheet) {
                const { cssRules } = sheet;
                if (cssRules) {
                  if (!cssRules.length) {
                    sheet.insertRule(
                      `#${attr(viewportArrange, 'id')} + .${classNameViewportArrange}::before {}`,
                      0
                    );
                  }

                  // @ts-ignore
                  const ruleStyle = cssRules[0].style;

                  ruleStyle.width = arrangeSize.w;
                  ruleStyle.height = arrangeSize.h;
                }
              }
            } else {
              style<'--os-vaw' | '--os-vah'>(viewport, {
                '--os-vaw': arrangeSize.w,
                '--os-vah': arrangeSize.h,
              });
            }
          }

          return doViewportArrange;
        };

        /**
         * Removes all styles applied because of the viewport arrange strategy.
         * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
         * @param directionIsRTL Whether the direction is RTL or not.
         * @param viewportOverflowState The currentviewport overflow state or undefined if it has to be determined.
         * @returns A object with a function which applies all the removed styles and the determined viewport vverflow state.
         */
        const undoViewportArrange: UndoArrangeViewport = (
          showNativeOverlaidScrollbars,
          directionIsRTL,
          viewportOverflowState?
        ) => {
          if (doViewportArrange) {
            const finalViewportOverflowState =
              viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);
            const { _viewportPaddingStyle: viewportPaddingStyle } = getState();
            const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const finalPaddingStyle: StyleObject = {};
            const assignProps = (props: string) =>
              each(props.split(' '), (prop) => {
                finalPaddingStyle[prop] = viewportPaddingStyle[prop];
              });

            if (arrangeX) {
              assignProps('marginBottom paddingTop paddingBottom');
            }

            if (arrangeY) {
              assignProps('marginLeft marginRight paddingLeft paddingRight');
            }

            const prevStyle = style(viewport, keys(finalPaddingStyle));

            removeClass(viewport, classNameViewportArrange);

            if (!flexboxGlue) {
              finalPaddingStyle.height = '';
            }

            style(viewport, finalPaddingStyle);

            return [
              () => {
                hideNativeScrollbars(
                  finalViewportOverflowState,
                  directionIsRTL,
                  doViewportArrange,
                  prevStyle
                );
                style(viewport, prevStyle);
                addClass(viewport, classNameViewportArrange);
              },
              finalViewportOverflowState,
            ];
          }
          return [noop];
        };

        return [arrangeViewport, undoViewportArrange];
      },
      _envWindowZoom: () => {
        let size = { w: 0, h: 0 };
        let dpr = 0;

        return (envInstance, updateNativeScrollbarSizeCache, triggerEvent) => {
          const sizeNew = windowSize();
          const deltaSize = {
            w: sizeNew.w - size.w,
            h: sizeNew.h - size.h,
          };

          if (deltaSize.w === 0 && deltaSize.h === 0) {
            return;
          }

          const deltaAbsSize = {
            w: abs(deltaSize.w),
            h: abs(deltaSize.h),
          };
          const deltaAbsRatio = {
            w: abs(round(sizeNew.w / (size.w / 100.0))),
            h: abs(round(sizeNew.h / (size.h / 100.0))),
          };
          const dprNew = getWindowDPR();
          const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          const dprChanged = dprNew !== dpr && dprNew > 0;
          const isZoom = deltaIsBigger && difference && dprChanged;

          if (isZoom) {
            const [scrollbarSize, scrollbarSizeChanged] = updateNativeScrollbarSizeCache();

            assignDeep(envInstance._nativeScrollbarsSize, scrollbarSize); // keep the object same!

            if (scrollbarSizeChanged) {
              triggerEvent();
            }
          }

          size = sizeNew;
          dpr = dprNew;
        };
      },
    },
  }))();
