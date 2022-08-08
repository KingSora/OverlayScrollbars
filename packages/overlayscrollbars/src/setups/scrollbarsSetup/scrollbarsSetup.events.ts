import {
  directionIsRTL,
  getBoundingClientRect,
  offsetSize,
  on,
  preventDefault,
  runEachAndClear,
  stopPropagation,
  XY,
  selfCancelTimeout,
  parent,
} from 'support';
import { getEnvironment } from 'environment';
import { classNamesScrollbarInteraction, classNamesScrollbarWheel } from 'classnames';
import type { ReadonlyOptions } from 'options';
import type { StructureSetupState } from 'setups';
import type {
  ScrollbarsSetupElementsObj,
  ScrollbarStructure,
} from 'setups/scrollbarsSetup/scrollbarsSetup.elements';

export type ScrollbarsSetupEvents = (
  scrollbarStructure: ScrollbarStructure,
  scrollbarsAddRemoveClass: ScrollbarsSetupElementsObj['_scrollbarsAddRemoveClass'],
  documentElm: Document,
  hostElm: HTMLElement,
  scrollOffsetElm: HTMLElement,
  isHorizontal?: boolean
) => () => void;

const { round } = Math;
const getClientOffset = (event: PointerEvent): XY<number> => ({
  x: event.clientX,
  y: event.clientY,
});
const getScale = (element: HTMLElement): XY<number> => {
  const { width, height } = getBoundingClientRect(element);
  const { w, h } = offsetSize(element);
  return {
    x: round(width) / w || 1,
    y: round(height) / h || 1,
  };
};
const continuePointerDown = (
  event: PointerEvent,
  options: ReadonlyOptions,
  scrollType: 'dragScroll' | 'clickScroll'
) => {
  const scrollbarOptions = options.scrollbars;
  const { button, isPrimary, pointerType } = event;
  const { pointers } = scrollbarOptions;
  return (
    button === 0 &&
    isPrimary &&
    scrollbarOptions[scrollType] &&
    (pointers || []).includes(pointerType)
  );
};
const createRootClickStopPropagationEvents = (scrollbar: HTMLElement, documentElm: Document) =>
  on(
    scrollbar,
    'mousedown',
    on.bind(0, documentElm, 'click', stopPropagation, { _once: true, _capture: true }),
    { _capture: true }
  );
const createDragScrollingEvents = (
  options: ReadonlyOptions,
  doc: Document,
  scrollbarStructure: ScrollbarStructure,
  scrollOffsetElement: HTMLElement,
  structureSetupState: () => StructureSetupState,
  isHorizontal?: boolean
) => {
  const { _rtlScrollBehavior } = getEnvironment();
  const { _handle, _track, _scrollbar } = scrollbarStructure;
  const scrollOffsetKey = `scroll${isHorizontal ? 'Left' : 'Top'}`;
  const xyKey = `${isHorizontal ? 'x' : 'y'}`;
  const whKey = `${isHorizontal ? 'w' : 'h'}`;
  const createOnPointerMoveHandler =
    (mouseDownScroll: number, mouseDownClientOffset: number, mouseDownInvertedScale: number) =>
    (event: PointerEvent) => {
      const { _overflowAmount } = structureSetupState();
      const movement =
        (getClientOffset(event)[xyKey] - mouseDownClientOffset) * mouseDownInvertedScale;
      const handleTrackDiff = offsetSize(_track)[whKey] - offsetSize(_handle)[whKey];
      const scrollDeltaPercent = movement / handleTrackDiff;
      const scrollDelta = scrollDeltaPercent * _overflowAmount[xyKey];
      const isRTL = directionIsRTL(_scrollbar);
      const negateMultiplactor =
        isRTL && isHorizontal ? (_rtlScrollBehavior.n || _rtlScrollBehavior.i ? 1 : -1) : 1;

      scrollOffsetElement[scrollOffsetKey] = mouseDownScroll + scrollDelta * negateMultiplactor;
    };

  return on(_handle, 'pointerdown', (pointerDownEvent: PointerEvent) => {
    if (continuePointerDown(pointerDownEvent, options, 'dragScroll')) {
      const offSelectStart = on(doc, 'selectstart', (event: Event) => preventDefault(event), {
        _passive: false,
      });
      const offPointerMove = on(
        _handle,
        'pointermove',
        createOnPointerMoveHandler(
          scrollOffsetElement[scrollOffsetKey] || 0,
          getClientOffset(pointerDownEvent)[xyKey],
          1 / getScale(scrollOffsetElement)[xyKey]
        )
      );

      on(
        _handle,
        'pointerup',
        (pointerUpEvent: PointerEvent) => {
          offSelectStart();
          offPointerMove();
          _handle.releasePointerCapture(pointerUpEvent.pointerId);
        },
        { _once: true }
      );
      _handle.setPointerCapture(pointerDownEvent.pointerId);
    }
  });
};

export const createScrollbarsSetupEvents =
  (
    options: ReadonlyOptions,
    structureSetupState: () => StructureSetupState
  ): ScrollbarsSetupEvents =>
  (
    scrollbarStructure,
    scrollbarsAddRemoveClass,
    documentElm,
    hostElm,
    scrollOffsetElm,
    isHorizontal
  ) => {
    const { _scrollbar } = scrollbarStructure;
    const [wheelTimeout, clearScrollTimeout] = selfCancelTimeout(333);
    const scrollByFn = !!scrollOffsetElm.scrollBy;
    let wheelScrollBy = true;

    return runEachAndClear.bind(0, [
      on(_scrollbar, 'pointerenter', () => {
        scrollbarsAddRemoveClass(classNamesScrollbarInteraction, true);
      }),
      on(_scrollbar, 'pointerleave pointercancel', () => {
        scrollbarsAddRemoveClass(classNamesScrollbarInteraction);
      }),
      on(
        _scrollbar,
        'wheel',
        (wheelEvent: WheelEvent) => {
          const { deltaX, deltaY, deltaMode } = wheelEvent;

          // the first wheel event is swallowed, simulate scroll to compensate for it
          if (scrollByFn && wheelScrollBy && deltaMode === 0 && parent(_scrollbar) === hostElm) {
            scrollOffsetElm.scrollBy({
              left: deltaX,
              top: deltaY,
              behavior: 'smooth',
            });
          }

          wheelScrollBy = false;
          scrollbarsAddRemoveClass(classNamesScrollbarWheel, true);
          wheelTimeout(() => {
            wheelScrollBy = true;
            scrollbarsAddRemoveClass(classNamesScrollbarWheel);
          });

          preventDefault(wheelEvent);
        },
        { _passive: false, _capture: true }
      ),
      createRootClickStopPropagationEvents(_scrollbar, documentElm),
      createDragScrollingEvents(
        options,
        documentElm,
        scrollbarStructure,
        scrollOffsetElm,
        structureSetupState,
        isHorizontal
      ),
      clearScrollTimeout,
    ]);
  };
