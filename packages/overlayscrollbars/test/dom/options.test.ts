import { describe, test, expect } from 'vitest';
import type { PartialOptions } from '../../src/options';
import { createOptionCheck, defaultOptions, getOptionsDiff } from '../../src/options';
import { assignDeep } from '../../src/support';

describe('options', () => {
  test('defaultOptions', () => {
    expect(defaultOptions).toEqual({
      paddingAbsolute: false,
      showNativeOverlaidScrollbars: false,
      update: {
        elementEvents: [['img', 'load']],
        debounce: [0, 33],
        attributes: null,
        ignoreMutation: null,
      },
      overflow: {
        x: 'scroll',
        y: 'scroll',
      },
      scrollbars: {
        theme: 'os-theme-dark',
        visibility: 'auto',
        autoHide: 'never',
        autoHideDelay: 1300,
        autoHideSuspend: false,
        dragScroll: true,
        clickScroll: false,
        pointers: ['mouse', 'touch', 'pen'],
      },
    });
  });

  describe('getOptionsDiff', () => {
    test('diff simple options', () => {
      const options = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      };
      const changed = {
        a: 0,
        b: 0,
      };

      expect(getOptionsDiff(options, options)).toEqual({});
      expect(getOptionsDiff(options, changed)).toEqual(changed);

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
        })
      ).toEqual(changed);
    });

    test('diff same looking primitive options', () => {
      const options = {
        a: 1,
        b: {
          c: '2',
          d: false,
          e: {
            f: [],
          },
        },
      };
      const changed = {
        a: 1,
        b: {
          c: '2',
          d: false,
          e: {
            f: [],
          },
        },
      };

      expect(getOptionsDiff(options, changed)).toEqual({});

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
        })
      ).toEqual({});
    });

    test('diff same looking primitive and non-primitive options', () => {
      const gFn = () => {};
      const options = {
        a: 1,
        b: {
          c: '2',
          d: [() => {}],
          e: {
            f: [],
            g: gFn,
          },
        },
      };
      const changed = {
        a: 1,
        b: {
          c: '2',
          d: [() => {}],
          e: {
            f: [],
            g: gFn,
          },
        },
      };

      expect(getOptionsDiff(options, changed)).toEqual({
        b: {
          d: changed.b.d,
        },
      });

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
        })
      ).toEqual({
        b: {
          d: changed.b.d,
        },
      });
    });

    test('diff nested options', () => {
      const options = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        deep: {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
      };
      const changed = {
        a: 0,
        b: 0,
        deep: {
          a: 0,
          b: 0,
        },
      };

      expect(getOptionsDiff(options, options)).toEqual({});
      expect(getOptionsDiff(options, changed)).toEqual(changed);

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
        })
      ).toEqual(changed);

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
          deep: {
            ...options.deep,
            ...changed.deep,
          },
        })
      ).toEqual(changed);
    });

    test('diff foreign options', () => {
      const options = {
        a: 1,
        b: 2,
        c: 3,
      };
      const changed = {
        a: 0,
        d: 4,
        e: 5,
      };

      expect(getOptionsDiff(options, changed)).toEqual(changed);

      expect(
        getOptionsDiff(options, {
          ...options,
          ...changed,
        })
      ).toEqual(changed);
    });

    describe('diff arrays', () => {
      test('dont diff same looking arrays with primitve values', () => {
        const options = {
          a: [],
          b: [1, 2, 3],
          c: ['1', '2', '3'],
          d: [true, false, false],
        };
        const changed = {
          a: [],
          b: [1, 2, 3],
          c: ['1', '2', '3'],
          d: [true, false, false],
        };

        expect(
          getOptionsDiff(options, {
            ...options,
            ...changed,
          })
        ).toEqual({});

        expect(getOptionsDiff(options, changed)).toEqual({});
      });

      test('dont diff same looking arrays with non-primitve values', () => {
        const options = {
          a: [],
          b: [{ a: 1 }, { b: 2 }, { c: 3 }, ['tuple1', 'tuple2'], []],
          c: [
            ['tuple1', 'tuple2'],
            ['tuple1', 'tuple2'],
            ['tuple1', 'tuple2'],
          ],
        };
        const changed = {
          a: [],
          b: [{ a: 1 }, { b: 2 }, { c: 3 }, ['tuple1', 'tuple2'], []],
          c: [
            ['tuple1', 'tuple2'],
            ['tuple1', 'tuple2'],
            ['tuple1', 'tuple2'],
          ],
        };

        expect(
          getOptionsDiff(options, {
            ...options,
            ...changed,
          })
        ).toEqual({});

        expect(getOptionsDiff(options, changed)).toEqual({});
      });

      test('diff arrays with primitve values', () => {
        const options = {
          a: [] as string[],
          b: [1, 2, 3],
          c: ['1', '2', '3'],
          d: [true, false, false],
        };
        const changed = {
          a: ['hello'],
          b: [1, 2, 3, 4],
          c: ['1', '2', '3', '4'],
          d: [true, false, false, true],
        };

        expect(
          getOptionsDiff(options, {
            ...options,
            ...changed,
          })
        ).toEqual(changed);

        expect(getOptionsDiff(options, changed)).toEqual(changed);
      });

      test('diff arrays with mixed values', () => {
        const options = {
          a: [] as Record<string, unknown>[],
          b: [1, 2, 3] as Array<number | (() => void)>,
          c: ['1', '2', '3'] as Array<string | Record<string, unknown>>,
          d: [true, false, false],
        };
        const changed = {
          a: [{}],
          b: [1, 2, 3, () => {}],
          c: ['1', '2', '3', {}],
        };

        expect(getOptionsDiff(options, changed)).toEqual(changed);

        expect(
          getOptionsDiff(options, {
            ...options,
            ...changed,
          })
        ).toEqual(changed);
      });

      test('diff same looking arrays with not serializable values', () => {
        const fn = () => {};
        const options = {
          c: [fn, fn, () => {}],
        };
        const changed = {
          c: [fn, fn, () => {}],
        };

        expect(
          getOptionsDiff(options, {
            ...options,
            ...changed,
          })
        ).toEqual(changed);

        expect(getOptionsDiff(options, changed)).toEqual(changed);
      });
    });
  });

  describe('createOptionCheck', () => {
    test('Complete path', () => {
      const checkOptions = createOptionCheck(
        defaultOptions,
        Object.fromEntries(
          Object.entries(defaultOptions).filter(([field]) => field === 'scrollbars')
        )
      );
      const [overflowX, overflowXChanged] = checkOptions('overflow.x');
      const [showNativeOverlaidScrollbars, showNativeOverlaidScrollbarsChanged] = checkOptions(
        'showNativeOverlaidScrollbars'
      );
      const [updateIgnoreMutation, updateIgnoreMutationChanged] =
        checkOptions('update.ignoreMutation');
      const [scrollbarsPointers, scrollbarsPointersChanged] = checkOptions('scrollbars.pointers');
      const [scrollbarsAutoHide, scrollbarsAutoHideChanged] = checkOptions('scrollbars.autoHide');

      expect(overflowX).toBe(defaultOptions.overflow.x);
      expect(showNativeOverlaidScrollbars).toBe(defaultOptions.showNativeOverlaidScrollbars);
      expect(updateIgnoreMutation).toBe(defaultOptions.update.ignoreMutation);
      expect(scrollbarsPointers).toBe(defaultOptions.scrollbars.pointers);
      expect(scrollbarsAutoHide).toBe(defaultOptions.scrollbars.autoHide);
      expect(overflowXChanged).toBe(false);
      expect(showNativeOverlaidScrollbarsChanged).toBe(false);
      expect(updateIgnoreMutationChanged).toBe(false);
      expect(scrollbarsPointersChanged).toBe(true);
      expect(scrollbarsAutoHideChanged).toBe(true);
    });

    test('Incomplete path', () => {
      const checkOptions = createOptionCheck(
        defaultOptions,
        Object.fromEntries(Object.entries(defaultOptions).filter(([field]) => field === 'update'))
      );
      const [overflow, overflowChanged] = checkOptions('overflow');
      const [update, updateChanged] = checkOptions('update');
      const [updateIgnoreMutation, updateIgnoreMutationChanged] =
        checkOptions('update.ignoreMutation');
      const [scrollbars, scrollbarsChanged] = checkOptions('scrollbars');

      expect(overflow).toBe(defaultOptions.overflow);
      expect(update).toBe(defaultOptions.update);
      expect(updateIgnoreMutation).toBe(defaultOptions.update.ignoreMutation);
      expect(scrollbars).toBe(defaultOptions.scrollbars);
      expect(overflowChanged).toBe(false);
      expect(updateChanged).toBe(true);
      expect(updateIgnoreMutationChanged).toBe(true);
      expect(scrollbarsChanged).toBe(false);
    });

    test('with options diff', () => {
      const changedOps: PartialOptions = {
        overflow: {
          x: 'hidden',
        },
        paddingAbsolute: defaultOptions.paddingAbsolute,
      };
      const ops = assignDeep({}, defaultOptions, changedOps);
      const checkOptionsOverflowXHidden = createOptionCheck(
        ops,
        getOptionsDiff(defaultOptions, changedOps)
      );

      const [paddingAbsolute, paddingAbsoluteChanged] =
        checkOptionsOverflowXHidden('paddingAbsolute');
      const [overflow, overflowChanged] = checkOptionsOverflowXHidden('overflow');
      const [overflowX, overflowXChanged] = checkOptionsOverflowXHidden('overflow.x');
      const [overflowY, overflowYChanged] = checkOptionsOverflowXHidden('overflow.y');
      expect(overflow).toEqual({ x: 'hidden', y: defaultOptions.overflow.y });
      expect(overflowX).toEqual('hidden');
      expect(overflowY).toEqual(defaultOptions.overflow.y);
      expect(paddingAbsolute).toEqual(defaultOptions.paddingAbsolute);
      expect(overflowChanged).toBe(true);
      expect(overflowXChanged).toBe(true);
      expect(overflowYChanged).toBe(false);
      expect(paddingAbsoluteChanged).toBe(false);
    });

    [false, true].forEach((force) => {
      test(`force: ${force}`, () => {
        const checkOptions = createOptionCheck(defaultOptions, {}, force);
        const [overflow, overflowChanged] = checkOptions('overflow');
        const [overflowX, overflowXChanged] = checkOptions('overflow.x');
        const [overflowY, overflowYChanged] = checkOptions('overflow.y');
        const [paddingAbsolute, paddingAbsoluteChanged] = checkOptions('paddingAbsolute');
        const [update, updateChanged] = checkOptions('update');
        const [updateDebounce, updateDebounceChanged] = checkOptions('update.debounce');
        const [updateElementEvents, updateElementEventsChanged] =
          checkOptions('update.elementEvents');
        const [scrollbars, scrollbarsChanged] = checkOptions('scrollbars');
        const [scrollbarsPointers, scrollbarsPointersChanged] = checkOptions('scrollbars.pointers');

        expect(overflow).toBe(defaultOptions.overflow);
        expect(overflowX).toBe(defaultOptions.overflow.x);
        expect(overflowY).toBe(defaultOptions.overflow.y);
        expect(paddingAbsolute).toBe(defaultOptions.paddingAbsolute);
        expect(update).toBe(defaultOptions.update);
        expect(updateDebounce).toBe(defaultOptions.update.debounce);
        expect(updateElementEvents).toBe(defaultOptions.update.elementEvents);
        expect(scrollbars).toBe(defaultOptions.scrollbars);
        expect(scrollbarsPointers).toBe(defaultOptions.scrollbars.pointers);
        expect(overflowChanged).toBe(force);
        expect(overflowXChanged).toBe(force);
        expect(overflowYChanged).toBe(force);
        expect(paddingAbsoluteChanged).toBe(force);
        expect(updateChanged).toBe(force);
        expect(updateDebounceChanged).toBe(force);
        expect(updateElementEventsChanged).toBe(force);
        expect(scrollbarsChanged).toBe(force);
        expect(scrollbarsPointersChanged).toBe(force);
      });
    });
  });
});
