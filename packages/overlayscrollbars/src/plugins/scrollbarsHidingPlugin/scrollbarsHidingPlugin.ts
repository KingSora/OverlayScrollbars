import {
  keys,
  attr,
  noop,
  each,
  assignDeep,
  windowSize,
  attrClass,
  wnd,
  mathAbs,
  mathRound,
  strMarginBottom,
  strMarginLeft,
  strMarginRight,
  strPaddingBottom,
  strPaddingLeft,
  strPaddingRight,
  strPaddingTop,
  strWidth,
  strHeight,
  getStyles,
  setStyles,
} from '~/support';
import { dataValueViewportArrange, dataAttributeViewport } from '~/classnames';
import type { WH, UpdateCache, XY } from '~/support';
import type { StyleObject, StyleObjectKey } from '~/typings';
import type { StructureSetupState } from '~/setups/structureSetup';
import type {
  ViewportOverflowState,
  GetViewportOverflowState,
  HideNativeScrollbars,
} from '~/setups/structureSetup/updateSegments/overflowUpdateSegment';
import type { InternalEnvironment } from '~/environment';
import type { StaticPlugin } from '~/plugins';

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

let contentArrangeCounter = 0;

export const scrollbarsHidingPluginName = '__osScrollbarsHidingPlugin';

export const ScrollbarsHidingPlugin = /* @__PURE__ */ (() => ({
  [scrollbarsHidingPluginName]: {
    static: () => ({
      _createUniqueViewportArrangeElement: (env: InternalEnvironment): false | HTMLStyleElement => {
        const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid, _cssCustomProperties } = env;
        const create =
          !_cssCustomProperties &&
          !_nativeScrollbarsHiding &&
          (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);
        const result = create ? document.createElement('style') : false;

        if (result) {
          attr(
            result,
            'id',
            `${dataAttributeViewport}-${dataValueViewportArrange}-${contentArrangeCounter}`
          );
          contentArrangeCounter++;
        }

        return result;
      },
      _overflowUpdateSegment: (
        doViewportArrange: boolean,
        flexboxGlue: boolean,
        viewport: HTMLElement,
        viewportArrange: HTMLStyleElement | false | null | undefined,
        state: StructureSetupState,
        getViewportOverflowState: GetViewportOverflowState,
        hideNativeScrollbars: HideNativeScrollbars
      ): [ArrangeViewport, UndoArrangeViewport] => {
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
            const { _viewportPaddingStyle } = state;
            const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
            const viewportArrangeHorizontalPaddingKey: keyof StyleObject = directionIsRTL
              ? strPaddingRight
              : strPaddingLeft;
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
                      `#${attr(
                        viewportArrange,
                        'id'
                      )} + [${dataAttributeViewport}~='${dataValueViewportArrange}']::before {}`,
                      0
                    );
                  }

                  // @ts-ignore
                  const ruleStyle = cssRules[0].style;

                  ruleStyle[strWidth] = arrangeSize.w;
                  ruleStyle[strHeight] = arrangeSize.h;
                }
              }
            } else {
              setStyles<'--os-vaw' | '--os-vah'>(viewport, {
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
            const { _viewportPaddingStyle: viewportPaddingStyle } = state;
            const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const finalPaddingStyle: StyleObject = {};
            const assignProps = (props: string[]) =>
              each(props, (prop) => {
                finalPaddingStyle[prop as StyleObjectKey] =
                  viewportPaddingStyle[prop as StyleObjectKey];
              });

            if (arrangeX) {
              assignProps([strMarginBottom, strPaddingTop, strPaddingBottom]);
            }

            if (arrangeY) {
              assignProps([strMarginLeft, strMarginRight, strPaddingLeft, strPaddingRight]);
            }

            const prevStyle = getStyles(viewport, keys(finalPaddingStyle) as StyleObjectKey[]);

            // add class
            attrClass(viewport, dataAttributeViewport, dataValueViewportArrange);

            if (!flexboxGlue) {
              finalPaddingStyle[strHeight] = '';
            }

            setStyles(viewport, finalPaddingStyle);

            return [
              () => {
                hideNativeScrollbars(
                  finalViewportOverflowState,
                  directionIsRTL,
                  doViewportArrange,
                  prevStyle
                );
                setStyles(viewport, prevStyle);
                // remove class
                attrClass(viewport, dataAttributeViewport, dataValueViewportArrange, true);
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
        const getWindowDPR = (): number => {
          const screen = wnd.screen;
          // eslint-disable-next-line
          // @ts-ignore
          const dDPI = screen.deviceXDPI || 0;
          // eslint-disable-next-line
          // @ts-ignore
          const sDPI = screen.logicalXDPI || 1;
          return wnd.devicePixelRatio || dDPI / sDPI;
        };
        const diffBiggerThanOne = (valOne: number, valTwo: number): boolean => {
          const absValOne = mathAbs(valOne);
          const absValTwo = mathAbs(valTwo);
          return !(
            absValOne === absValTwo ||
            absValOne + 1 === absValTwo ||
            absValOne - 1 === absValTwo
          );
        };

        return (
          envInstance: InternalEnvironment,
          updateNativeScrollbarSizeCache: UpdateCache<XY<number>>
        ): boolean | undefined => {
          const sizeNew = windowSize();
          const deltaSize = {
            w: sizeNew.w - size.w,
            h: sizeNew.h - size.h,
          };

          if (deltaSize.w === 0 && deltaSize.h === 0) {
            return;
          }

          const deltaAbsSize = {
            w: mathAbs(deltaSize.w),
            h: mathAbs(deltaSize.h),
          };
          const deltaAbsRatio = {
            w: mathAbs(mathRound(sizeNew.w / (size.w / 100.0))),
            h: mathAbs(mathRound(sizeNew.h / (size.h / 100.0))),
          };
          const dprNew = getWindowDPR();
          const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          const dprChanged = dprNew !== dpr && dprNew > 0;
          const isZoom = deltaIsBigger && difference && dprChanged;
          let scrollbarSizeChanged;
          let scrollbarSize;

          if (isZoom) {
            [scrollbarSize, scrollbarSizeChanged] = updateNativeScrollbarSizeCache();

            assignDeep(envInstance._nativeScrollbarsSize, scrollbarSize); // keep the object same!
          }

          size = sizeNew;
          dpr = dprNew;

          return scrollbarSizeChanged;
        };
      },
    }),
  },
}))() satisfies StaticPlugin<typeof scrollbarsHidingPluginName>;
