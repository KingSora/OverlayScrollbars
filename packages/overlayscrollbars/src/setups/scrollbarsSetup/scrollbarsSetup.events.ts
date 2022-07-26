import {
  getBoundingClientRect,
  offsetSize,
  on,
  preventDefault,
  runEachAndClear,
  stopPropagation,
  XY,
} from 'support';
import { classNamesScrollbarInteraction } from 'classnames';
import { getScrollbarHandleOffsetRatio } from 'setups/scrollbarsSetup/scrollbarsSetup.calculations';
import type { StructureSetupState } from 'setups';
import type {
  ScrollbarsSetupElementsObj,
  ScrollbarStructure,
} from 'setups/scrollbarsSetup/scrollbarsSetup.elements';

export type ScrollbarsSetupEvents = (
  scrollbarStructure: ScrollbarStructure,
  scrollbarsAddRemoveClass: ScrollbarsSetupElementsObj['_scrollbarsAddRemoveClass'],
  documentElm: Document,
  scrollOffsetElm: HTMLElement,
  isHorizontal?: boolean
) => () => void;

const getPageOffset = (event: PointerEvent): XY<number> => ({
  x: event.pageX,
  y: event.pageY,
});
const getInvertedScale = (element: HTMLElement): XY<number> => {
  const { width, height } = getBoundingClientRect(element);
  const { w, h } = offsetSize(element);
  return {
    x: 1 / (Math.round(width) / w) || 1,
    y: 1 / (Math.round(height) / h) || 1,
  };
};
const createRootClickStopPropagationEvents = (scrollbar: HTMLElement, documentElm: Document) =>
  on(
    scrollbar,
    'mousedown',
    on.bind(0, documentElm, 'click', stopPropagation, { _once: true, _capture: true }),
    { _capture: true }
  );
const createDragScrollingEvents = (
  doc: Document,
  scrollbarHandle: HTMLElement,
  scrollOffsetElement: HTMLElement,
  structureSetupState: () => StructureSetupState,
  isHorizontal?: boolean
) => {
  const scrollOffsetKey = `scroll${isHorizontal ? 'Left' : 'Top'}`;
  const xyKey = `${isHorizontal ? 'x' : 'y'}`;
  const createOnPointerMoveHandler =
    (mouseDownScroll: number, mouseDownPageOffset: number, mouseDownInvertedScale: number) =>
    (event: PointerEvent) => {
      const movement = (getPageOffset(event)[xyKey] - mouseDownPageOffset) * mouseDownInvertedScale;
      const handleLengthRatio =
        1 / getScrollbarHandleOffsetRatio(structureSetupState(), scrollOffsetElement, isHorizontal);
      scrollOffsetElement[scrollOffsetKey] = mouseDownScroll + movement * handleLengthRatio;
      // if (_isRTL && isHorizontal && !_rtlScrollBehavior.i) scrollDelta *= -1;
    };

  return on(scrollbarHandle, 'pointerdown', (pointerDownEvent: PointerEvent) => {
    const { button, isPrimary, pointerId } = pointerDownEvent;

    if (button === 0 && isPrimary) {
      const mouseDownScroll = scrollOffsetElement[scrollOffsetKey] || 0;
      const mouseDownPageOffset = getPageOffset(pointerDownEvent)[xyKey];
      const mouseDownInvertedScale = getInvertedScale(scrollOffsetElement)[xyKey];
      const offSelectStart = on(doc, 'selectstart', (event: Event) => preventDefault(event), {
        _passive: false,
      });
      const offPointerMove = on(
        scrollbarHandle,
        'pointermove',
        createOnPointerMoveHandler(mouseDownScroll, mouseDownPageOffset, mouseDownInvertedScale)
      );

      on(
        scrollbarHandle,
        'pointerup',
        (pointerUpEvent: PointerEvent) => {
          offSelectStart();
          offPointerMove();
          scrollbarHandle.releasePointerCapture(pointerUpEvent.pointerId);
        },
        { _once: true }
      );
      scrollbarHandle.setPointerCapture(pointerId);
    }
  });
};

export const createScrollbarsSetupEvents =
  (structureSetupState: () => StructureSetupState): ScrollbarsSetupEvents =>
  (scrollbarStructure, scrollbarsAddRemoveClass, documentElm, scrollOffsetElm, isHorizontal) => {
    const { _scrollbar, _handle } = scrollbarStructure;

    return runEachAndClear.bind(0, [
      on(_scrollbar, 'pointerenter', () => {
        scrollbarsAddRemoveClass(classNamesScrollbarInteraction, true);
      }),
      on(_scrollbar, 'pointerleave pointercancel', () => {
        scrollbarsAddRemoveClass(classNamesScrollbarInteraction);
      }),
      createRootClickStopPropagationEvents(_scrollbar, documentElm),
      createDragScrollingEvents(
        documentElm,
        _handle,
        scrollOffsetElm,
        structureSetupState,
        isHorizontal
      ),
    ]);
  };
