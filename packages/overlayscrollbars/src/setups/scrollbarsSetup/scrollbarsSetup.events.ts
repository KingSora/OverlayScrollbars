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
} from '~/support';
import { clickScrollPluginModuleName, getStaticPluginModuleInstance } from '~/plugins';
import {
  classNameScrollbarHandle,
  classNameScrollbarInteraction,
  classNameScrollbarWheel,
  dataAttributeHost,
  dataAttributeViewport,
  dataValueViewportScrollbarPressed,
} from '~/classnames';
import type { XY } from '~/support';
import type { ClickScrollPlugin } from '~/plugins';
import type { ReadonlyOptions } from '~/options';
import type { StructureSetupState } from '~/setups';
import type { ScrollbarsSetupElementsObj, ScrollbarStructure } from './scrollbarsSetup.elements';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';

export type ScrollbarsSetupEvents = (
  scrollbarStructure: ScrollbarStructure,
  scrollbarsAddRemoveClass: ScrollbarsSetupElementsObj['_scrollbarsAddRemoveClass'],
  refreshScrollbarStructuresHandleOffset: (
    scrollbarStructure: ScrollbarStructure[],
    isHorizontal?: boolean
  ) => void,
  isHorizontal?: boolean
) => () => void;

export const createScrollbarsSetupEvents = (
  options: ReadonlyOptions,
  structureSetupElements: StructureSetupElementsObj,
  structureSetupState: StructureSetupState,
  scrollbarHandlePointerInteraction: (event: PointerEvent) => void
): ScrollbarsSetupEvents => {
  return (
    scrollbarStructure,
    scrollbarsAddRemoveClass,
    refreshScrollbarStructuresHandleOffset,
    isHorizontal
  ) => {
    const {
      _host,
      _viewport,
      _viewportIsTarget,
      _scrollOffsetElement,
      _documentElm,
      _viewportAddRemoveClass,
    } = structureSetupElements;
    const { _scrollbar, _track, _handle } = scrollbarStructure;
    const [wheelTimeout, clearWheelTimeout] = selfClearTimeout(333);
    const [scrollSnapScrollTransitionTimeout, clearScrollSnapScrollTransitionTimeout] =
      selfClearTimeout(444);
    const [requestHandleTransitionAnimationFrame, clearHandleTransitionTimeout] =
      selfClearTimeout();
    const refreshHandleOffsetTransition = bind(
      refreshScrollbarStructuresHandleOffset,
      [scrollbarStructure],
      isHorizontal
    );
    const scrollOffsetElementScrollBy = (coordinates: XY<number>) => {
      isFunction(_scrollOffsetElement.scrollBy) &&
        _scrollOffsetElement.scrollBy({
          behavior: 'smooth',
          left: coordinates.x,
          top: coordinates.y,
        });
    };
    const widthHeightKey = isHorizontal ? strWidth : strHeight;

    const createInteractiveScrollEvents = () => {
      const releasePointerCaptureEvents = 'pointerup pointercancel lostpointercapture';
      const clientXYKey = `client${isHorizontal ? 'X' : 'Y'}` as 'clientX' | 'clientY';
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

      return addEventListener(_track, 'pointerdown', (pointerDownEvent: PointerEvent) => {
        const isDragScroll =
          closest(pointerDownEvent.target as Node, `.${classNameScrollbarHandle}`) === _handle;
        const pointerCaptureElement = isDragScroll ? _handle : _track;

        const scrollbarOptions = options.scrollbars;
        const { button, isPrimary, pointerType } = pointerDownEvent;
        const { pointers } = scrollbarOptions;

        const continuePointerDown =
          button === 0 &&
          isPrimary &&
          scrollbarOptions[isDragScroll ? 'dragScroll' : 'clickScroll'] &&
          (pointers || []).includes(pointerType);

        if (continuePointerDown) {
          clearScrollSnapScrollTransitionTimeout();

          const instantClickScroll = !isDragScroll && pointerDownEvent.shiftKey;
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
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            runEachAndClear(offFns);
            pointerCaptureElement.releasePointerCapture(pointerUpEvent.pointerId);
          };
          const addScrollbarPressedClass = () =>
            _viewportAddRemoveClass(dataValueViewportScrollbarPressed, true);
          const removeScrollbarPressedClass = addScrollbarPressedClass();

          const offFns = [
            () => {
              const withoutSnapScrollOffset = getElementScroll(_scrollOffsetElement);
              removeScrollbarPressedClass();
              const withSnapScrollOffset = getElementScroll(_scrollOffsetElement);
              const snapScrollDiff = {
                x: withSnapScrollOffset.x - withoutSnapScrollOffset.x,
                y: withSnapScrollOffset.y - withoutSnapScrollOffset.y,
              };

              if (mathAbs(snapScrollDiff.x) > 3 || mathAbs(snapScrollDiff.y) > 3) {
                addScrollbarPressedClass();
                scrollElementTo(_scrollOffsetElement, withoutSnapScrollOffset);
                scrollOffsetElementScrollBy(snapScrollDiff);
                scrollSnapScrollTransitionTimeout(removeScrollbarPressedClass);
              }
            },
            addEventListener(_documentElm, releasePointerCaptureEvents, releasePointerCapture),
            addEventListener(_documentElm, 'selectstart', (event: Event) => preventDefault(event), {
              _passive: false,
            }),
            addEventListener(_track, releasePointerCaptureEvents, releasePointerCapture),
            addEventListener(_track, 'pointermove', (pointerMoveEvent: PointerEvent) => {
              const relativeMovement = pointerMoveEvent[clientXYKey] - pointerDownOffset;

              if (isDragScroll || instantClickScroll) {
                moveHandleRelative(startOffset + relativeMovement);
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

            animateClickScroll &&
              push(
                offFns,
                animateClickScroll(
                  moveHandleRelative,
                  getHandleOffset,
                  startOffset,
                  handleLength,
                  relativeTrackPointerOffset
                )
              );
          }
        }
      });
    };

    let wheelScrollBy = true;
    const isAffectingTransition = (event: TransitionEvent) =>
      event.propertyName.indexOf(widthHeightKey) > -1;

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
      // when the handle has a size transition, update the handle offset each frame for the time of the transition
      addEventListener(_handle, 'transitionstart', (event: TransitionEvent) => {
        if (isAffectingTransition(event)) {
          const animateHandleOffset = () => {
            refreshHandleOffsetTransition();
            requestHandleTransitionAnimationFrame(animateHandleOffset);
          };
          animateHandleOffset();
        }
      }),
      addEventListener(_handle, 'transitionend transitioncancel', (event: TransitionEvent) => {
        if (isAffectingTransition(event)) {
          clearHandleTransitionTimeout();
          refreshHandleOffsetTransition();
        }
      }),
      // solve problem of interaction causing click events
      addEventListener(
        _scrollbar,
        'pointerdown',
        // stopPropagation for stopping event propagation (causing click listeners to be invoked)
        // preventDefault to prevent the pointer to cause any actions (e.g. releasing mouse button over an <a> tag causes an navigation)
        bind(addEventListener, _documentElm, 'click', stopAndPrevent, {
          _once: true,
          _capture: true,
          _passive: false,
        }),
        { _capture: true }
      ),
      createInteractiveScrollEvents(),
      clearWheelTimeout,
      clearScrollSnapScrollTransitionTimeout,
      clearHandleTransitionTimeout,
    ]);
  };
};
