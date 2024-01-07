import {
  keys,
  attr,
  noop,
  each,
  assignDeep,
  windowSize,
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
  addAttrClass,
  removeAttrClass,
} from '~/support';
import { dataValueViewportArrange, dataAttributeViewport } from '~/classnames';
import {
  getShowNativeOverlaidScrollbars,
  getViewportOverflowState,
} from '~/setups/structureSetup/structureSetup.utils';
import type { ObserversSetupState } from '~/setups';
import type { Options, OptionsCheckFn } from '~/options';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { ViewportOverflowState } from '~/setups/structureSetup/structureSetup.utils';
import type { InternalEnvironment } from '~/environment';
import type { UpdateCache, WH, XY } from '~/support';
import type { StyleObject, StyleObjectKey } from '~/typings';
import type { StructureSetupState } from '~/setups/structureSetup';
import type { StaticPlugin } from '~/plugins';

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
      _viewportArrangement: (
        structureSetupElements: StructureSetupElementsObj,
        structureSetupState: StructureSetupState,
        observersSetupState: ObserversSetupState,
        env: InternalEnvironment,
        checkOptions: OptionsCheckFn<Options>
      ) => {
        const { _viewportIsTarget, _viewport, _viewportArrange } = structureSetupElements;
        const {
          _nativeScrollbarsHiding,
          _nativeScrollbarsOverlaid,
          _flexboxGlue,
          _nativeScrollbarsSize,
        } = env;
        const doViewportArrange =
          !_viewportIsTarget &&
          !_nativeScrollbarsHiding &&
          (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);
        const [showNativeOverlaidScrollbars] = getShowNativeOverlaidScrollbars(checkOptions, env);

        const _getViewportOverflowHideOffset = (viewportOverflowState: ViewportOverflowState) => {
          const { _overflowScroll } = viewportOverflowState;
          const arrangeHideOffset =
            _nativeScrollbarsHiding || showNativeOverlaidScrollbars ? 0 : 42;

          const getHideOffsetPerAxis = (
            isOverlaid: boolean,
            overflowScroll: boolean,
            nativeScrollbarSize: number
          ) => {
            const nonScrollbarStylingHideOffset = isOverlaid
              ? arrangeHideOffset
              : nativeScrollbarSize;
            const scrollbarsHideOffset =
              overflowScroll && !_nativeScrollbarsHiding ? nonScrollbarStylingHideOffset : 0;
            const scrollbarsHideOffsetArrange = isOverlaid && !!arrangeHideOffset;

            return [scrollbarsHideOffset, scrollbarsHideOffsetArrange] as const;
          };

          const [xScrollbarsHideOffset, xScrollbarsHideOffsetArrange] = getHideOffsetPerAxis(
            _nativeScrollbarsOverlaid.x,
            _overflowScroll.x,
            _nativeScrollbarsSize.x
          );
          const [yScrollbarsHideOffset, yScrollbarsHideOffsetArrange] = getHideOffsetPerAxis(
            _nativeScrollbarsOverlaid.y,
            _overflowScroll.y,
            _nativeScrollbarsSize.y
          );

          return {
            _scrollbarsHideOffset: {
              x: xScrollbarsHideOffset,
              y: yScrollbarsHideOffset,
            },
            _scrollbarsHideOffsetArrange: {
              x: xScrollbarsHideOffsetArrange,
              y: yScrollbarsHideOffsetArrange,
            },
          };
        };

        /**
         * Hides the native scrollbars according to the passed parameters.
         * @param viewportOverflowState The viewport overflow state.
         * @param directionIsRTL Whether the direction is RTL or not.
         * @param viewportArrange Whether special styles related to the viewport arrange strategy shall be applied.
         * @param viewportStyleObj The viewport style object to which the needed styles shall be applied.
         */
        const _hideNativeScrollbars = (
          viewportOverflowState: ViewportOverflowState,
          { _directionIsRTL }: ObserversSetupState,
          viewportArrange: boolean,
          viewportStyleObj: StyleObject
        ): void => {
          assignDeep(viewportStyleObj, {
            [strMarginRight]: 0,
            [strMarginBottom]: 0,
            [strMarginLeft]: 0,
          });
          if (!_viewportIsTarget) {
            const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } =
              _getViewportOverflowHideOffset(viewportOverflowState);
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
            const { _viewportPaddingStyle } = structureSetupState;
            const horizontalMarginKey: keyof StyleObject = _directionIsRTL
              ? strMarginLeft
              : strMarginRight;
            const viewportHorizontalPaddingKey: keyof StyleObject = _directionIsRTL
              ? strPaddingLeft
              : strPaddingRight;
            const horizontalMarginValue = _viewportPaddingStyle[horizontalMarginKey] as number;
            const verticalMarginValue = _viewportPaddingStyle[strMarginBottom] as number;
            const horizontalPaddingValue = _viewportPaddingStyle[
              viewportHorizontalPaddingKey
            ] as number;
            const verticalPaddingValue = _viewportPaddingStyle[strPaddingBottom] as number;

            // horizontal
            viewportStyleObj[strWidth] = `calc(100% + ${
              hideOffsetY + horizontalMarginValue * -1
            }px)`;
            viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;

            // vertical
            viewportStyleObj[strMarginBottom] = -hideOffsetX + verticalMarginValue;

            // viewport arrange additional styles
            if (viewportArrange) {
              viewportStyleObj[viewportHorizontalPaddingKey] =
                horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
              viewportStyleObj[strPaddingBottom] =
                verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
            }
          }
        };

        /**
         * Sets the styles of the viewport arrange element.
         * @param viewportOverflowState The viewport overflow state according to which the scrollbars shall be hidden.
         * @param viewportScrollSize The content scroll size.
         * @param directionIsRTL Whether the direction is RTL or not.
         * @returns A boolean which indicates whether the viewport arrange element was adjusted.
         */
        const _arrangeViewport = (
          viewportOverflowState: ViewportOverflowState,
          viewportScrollSize: WH<number>,
          sizeFraction: WH<number>
        ) => {
          if (doViewportArrange) {
            const { _viewportPaddingStyle } = structureSetupState;
            const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } =
              _getViewportOverflowHideOffset(viewportOverflowState);
            const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
            const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
            const { _directionIsRTL } = observersSetupState;
            const viewportArrangeHorizontalPaddingKey: keyof StyleObject = _directionIsRTL
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
            if (_viewportArrange) {
              const { sheet } = _viewportArrange;
              if (sheet) {
                const { cssRules } = sheet;
                if (cssRules) {
                  if (!cssRules.length) {
                    sheet.insertRule(
                      `#${attr(
                        _viewportArrange,
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
              setStyles(_viewport, {
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
        const _undoViewportArrange = (viewportOverflowState?: ViewportOverflowState) => {
          if (doViewportArrange) {
            const finalViewportOverflowState =
              viewportOverflowState || getViewportOverflowState(structureSetupElements);
            const { _viewportPaddingStyle: viewportPaddingStyle } = structureSetupState;
            const { _scrollbarsHideOffsetArrange } = _getViewportOverflowHideOffset(
              finalViewportOverflowState
            );
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

            const prevStyle = getStyles(_viewport, keys(finalPaddingStyle) as StyleObjectKey[]);
            removeAttrClass(_viewport, dataAttributeViewport, dataValueViewportArrange);

            if (!_flexboxGlue) {
              finalPaddingStyle[strHeight] = '';
            }

            setStyles(_viewport, finalPaddingStyle);

            return [
              () => {
                _hideNativeScrollbars(
                  finalViewportOverflowState,
                  observersSetupState,
                  doViewportArrange,
                  prevStyle
                );
                setStyles(_viewport, prevStyle);
                addAttrClass(_viewport, dataAttributeViewport, dataValueViewportArrange);
              },
              finalViewportOverflowState,
            ] as const;
          }
          return [noop] as const;
        };

        return {
          _getViewportOverflowHideOffset,
          _arrangeViewport,
          _undoViewportArrange,
          _hideNativeScrollbars,
        };
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
