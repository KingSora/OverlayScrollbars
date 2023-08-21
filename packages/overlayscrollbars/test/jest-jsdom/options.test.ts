import { defaultOptions, getOptionsDiff } from '~/options';

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
});
