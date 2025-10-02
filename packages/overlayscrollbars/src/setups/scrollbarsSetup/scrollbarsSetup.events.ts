import type { XY } from '../../support';
import type { ClickScrollPlugin } from '../../plugins';
import type { ReadonlyOptions } from '../../options';
import type { StructureSetupState } from '../../setups';
import type { ScrollbarsSetupElementsObj, ScrollbarStructure } from './scrollbarsSetup.elements';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import {
  classNameScrollbarHandle,
  classNameScrollbarInteraction,
  classNameScrollbarWheel,
  dataAttributeHost,
  dataAttributeViewport,
} from '../../classnames';
import { clickScrollPluginModuleName, getStaticPluginModuleInstance } from '../../plugins';
import {
  getBoundingClientRect,
  getOffsetSize,
  addEventListener,
  preventDefault,
  runEachAndClear,
  selfClearTimeout,
  parent,
  closest,
  push,
  bind,
  mathRound,
  strWidth,
  strHeight,
  getElementScroll,
  scrollElementTo,
  getFocusedElement,
  setT,
  hasAttr,
  stopAndPrevent,
  isFunction,
  mathAbs,
  focusElement,
} from '../../support';

export type ScrollbarsSetupEvents = (
  scrollbarStructure: ScrollbarStructure,
  scrollbarsAddRemoveClass: ScrollbarsSetupElementsObj['_scrollbarsAddRemoveClass'],
  isHorizontal?: boolean
) => () => void;

