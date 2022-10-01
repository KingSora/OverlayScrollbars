import {
  directionIsRTL,
  getBoundingClientRect,
  offsetSize,
  on,
  preventDefault,
  runEachAndClear,
  stopPropagation,
  selfClearTimeout,
  parent,
  closest,
  push,
} from '~/support';
import { getPlugins, clickScrollPluginName } from '~/plugins';
import { getEnvironment } from '~/environment';
import {
  classNameScrollbarHandle,
  classNamesScrollbarInteraction,
  classNamesScrollbarWheel,
} from '~/classnames';
import type { XY } from '~/support';
import type { ClickScrollPluginInstance } from '~/plugins';
import type { ReadonlyOptions } from '~/options';
import type { StructureSetupState } from '~/setups';
import type {
  ScrollbarsSetupElementsObj,
  ScrollbarStructure,
} from '~/setups/scrollbarsSetup/scrollbarsSetup.elements';

export type ScrollbarsSetupEvents = (
  scrollbarStructure: ScrollbarStructure,
  scrollbarsAddRemoveClass: ScrollbarsSetupElementsObj['_scrollbarsAddRemoveClass'],
  documentElm: Document,
  hostElm: HTMLElement,
  scrollOffsetElm: HTMLElement,
  isHorizontal?: boolean
) => () => void;

const { round } = Math;
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
  isDragScroll: boolean
) => {
  const scrollbarOptions = options.scrollbars;
  const { button, isPrimary, pointerType } = event;
  const { pointers } = scrollbarOptions;
  return (
    button === 0 &&
    isPrimary &&
    scrollbarOptions[isDragScroll ? 'dragScroll' : 'clickScroll'] &&
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
const createInteractiveScrollEvents = (
  options: ReadonlyOptions,
  doc: Document,
  scrollbarStructure: ScrollbarStructure,
  scrollOffsetElement: HTMLElement,
  structureSetupState: () => StructureSetupState,
  isHorizontal?: boolean
) => {
  const { _rtlScrollBehavior } = getEnvironment();
  const { _handle, _track, _scrollbar } = scrollbarStructure;
  const scrollLeftTopKey = `scroll${isHorizontal ? 'Left' : 'Top'}`;
  const clientXYKey = `client${isHorizontal ? 'X' : 'Y'}`; // for pointer event (can't use xy because of IE11)
  const widthHeightKey = isHorizontal ? 'width' : 'height';
  const leftTopKey = isHorizontal ? 'left' : 'top'; // for BCR (can't use xy because of IE11)
  const whKey = isHorizontal ? 'w' : 'h';
  const xyKey = isHorizontal ? 'x' : 'y';

  const createRelativeHandleMove =
    (mouseDownScroll: number, invertedScale: number) => (deltaMovement: number) => {
      const { _overflowAmount } = structureSetupState();
      const handleTrackDiff = offsetSize(_track)[whKey] - offsetSize(_handle)[whKey];
      const scrollDeltaPercent = (invertedScale * deltaMovement) / handleTrackDiff;
      const scrollDelta = scrollDeltaPercent * _overflowAmount[xyKey];
      const isRTL = directionIsRTL(_scrollbar);
      const negateMultiplactor =
        isRTL && isHorizontal ? (_rtlScrollBehavior.n || _rtlScrollBehavior.i ? 1 : -1) : 1;

      scrollOffsetElement[scrollLeftTopKey] = mouseDownScroll + scrollDelta * negateMultiplactor;
    };

  return on(_track, 'pointerdown', (pointerDownEvent: PointerEvent) => {
    const isDragScroll =
      closest(pointerDownEvent.target as Node, `.${classNameScrollbarHandle}`) === _handle;

    if (continuePointerDown(pointerDownEvent, options, isDragScroll)) {
      const instantClickScroll = !isDragScroll && pointerDownEvent.shiftKey;
      const getHandleRect = () => getBoundingClientRect(_handle);
      const getTrackRect = () => getBoundingClientRect(_track);
      const getHandleOffset = (handleRect?: DOMRect, trackRect?: DOMRect) =>
        (handleRect || getHandleRect())[leftTopKey] - (trackRect || getTrackRect())[leftTopKey];
      const moveHandleRelative = createRelativeHandleMove(
        scrollOffsetElement[scrollLeftTopKey] || 0,
        1 / getScale(scrollOffsetElement)[xyKey]
      );
      const pointerDownOffset = pointerDownEvent[clientXYKey];
      const handleRect = getHandleRect();
      const trackRect = getTrackRect();
      const handleLength = handleRect[widthHeightKey];
      const handleCenter = getHandleOffset(handleRect, trackRect) + handleLength / 2;
      const relativeTrackPointerOffset = pointerDownOffset - trackRect[leftTopKey];
      const startOffset = isDragScroll ? 0 : relativeTrackPointerOffset - handleCenter;

      const offFns = [
        on(doc, 'selectstart', (event: Event) => preventDefault(event), {
          _passive: false,
        }),
        on(_track, 'pointermove', (pointerMoveEvent: PointerEvent) => {
          const relativeMovement = pointerMoveEvent[clientXYKey] - pointerDownOffset;

          if (isDragScroll || instantClickScroll) {
            moveHandleRelative(startOffset + relativeMovement);
          }
        }),
      ];

      if (instantClickScroll) {
        moveHandleRelative(startOffset);
      } else if (!isDragScroll) {
        const sizeObserverPlugin = getPlugins()[clickScrollPluginName] as
          | ClickScrollPluginInstance
          | undefined;

        if (sizeObserverPlugin) {
          push(
            offFns,
            sizeObserverPlugin._(
              moveHandleRelative,
              getHandleOffset,
              startOffset,
              handleLength,
              relativeTrackPointerOffset
            )
          );
        }
      }

      on(
        _track,
        'pointerup',
        (pointerUpEvent: PointerEvent) => {
          runEachAndClear(offFns);
          _track.releasePointerCapture(pointerUpEvent.pointerId);
        },
        { _once: true }
      );
      _track.setPointerCapture(pointerDownEvent.pointerId);
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
    const [wheelTimeout, clearScrollTimeout] = selfClearTimeout(333);
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
      createInteractiveScrollEvents(
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
