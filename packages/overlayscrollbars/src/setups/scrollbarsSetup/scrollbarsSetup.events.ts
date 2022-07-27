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
import { getScrollbarHandleLengthRatio } from 'setups/scrollbarsSetup/scrollbarsSetup.calculations';
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
  scrollOffsetElm: HTMLElement,
  isHorizontal?: boolean
) => () => void;

const getPageOffset = (event: PointerEvent): XY<number> => ({
  x: event.pageX,
  y: event.pageY,
});
const getScale = (element: HTMLElement): XY<number> => {
  const { width, height } = getBoundingClientRect(element);
  const { w, h } = offsetSize(element);
  return {
    x: Math.round(width) / w || 1,
    y: Math.round(height) / h || 1,
  };
};
const continuePointerDown = (event: PointerEvent, options: ReadonlyOptions, scrollType: 'dragScroll' | 'clickScroll') => {
  const scrollbarOptions = options.scrollbars;
  const { button, isPrimary, pointerType } = event;
  const { pointers } = scrollbarOptions;
  return button === 0 && isPrimary && scrollbarOptions[scrollType] && (pointers || []).includes(pointerType);
}
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
        1 / getScrollbarHandleLengthRatio(structureSetupState(), isHorizontal);
      scrollOffsetElement[scrollOffsetKey] = mouseDownScroll + movement * handleLengthRatio;
      // if (_isRTL && isHorizontal && !_rtlScrollBehavior.i) scrollDelta *= -1;
    };

  return on(scrollbarHandle, 'pointerdown', (pointerDownEvent: PointerEvent) => {
    if (continuePointerDown(pointerDownEvent, options, 'dragScroll')) {
      const offSelectStart = on(doc, 'selectstart', (event: Event) => preventDefault(event), {
        _passive: false,
      });
      const offPointerMove = on(
        scrollbarHandle,
        'pointermove',
        createOnPointerMoveHandler(
          scrollOffsetElement[scrollOffsetKey] || 0,
          getPageOffset(pointerDownEvent)[xyKey],
          1 / getScale(scrollOffsetElement)[xyKey]
        )
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
      scrollbarHandle.setPointerCapture(pointerDownEvent.pointerId);
    }
  });
};

export const createScrollbarsSetupEvents =
  (options: ReadonlyOptions, structureSetupState: () => StructureSetupState): ScrollbarsSetupEvents =>
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
        options,
        documentElm,
        _handle,
        scrollOffsetElm,
        structureSetupState,
        isHorizontal
      ),
    ]);
  };
