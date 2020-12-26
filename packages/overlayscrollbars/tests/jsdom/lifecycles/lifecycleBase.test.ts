import { optionsTemplateTypes as oTypes, Cache } from 'support';
import { createLifecycleBase } from 'lifecycles/lifecycleBase';

interface TestLifecycleOptions {
  number?: number;
  string?: string;
  nested?: {
    boolean?: boolean;
    number?: number;
  };
}
interface TestLifecycleCache {
  number?: number;
  constant?: boolean;
  object?: {
    string?: string;
    boolean?: boolean;
  };
}

const createLifecycle = (initalOptions?: TestLifecycleOptions, updateFn?: () => any) =>
  createLifecycleBase<TestLifecycleOptions, TestLifecycleCache>(
    {
      number: [0, oTypes.number],
      string: ['hi', oTypes.string],
      nested: {
        boolean: [false, oTypes.boolean],
        number: [0, oTypes.number],
      },
    },
    {
      number: (current) => (current || 0) + 1,
      constant: () => false,
      object: (current) => ({ string: `${current?.string || ''}hi`, boolean: !current?.boolean }),
    },
    initalOptions,
    updateFn || (() => {})
  );

const createOptionsUnchangedObj = (exc?: Cache<TestLifecycleOptions>) =>
  expect.objectContaining({
    number: exc?.number || expect.objectContaining({ _changed: false }),
    string: exc?.string || expect.objectContaining({ _changed: false }),
    nested: exc?.nested || expect.objectContaining({ _changed: false }),
  });
const createCacheUnchangedObj = (exc?: Cache<TestLifecycleCache>) =>
  expect.objectContaining({
    number: exc?.number || expect.objectContaining({ _changed: false }),
    constant: exc?.constant || expect.objectContaining({ _changed: false }),
    object: exc?.object || expect.objectContaining({ _changed: false }),
  });

