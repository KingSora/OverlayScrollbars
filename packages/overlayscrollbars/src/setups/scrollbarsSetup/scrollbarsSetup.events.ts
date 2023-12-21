import {
  getBoundingClientRect,
  offsetSize,
  addEventListener,
  preventDefault,
  runEachAndClear,
  stopPropagation,
  selfClearTimeout,
  parent,
  closest,
  push,
  bind,
  mathRound,
  strWidth,
  strHeight,
  getElmentScroll,
  scrollElementTo,
  addAttrClass,
} from '~/support';
import { clickScrollPluginModuleName, getStaticPluginModuleInstance } from '~/plugins';
import {
  classNameScrollbarHandle,
  classNameScrollbarInteraction,
  classNameScrollbarWheel,
  dataAttributeHost,
  dataValueHostScrollbarPressed,
} from '~/classnames';
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
  structureSetupState: StructureSetupState
): ScrollbarsSetupEvents => {
  const { _host, _scrollOffsetElement, _documentElm } = structureSetupElements;

  return (
    scrollbarStructure,
    scrollbarsAddRemoveClass,
    refreshScrollbarStructuresHandleOffset,
    isHorizontal
  ) => {
    const { _scrollbar, _track, _handle } = scrollbarStructure;
    const [wheelTimeout, clearWheelTimeout] = selfClearTimeout(333);
    const [requestHandleTransitionAnimationFrame, cancelHandleTransitionTimeout] =
      selfClearTimeout();
    const refreshHandleOffsetTransition = bind(
      refreshScrollbarStructuresHandleOffset,
      [scrollbarStructure],
      isHorizontal
    );
    const scrollByFn = !!_scrollOffsetElement.scrollBy;

    const clientXYKey = `client${isHorizontal ? 'X' : 'Y'}` as 'clientX' | 'clientY'; // for pointer event (can't use xy because of IE11)
    const widthHeightKey = isHorizontal ? strWidth : strHeight;
    const leftTopKey = isHorizontal ? 'left' : 'top'; // for BCR (can't use xy because of IE11)
    const whKey = isHorizontal ? 'w' : 'h';
    const xyKey = isHorizontal ? 'x' : 'y';

    const isAffectingTransition = (event: TransitionEvent) =>
      event.propertyName.indexOf(widthHeightKey) > -1;

    const createInteractiveScrollEvents = () => {
      const releasePointerCaptureEvents = 'pointerup pointerleave pointercancel lostpointercapture';

      const createRelativeHandleMove =
        (mouseDownScroll: number, invertedScale: number) => (deltaMovement: number) => {
          const { _overflowAmount } = structureSetupState;
          const handleTrackDiff = offsetSize(_track)[whKey] - offsetSize(_handle)[whKey];
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
          const instantClickScroll = !isDragScroll && pointerDownEvent.shiftKey;
          const getHandleRect = bind(getBoundingClientRect, _handle);
          const getTrackRect = bind(getBoundingClientRect, _track);
          const getHandleOffset = (handleRect?: DOMRect, trackRect?: DOMRect) =>
            (handleRect || getHandleRect())[leftTopKey] - (trackRect || getTrackRect())[leftTopKey];
          const axisScale =
            mathRound(getBoundingClientRect(_scrollOffsetElement)[widthHeightKey]) /
              offsetSize(_scrollOffsetElement)[whKey] || 1;
          const moveHandleRelative = createRelativeHandleMove(
            getElmentScroll(_scrollOffsetElement)[xyKey] || 0,
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
          const removeAttrClass = addAttrClass(
            _host,
            dataAttributeHost,
            dataValueHostScrollbarPressed
          );

          const offFns = [
            removeAttrClass,
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

    return bind(runEachAndClear, [
      addEventListener(_scrollbar, 'pointerenter', () => {
        scrollbarsAddRemoveClass(classNameScrollbarInteraction, true);
      }),
      addEventListener(_scrollbar, 'pointerleave pointercancel', () => {
        scrollbarsAddRemoveClass(classNameScrollbarInteraction, false);
      }),
      addEventListener(
        _scrollbar,
        'wheel',
        (wheelEvent: WheelEvent) => {
          const { deltaX, deltaY, deltaMode } = wheelEvent;

          // the first wheel event is swallowed, simulate scroll to compensate for it
          if (scrollByFn && wheelScrollBy && deltaMode === 0 && parent(_scrollbar) === _host) {
            _scrollOffsetElement.scrollBy({
              left: deltaX,
              top: deltaY,
              behavior: 'smooth',
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
          cancelHandleTransitionTimeout();
          refreshHandleOffsetTransition();
        }
      }),
      // rootClickStopPropagationEvent
      addEventListener(
        _scrollbar,
        'mousedown',
        bind(addEventListener, _documentElm, 'click', stopPropagation, {
          _once: true,
          _capture: true,
        }),
        { _capture: true }
      ),
      createInteractiveScrollEvents(),
      clearWheelTimeout,
      cancelHandleTransitionTimeout,
    ]);
  };
};
