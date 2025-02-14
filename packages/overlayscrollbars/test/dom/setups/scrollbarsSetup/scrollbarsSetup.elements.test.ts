import { vi, describe, test, beforeEach, expect } from 'vitest';
import type { StructureSetupElementsObj } from '../../../../src/setups/structureSetup/structureSetup.elements';
import type {
  ScrollbarsSetupElement,
  ScrollbarsSetupElementsObj,
  ScrollbarStructure,
} from '../../../../src/setups/scrollbarsSetup/scrollbarsSetup.elements';
import type { InitializationTarget } from '../../../../src/initialization';
import { createScrollbarsSetupElements } from '../../../../src/setups/scrollbarsSetup/scrollbarsSetup.elements';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNameScrollbarTransitionless,
} from '../../../../src/classnames';
import { createStructureSetup } from '../../../../src/setups';

vi.useFakeTimers();

const getTarget = () => document.body.firstElementChild as HTMLElement;

const domSnapshot = (element?: HTMLElement) => {
  const getResult = () => (element ? element.innerHTML : document.documentElement.outerHTML);
  return [getResult(), () => getResult()] as [string, () => string];
};

const createStructureSetupElementsProxy = (target: InitializationTarget) => {
  const [, , structureSetupState, structureSetupElements] = createStructureSetup(target);
  const [elements, appendElements] = createScrollbarsSetupElements(
    target,
    structureSetupElements,
    structureSetupState,
    () => () => {}
  );

  const destroy = appendElements();

  return [elements, destroy, structureSetupElements] as [
    elements: ScrollbarsSetupElementsObj,
    destroy: () => void,
    structureElements: StructureSetupElementsObj,
  ];
};

const assertCorrectDOMStructure = (
  elements: ScrollbarsSetupElementsObj,
  target: HTMLElement | ((isHorizontal?: boolean) => HTMLElement),
  getTargetStructure?: (
    structures: ScrollbarStructure[],
    isHorizontal?: boolean
  ) => ScrollbarStructure
) => {
  const getStructure = (isHorizontal?: boolean) =>
    isHorizontal
      ? elements._horizontal._scrollbarStructures
      : elements._vertical._scrollbarStructures;
  const assertScrollbarStructure = (isHorizontal?: boolean) => {
    const resolvedTarget = typeof target === 'function' ? target(isHorizontal) : target;
    const domScrollbar = resolvedTarget.querySelector(
      `.${isHorizontal ? classNameScrollbarHorizontal : classNameScrollbarVertical}`
    ) as HTMLElement;
    const structures = getStructure(isHorizontal);

    expect(structures.length).toBeGreaterThanOrEqual(1);

    const targetStructure = getTargetStructure?.(structures, isHorizontal) || structures[0];
    const isMainStructure = targetStructure === structures[0];
    const { _scrollbar, _track, _handle } = targetStructure;

    // classnames
    expect(domScrollbar).toEqual(expect.any(HTMLElement));
    expect(domScrollbar.classList.contains(classNameScrollbar)).toBe(true);
    expect(_track.classList.contains(classNameScrollbarTrack)).toBe(true);
    expect(_handle.classList.contains(classNameScrollbarHandle)).toBe(true);
    expect(_track.classList.length).toBe(1);
    expect(_handle.classList.length).toBe(1);
    if (isMainStructure) {
      // transitionless class should not be present (was present pre v2.6.0 though)
      expect(domScrollbar.classList.contains(classNameScrollbarTransitionless)).toBe(false);
    }

    // structure
    expect(_scrollbar).toBe(domScrollbar);
    expect(_track.closest(`.${classNameScrollbar}`)).toBe(_scrollbar);
    expect(_handle.closest(`.${classNameScrollbarTrack}`)).toBe(_track);
  };

  assertScrollbarStructure(true);
  assertScrollbarStructure();
};