describe('lifecycleBase', () => {
  describe('options', () => {
    test('correct default options', () => {
      const { _options } = createLifecycle();

      const defaultOptions = _options();
      expect(defaultOptions.number).toBe(0);
      expect(defaultOptions.string).toBe('hi');
      expect(defaultOptions.nested?.boolean).toBe(false);
      expect(defaultOptions.nested?.number).toBe(0);
    });

    test('correct initial options', () => {
      const { _options } = createLifecycle({ number: 1, nested: { boolean: true } });

      const initOptions = _options();
      expect(initOptions.number).toBe(1);
      expect(initOptions.string).toBe('hi');
      expect(initOptions.nested?.boolean).toBe(true);
      expect(initOptions.nested?.number).toBe(0);
    });

    test('correct options change', () => {
      const { _options } = createLifecycle();

      const options = _options();
      expect(options.number).toBe(0);
      expect(options.string).toBe('hi');
      expect(options.nested?.boolean).toBe(false);
      expect(options.nested?.number).toBe(0);

      const changedOptions = _options({ number: 2, nested: { number: 3 } });
      expect(changedOptions.number).toBe(2);
      expect(changedOptions.string).toBe('hi');
      expect(changedOptions.nested?.boolean).toBe(false);
      expect(changedOptions.nested?.number).toBe(3);
    });

    test('correct options validation', () => {
      const originalWarn = console.warn;
      const mockWarn = jest.fn();
      console.warn = mockWarn;

      // @ts-ignore
      const { _options } = createLifecycle({ string: 123 });
      expect(mockWarn).toBeCalledTimes(1);

      const options = _options();
      expect(options.string).toBe('hi');

      // @ts-ignore
      const changedOptions = _options({ number: 'string', nested: null });
      expect(mockWarn).toBeCalledTimes(2);
      expect(changedOptions.number).toBe(0);
      expect(changedOptions.string).toBe('hi');
      expect(changedOptions.nested?.boolean).toBe(false);
      expect(changedOptions.nested?.number).toBe(0);

      console.warn = originalWarn;
    });
  });

  describe('cache', () => {
    test('single value cache change', () => {
      const updateFn = jest.fn();
      const { _updateCache } = createLifecycle({}, updateFn);

      _updateCache('number');
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          number: {
            _value: 2,
            _changed: true,
            _previous: 1,
          },
          constant: expect.objectContaining({
            _changed: false,
          }),
        })
      );

      _updateCache('constant');
      expect(updateFn).toBeCalledTimes(2);
    });

    test('multiple value cache change', () => {
      const updateFn = jest.fn();
      const { _updateCache } = createLifecycle({}, updateFn);

      _updateCache(['number', 'object']);
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          number: {
            _value: 2,
            _previous: 1,
            _changed: true,
          },
          object: {
            _value: { string: 'hihi', boolean: false },
            _previous: { string: 'hi', boolean: true },
            _changed: true,
          },
        })
      );

      _updateCache(['number', 'constant']);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          number: {
            _value: 3,
            _previous: 2,
            _changed: true,
          },
          constant: expect.objectContaining({
            _changed: false,
          }),
        })
      );

      _updateCache(['constant']);
      expect(updateFn).toBeCalledTimes(3);
    });
  });

  describe('update', () => {
    test('initial call', () => {
      const updateFn = jest.fn();
      createLifecycle({}, updateFn);

      expect(updateFn).toBeCalledTimes(1);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          number: expect.objectContaining({
            _value: 0,
            _changed: true,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: true,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: false,
              number: 0,
            },
            _changed: true,
          }),
        }),
        expect.objectContaining({
          number: expect.objectContaining({
            _value: 1,
            _changed: true,
          }),
          constant: expect.objectContaining({
            _value: false,
            _changed: true,
          }),
          object: expect.objectContaining({
            _value: {
              string: 'hi',
              boolean: true,
            },
            _changed: true,
          }),
        })
      );
    });

    test('updates correctly on options change', () => {
      const updateFn = jest.fn();
      const { _options } = createLifecycle({}, updateFn);

      _options({ number: 5 });
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj({
          number: {
            _value: 5,
            _previous: 0,
            _changed: true,
          },
        }),
        createCacheUnchangedObj()
      );

      _options({ number: 5, string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj({
          string: {
            _value: 'test',
            _previous: 'hi',
            _changed: true,
          },
          nested: {
            _value: expect.objectContaining({ number: 3 }),
            _previous: expect.objectContaining({ number: 3 }), // because reference, number is 3 instead of expected 0
            _changed: true,
          },
        }),
        createCacheUnchangedObj()
      );

      _options({ string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
    });

    test('updates correctly on cache change', () => {
      const updateFn = jest.fn();
      const { _updateCache } = createLifecycle({}, updateFn);

      _updateCache('number');
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj(),
        createCacheUnchangedObj({
          number: {
            _value: 2,
            _previous: 1,
            _changed: true,
          },
        })
      );

      _updateCache(['number', 'object', 'constant']);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj(),
        createCacheUnchangedObj({
          number: {
            _value: 3,
            _previous: 2,
            _changed: true,
          },
          object: {
            _value: { string: 'hihi', boolean: false },
            _previous: { string: 'hi', boolean: true },
            _changed: true,
          },
        })
      );

      _updateCache('constant');
      expect(updateFn).toBeCalledTimes(3);
    });

    test('updates correctly on update call', () => {
      const updateFn = jest.fn();
      const { _update, _options } = createLifecycle({}, updateFn);

      _update();
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj(),
        createCacheUnchangedObj({
          number: {
            _value: 2,
            _previous: 1,
            _changed: true,
          },
          object: {
            _value: { string: 'hihi', boolean: false },
            _previous: { string: 'hi', boolean: true },
            _changed: true,
          },
        })
      );

      _update(true);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          number: expect.objectContaining({
            _value: 0,
            _changed: true,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: true,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: false,
              number: 0,
            },
            _changed: true,
          }),
        }),
        expect.objectContaining({
          number: {
            _value: 3,
            _previous: 2,
            _changed: true,
          },
          constant: {
            _value: false,
            _previous: false,
            _changed: true,
          },
          object: {
            _value: {
              string: 'hihihi',
              boolean: true,
            },
            _previous: {
              string: 'hihi',
              boolean: false,
            },
            _changed: true,
          },
        })
      );

      _options({ number: 3, nested: { boolean: true } });
      _update(true);
      expect(updateFn).toBeCalledTimes(5);
      expect(updateFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          number: expect.objectContaining({
            _value: 3,
            _changed: true,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: true,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: true,
              number: 0,
            },
            _changed: true,
          }),
        }),
        expect.objectContaining({
          number: {
            _value: 4,
            _previous: 3,
            _changed: true,
          },
          constant: {
            _value: false,
            _previous: false,
            _changed: true,
          },
          object: {
            _value: {
              string: 'hihihihi',
              boolean: false,
            },
            _previous: {
              string: 'hihihi',
              boolean: true,
            },
            _changed: true,
          },
        })
      );

      _options({ number: 3, nested: { boolean: true } });
      _update();
      expect(updateFn).toBeCalledTimes(6);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj({
          number: expect.objectContaining({
            _value: 3,
            _changed: false,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: false,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: true,
              number: 0,
            },
            _changed: false,
          }),
        }),
        createCacheUnchangedObj({
          number: {
            _value: 5,
            _previous: 4,
            _changed: true,
          },
          object: {
            _value: { string: 'hihihihihi', boolean: true },
            _previous: { string: 'hihihihi', boolean: false },
            _changed: true,
          },
        })
      );

      _options({ number: 4, nested: { boolean: false }, string: 'hi' });
      expect(updateFn).toBeCalledTimes(7);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj({
          number: expect.objectContaining({
            _value: 4,
            _changed: true,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: false,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: false,
              number: 0,
            },
            _changed: true,
          }),
        }),
        createCacheUnchangedObj()
      );
      _update();
      expect(updateFn).toBeCalledTimes(8);
      expect(updateFn).toHaveBeenLastCalledWith(
        createOptionsUnchangedObj({
          number: expect.objectContaining({
            _value: 4,
            _changed: false,
          }),
          string: expect.objectContaining({
            _value: 'hi',
            _changed: false,
          }),
          nested: expect.objectContaining({
            _value: {
              boolean: false,
              number: 0,
            },
            _changed: false,
          }),
        }),
        createCacheUnchangedObj({
          number: expect.objectContaining({
            _changed: true,
          }),
          object: expect.objectContaining({
            _changed: true,
          }),
        })
      );
    });
  });
});