export const createScrollbarsSetupEvents = (
  options: ReadonlyOptions,
  structureSetupElements: StructureSetupElementsObj,
  structureSetupState: StructureSetupState,
  scrollbarHandlePointerInteraction: (event: PointerEvent) => void
): ScrollbarsSetupEvents => {
  return (scrollbarStructure, scrollbarsAddRemoveClass, isHorizontal) => {
    const {
      _host,
      _viewport,
      _viewportIsTarget,
      _scrollOffsetElement,
      _documentElm,
      _removeScrollObscuringStyles,
    } = structureSetupElements;
    const { _scrollbar, _track, _handle } = scrollbarStructure;
    const [wheelTimeout, clearWheelTimeout] = selfClearTimeout(333);
    const [scrollSnapScrollTransitionTimeout, clearScrollSnapScrollTransitionTimeout] =
      selfClearTimeout(444);
    const scrollOffsetElementScrollBy = (coordinates: XY<number>) => {
      if (isFunction(_scrollOffsetElement.scrollBy)) {
        _scrollOffsetElement.scrollBy({
          behavior: 'smooth',
          left: coordinates.x,
          top: coordinates.y,
        });
      }
    };

    const createInteractiveScrollEvents = () => {
      const releasePointerCaptureEvents = 'pointerup pointercancel lostpointercapture';
      const clientXYKey = `client${isHorizontal ? 'X' : 'Y'}` as 'clientX' | 'clientY';
      const widthHeightKey = isHorizontal ? strWidth : strHeight;
      const leftTopKey = isHorizontal ? 'left' : 'top';
      const whKey = isHorizontal ? 'w' : 'h';
      const xyKey = isHorizontal ? 'x' : 'y';

      const createRelativeHandleMove =
        (mouseDownScroll: number, invertedScale: number) => (deltaMovement: number) => {
          const { _overflowAmount } = structureSetupState;
          const handleTrackDiff = getOffsetSize(_track)[whKey] - getOffsetSize(_handle)[whKey];
          const scrollDeltaPercent = (invertedScale * deltaMovement) / handleTrackDiff;
          const scrollDelta = scrollDeltaPercent * _overflowAmount[xyKey];

          scrollElementTo(_scrollOffsetElement, {
            [xyKey]: mouseDownScroll + scrollDelta,
          });
        };
      const pointerdownCleanupFns: Array<() => void> = [];

      return addEventListener(_track, 'pointerdown', (pointerDownEvent: PointerEvent) => {
        const isDragScroll =
          closest(pointerDownEvent.target as Node, `.${classNameScrollbarHandle}`) === _handle;
        const pointerCaptureElement = isDragScroll ? _handle : _track;

        const scrollbarOptions = options.scrollbars;
        const dragClickScrollOption = scrollbarOptions[isDragScroll ? 'dragScroll' : 'clickScroll'];
        const { button, isPrimary, pointerType } = pointerDownEvent;
        const { pointers } = scrollbarOptions;

        const continuePointerDown =
          button === 0 &&
          isPrimary &&
          dragClickScrollOption &&
          (pointers || []).includes(pointerType);

        if (continuePointerDown) {
          runEachAndClear(pointerdownCleanupFns);
          clearScrollSnapScrollTransitionTimeout();

          const instantClickScroll =
            !isDragScroll && (pointerDownEvent.shiftKey || dragClickScrollOption === 'instant');
          const getHandleRect = bind(getBoundingClientRect, _handle);
          const getTrackRect = bind(getBoundingClientRect, _track);
          const getHandleOffset = (handleRect?: DOMRect, trackRect?: DOMRect) =>
            (handleRect || getHandleRect())[leftTopKey] - (trackRect || getTrackRect())[leftTopKey];
          const axisScale =
            mathRound(getBoundingClientRect(_scrollOffsetElement)[widthHeightKey]) /
              getOffsetSize(_scrollOffsetElement)[whKey] || 1;
          const moveHandleRelative = createRelativeHandleMove(
            getElementScroll(_scrollOffsetElement)[xyKey],
            1 / axisScale
          );
          const pointerDownOffset = pointerDownEvent[clientXYKey];
          const handleRect = getHandleRect();
          const trackRect = getTrackRect();
          const handleLength = handleRect[widthHeightKey];
          const handleCenter = getHandleOffset(handleRect, trackRect) + handleLength / 2;
          const relativeTrackPointerOffset = pointerDownOffset - trackRect[leftTopKey];
          const startOffset = isDragScroll ? 0 : relativeTrackPointerOffset - handleCenter;
          const releasePointerCapture = (pointerUpEvent: PointerEvent) => {
            runEachAndClear(pointerupCleanupFns);
            pointerCaptureElement.releasePointerCapture(pointerUpEvent.pointerId);
          };
          const nonAnimatedScroll = isDragScroll || instantClickScroll;
          const revertScrollObscuringStyles = _removeScrollObscuringStyles();

          const pointerupCleanupFns = [
            addEventListener(_documentElm, releasePointerCaptureEvents, releasePointerCapture),
            addEventListener(_documentElm, 'selectstart', (event: Event) => preventDefault(event), {
              _passive: false,
            }),
            addEventListener(_track, releasePointerCaptureEvents, releasePointerCapture),
            nonAnimatedScroll &&
              addEventListener(_track, 'pointermove', (pointerMoveEvent: PointerEvent) =>
                moveHandleRelative(
                  startOffset + (pointerMoveEvent[clientXYKey] - pointerDownOffset)
                )
              ),
            nonAnimatedScroll &&
              (() => {
                const withoutSnapScrollOffset = getElementScroll(_scrollOffsetElement);
                revertScrollObscuringStyles();
                const withSnapScrollOffset = getElementScroll(_scrollOffsetElement);
                const snapScrollDiff = {
                  x: withSnapScrollOffset.x - withoutSnapScrollOffset.x,
                  y: withSnapScrollOffset.y - withoutSnapScrollOffset.y,
                };

                if (mathAbs(snapScrollDiff.x) > 3 || mathAbs(snapScrollDiff.y) > 3) {
                  _removeScrollObscuringStyles();
                  scrollElementTo(_scrollOffsetElement, withoutSnapScrollOffset);
                  scrollOffsetElementScrollBy(snapScrollDiff);
                  scrollSnapScrollTransitionTimeout(revertScrollObscuringStyles);
                }
              }),
          ];

          pointerCaptureElement.setPointerCapture(pointerDownEvent.pointerId);

          if (instantClickScroll) {
            moveHandleRelative(startOffset);
          } else if (!isDragScroll) {
            const animateClickScroll = getStaticPluginModuleInstance<typeof ClickScrollPlugin>(
              clickScrollPluginModuleName
            );
            if (animateClickScroll) {
              const stopClickScrollAnimation = animateClickScroll(
                moveHandleRelative,
                startOffset,
                handleLength,
                (stopped) => {
                  // if the scroll animation doesn't continue with a press
                  if (stopped) {
                    revertScrollObscuringStyles();
                  } else {
                    push(pointerupCleanupFns, revertScrollObscuringStyles);
                  }
                }
              );

              push(pointerupCleanupFns, stopClickScrollAnimation);
              push(pointerdownCleanupFns, bind(stopClickScrollAnimation, true));
            }
          }
        }
      });
    };

    let wheelScrollBy = true;

    return bind(runEachAndClear, [
      addEventListener(_handle, 'pointermove pointerleave', scrollbarHandlePointerInteraction),
      addEventListener(_scrollbar, 'pointerenter', () => {
        scrollbarsAddRemoveClass(classNameScrollbarInteraction, true);
      }),
      addEventListener(_scrollbar, 'pointerleave pointercancel', () => {
        scrollbarsAddRemoveClass(classNameScrollbarInteraction, false);
      }),
      // focus viewport when clicking on a scrollbar (mouse only)
      !_viewportIsTarget &&
        addEventListener(_scrollbar, 'mousedown', () => {
          const focusedElement = getFocusedElement();
          // dont steal focus from buttons or other interactive elements
          if (
            hasAttr(focusedElement, dataAttributeViewport) ||
            hasAttr(focusedElement, dataAttributeHost) ||
            focusedElement === document.body
          ) {
            setT(bind(focusElement, _viewport), 25);
          }
        }),
      // propagate wheel events to viewport when mouse is over scrollbar
      addEventListener(
        _scrollbar,
        'wheel',
        (wheelEvent: WheelEvent) => {
          const { deltaX, deltaY, deltaMode } = wheelEvent;

          // the first wheel event is swallowed, simulate scroll to compensate for it
          if (wheelScrollBy && deltaMode === 0 && parent(_scrollbar) === _host) {
            scrollOffsetElementScrollBy({
              x: deltaX,
              y: deltaY,
            });
          }

          wheelScrollBy = false;
          scrollbarsAddRemoveClass(classNameScrollbarWheel, true);
          wheelTimeout(() => {
            wheelScrollBy = true;
            scrollbarsAddRemoveClass(classNameScrollbarWheel);
          });

          preventDefault(wheelEvent);
        },
        { _passive: false, _capture: true }
      ),
      // solve problem of interaction causing `click` events (https://github.com/KingSora/OverlayScrollbars/issues/251)
      // 1. on `scrollbar` pointer down register a `document` click event which gets prevented and propagation is stopped
      // 2. on `document` pointerup / pointercancel remove that click event after a timeout (in case the click is never triggered)
      addEventListener(
        _scrollbar,
        'pointerdown',
        () => {
          const removeClickEvent = addEventListener(
            _documentElm,
            'click',
            (clickEvent: Event) => {
              removePointerEvents();
              stopAndPrevent(clickEvent);
            },
            {
              _once: true,
              _capture: true,
              _passive: false,
            }
          );
          const removePointerEvents = addEventListener(
            _documentElm,
            'pointerup pointercancel',
            () => {
              removePointerEvents();
              setTimeout(removeClickEvent, 150);
            },
            {
              _capture: true,
              _passive: true,
            }
          );
        },
        { _capture: true, _passive: true }
      ),
      createInteractiveScrollEvents(),
      clearWheelTimeout,
      clearScrollSnapScrollTransitionTimeout,
    ]);
  };
};