describe('scrollbarsSetup.elements', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div></div>';
  });

  [false, true].forEach((targetIsObj) => {
    describe(`as target ${targetIsObj ? 'object' : 'element'}`, () => {
      test('initialization and destruction', () => {
        const target = getTarget();
        const [beforeInitSnapshot, beforeInitSnapshotFn] = domSnapshot();
        const [elements, destroy] = createStructureSetupElementsProxy(
          targetIsObj ? { target } : target
        );

        assertCorrectDOMStructure(elements, target);

        destroy();

        expect(beforeInitSnapshot).toBe(beforeInitSnapshotFn());
      });

      test('cloning', () => {
        const target = getTarget();
        const [beforeInitSnapshot, beforeInitSnapshotFn] = domSnapshot();
        const [elements, destroy] = createStructureSetupElementsProxy(
          targetIsObj ? { target } : target
        );
        const clonedHorizontalSlot = document.createElement('div');
        const clonedVerticalSlot = document.createElement('div');

        const [beforeCloneHorizontalSnapshot, beforeCloneHorizontalSnapshotFn] =
          domSnapshot(clonedHorizontalSlot);
        const [beforeCloneVerticalSnapshot, beforeCloneVerticalSnapshotFn] =
          domSnapshot(clonedVerticalSlot);

        const clonedHorizontal = elements._horizontal._clone();
        const clonedVertical = elements._vertical._clone();

        clonedHorizontalSlot.append(clonedHorizontal._scrollbar);
        clonedVerticalSlot.append(clonedVertical._scrollbar);

        target.append(clonedHorizontalSlot);
        target.append(clonedVerticalSlot);

        assertCorrectDOMStructure(elements, target);
        assertCorrectDOMStructure(
          elements,
          (isHorizontal) => (isHorizontal ? clonedHorizontalSlot : clonedVerticalSlot),
          (structures, isHorizontal) => {
            const clonedStructure = isHorizontal ? clonedHorizontal : clonedVertical;
            return structures.find(
              (structure) => structure._scrollbar === clonedStructure._scrollbar
            )!;
          }
        );

        destroy();

        // destroy cleans up clones as well
        expect(beforeCloneHorizontalSnapshot).toBe(beforeCloneHorizontalSnapshotFn());
        expect(beforeCloneVerticalSnapshot).toBe(beforeCloneVerticalSnapshotFn());

        clonedHorizontalSlot.remove();
        clonedVerticalSlot.remove();

        expect(beforeInitSnapshot).toBe(beforeInitSnapshotFn());
      });
    });
  });

  describe('addRemoveClass', () => {
    test('add & remove classes to both axis', () => {
      const target = getTarget();
      const [elements] = createStructureSetupElementsProxy(target);

      const horizontalStructures = elements._horizontal._scrollbarStructures;
      const verticalStructures = elements._vertical._scrollbarStructures;
      const className = 'aksjhdkasjd';

      // clones before have the class
      elements._horizontal._clone();
      elements._vertical._clone();

      elements._scrollbarsAddRemoveClass(className, true);

      // clones after do not have the class
      elements._horizontal._clone();
      elements._vertical._clone();

      horizontalStructures.forEach(({ _scrollbar }, i, arr) => {
        if (i === arr.length - 1) {
          expect(_scrollbar.classList.contains(className)).toBe(false);
        } else {
          expect(_scrollbar.classList.contains(className)).toBe(true);
        }
      });
      verticalStructures.forEach(({ _scrollbar }, i, arr) => {
        if (i === arr.length - 1) {
          expect(_scrollbar.classList.contains(className)).toBe(false);
        } else {
          expect(_scrollbar.classList.contains(className)).toBe(true);
        }
      });

      elements._scrollbarsAddRemoveClass(className);

      horizontalStructures.forEach(({ _scrollbar }) => {
        expect(_scrollbar.classList.contains(className)).toBe(false);
      });
      verticalStructures.forEach(({ _scrollbar }) => {
        expect(_scrollbar.classList.contains(className)).toBe(false);
      });
    });

    test('add & remove classes to individual axis', () => {
      const target = getTarget();
      const [elements] = createStructureSetupElementsProxy(target);

      const horizontalStructures = elements._horizontal._scrollbarStructures;
      const verticalStructures = elements._vertical._scrollbarStructures;
      const classNameHorizontal = 'hhhhhhhhh12sdsdf';
      const classNameVertical = 'vvvvvvv12sdsdf';

      // clones before have the class
      elements._horizontal._clone();
      elements._vertical._clone();

      elements._scrollbarsAddRemoveClass(classNameHorizontal, true, true);
      elements._scrollbarsAddRemoveClass(classNameVertical, true, false);

      // clones after do not have the class
      elements._horizontal._clone();
      elements._vertical._clone();

      horizontalStructures.forEach(({ _scrollbar }, i, arr) => {
        if (i === arr.length - 1) {
          expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(false);
          expect(_scrollbar.classList.contains(classNameVertical)).toBe(false);
        } else {
          expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(true);
          expect(_scrollbar.classList.contains(classNameVertical)).toBe(false);
        }
      });
      verticalStructures.forEach(({ _scrollbar }, i, arr) => {
        if (i === arr.length - 1) {
          expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(false);
          expect(_scrollbar.classList.contains(classNameVertical)).toBe(false);
        } else {
          expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(false);
          expect(_scrollbar.classList.contains(classNameVertical)).toBe(true);
        }
      });

      elements._scrollbarsAddRemoveClass(classNameHorizontal, false, true);
      elements._scrollbarsAddRemoveClass(classNameVertical, false, false);

      horizontalStructures.forEach(({ _scrollbar }) => {
        expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(false);
        expect(_scrollbar.classList.contains(classNameVertical)).toBe(false);
      });
      verticalStructures.forEach(({ _scrollbar }) => {
        expect(_scrollbar.classList.contains(classNameHorizontal)).toBe(false);
        expect(_scrollbar.classList.contains(classNameVertical)).toBe(false);
      });
    });
  });

  test('initialization and destruction in custom slot', () => {
    const target = getTarget();
    const slotFn = vi.fn(() => document.body);
    const [beforeInitSnapshot, beforeInitSnapshotFn] = domSnapshot();
    const [elements, destroy, structureElements] = createStructureSetupElementsProxy({
      target,
      scrollbars: {
        slot: slotFn,
      },
    });

    expect(slotFn).toHaveBeenCalledTimes(1);
    expect(slotFn).toHaveBeenCalledWith(
      structureElements._target,
      structureElements._host,
      structureElements._viewport
    );

    assertCorrectDOMStructure(elements, document.body);

    destroy();

    expect(beforeInitSnapshot).toBe(beforeInitSnapshotFn());
  });

  test('style', () => {
    const target = getTarget();
    const [elements] = createStructureSetupElementsProxy(target);
    const testStyle = (scrollbarSetupElement: ScrollbarsSetupElement) => {
      // before cloned elements have the style
      scrollbarSetupElement._clone();

      scrollbarSetupElement._style((structure) => {
        const { _scrollbar } = structure;
        return [_scrollbar, { width: '0px' }];
      });
      scrollbarSetupElement._style((structure) => {
        const { _track } = structure;
        return [_track, { width: '1px' }];
      });
      scrollbarSetupElement._style((structure) => {
        const { _handle } = structure;
        return [_handle, { width: '2px' }];
      });

      // before cloned elements don not have the style
      scrollbarSetupElement._clone();

      scrollbarSetupElement._scrollbarStructures.forEach(
        ({ _scrollbar, _track, _handle }, i, arr) => {
          if (i === arr.length - 1) {
            expect(_scrollbar.style.width).not.toBe('0px');
            expect(_track.style.width).not.toBe('1px');
            expect(_handle.style.width).not.toBe('2px');
          } else {
            expect(_scrollbar.style.width).toBe('0px');
            expect(_track.style.width).toBe('1px');
            expect(_handle.style.width).toBe('2px');
          }
        }
      );
    };

    testStyle(elements._horizontal);
    testStyle(elements._vertical);
  });
});
