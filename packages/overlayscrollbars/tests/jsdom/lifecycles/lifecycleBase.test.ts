import { optionsTemplateTypes as oTypes } from 'support';
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
      const { _cacheChange } = createLifecycle({}, updateFn);

      _cacheChange('number');
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toBeCalledWith({}, { number: 2 });

      _cacheChange('constant');
      expect(updateFn).toBeCalledTimes(2);
    });

    test('multiple value cache change', () => {
      const updateFn = jest.fn();
      const { _cacheChange } = createLifecycle({}, updateFn);

      _cacheChange(['number', 'object']);
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toBeCalledWith({}, { number: 2, object: { string: 'hihi', boolean: false } });

      _cacheChange(['number', 'constant']);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toBeCalledWith({}, { number: 3 });

      _cacheChange(['constant']);
      expect(updateFn).toBeCalledTimes(3);
    });
  });

  describe('update', () => {
    test('initial call', () => {
      const updateFn = jest.fn();
      createLifecycle({}, updateFn);

      expect(updateFn).toBeCalledTimes(1);
      expect(updateFn).toBeCalledWith(
        {
          number: 0,
          string: 'hi',
          nested: {
            boolean: false,
            number: 0,
          },
        },
        {
          number: 1,
          constant: false,
          object: {
            string: 'hi',
            boolean: true,
          },
        }
      );
    });

    test('updates correctly on options change', () => {
      const updateFn = jest.fn();
      const { _options } = createLifecycle({}, updateFn);

      _options({ number: 5 });
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toBeCalledWith({ number: 5 }, {});

      _options({ number: 5, string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toBeCalledWith({ string: 'test', nested: { number: 3 } }, {});

      _options({ number: 5, string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
    });

    test('updates correctly on cache change', () => {
      const updateFn = jest.fn();
      const { _cacheChange } = createLifecycle({}, updateFn);

      _cacheChange('number');
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toBeCalledWith({}, { number: 2 });

      _cacheChange(['number', 'object', 'constant']);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toBeCalledWith({}, { number: 3, object: { string: 'hihi', boolean: false } });

      _cacheChange('constant');
      expect(updateFn).toBeCalledTimes(3);
    });

    test('updates correctly on update call', () => {
      const updateFn = jest.fn();
      const { _update, _options } = createLifecycle({}, updateFn);

      _update();
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toBeCalledWith({}, { number: 2, object: { string: 'hihi', boolean: false } });

      _update(true);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toBeCalledWith(
        {
          number: 0,
          string: 'hi',
          nested: {
            boolean: false,
            number: 0,
          },
        },
        {
          number: 3,
          constant: false,
          object: {
            string: 'hihihi',
            boolean: true,
          },
        }
      );

      _options({ number: 3, nested: { boolean: true } });
      _update(true);
      expect(updateFn).toBeCalledTimes(5);
      expect(updateFn).toBeCalledWith(
        {
          number: 3,
          string: 'hi',
          nested: {
            boolean: true,
            number: 0,
          },
        },
        {
          number: 4,
          constant: false,
          object: {
            string: 'hihihihi',
            boolean: false,
          },
        }
      );
    });
  });
});
