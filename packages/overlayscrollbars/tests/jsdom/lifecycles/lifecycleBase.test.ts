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

const createLifecycle = (initalOptions?: TestLifecycleOptions, updateFn?: (...args: any) => any) =>
  createLifecycleBase<TestLifecycleOptions>(
    {
      number: [0, oTypes.number],
      string: ['hi', oTypes.string],
      nested: {
        boolean: [false, oTypes.boolean],
        number: [0, oTypes.number],
      },
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

  describe('update', () => {
    test('initial call', () => {
      const updateFn = jest.fn();
      createLifecycle({}, updateFn);

      expect(updateFn).toBeCalledTimes(1);
      expect(updateFn).toHaveBeenLastCalledWith(true, expect.objectContaining({}));
    });

    test('updates correctly on options change', () => {
      let checkOption = (...args: any): any => {}; // eslint-disable-line
      const updateFn = jest.fn();
      const update = (force: any, check: any): void => {
        updateFn(force, check);
        checkOption = check;
      };
      const { _options } = createLifecycle({}, update);

      _options({ number: 5 });
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));
      let { _value, _changed } = checkOption('number');
      expect(_value).toBe(5);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(false);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(false);

      _options({ number: 5, string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));
      ({ _value, _changed } = checkOption('number'));
      expect(_value).toBe(5);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('test');
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(false);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(3);
      expect(_changed).toBe(true);

      _options({ string: 'test', nested: { number: 3 } });
      expect(updateFn).toBeCalledTimes(3);
    });

    test('updates correctly on update call', () => {
      let checkOption = (...args: any): any => {}; // eslint-disable-line
      const updateFn = jest.fn();
      const update = (force: any, check: any): void => {
        updateFn(force, check);
        checkOption = check;
      };
      const { _update, _options } = createLifecycle({}, update);

      _update();
      expect(updateFn).toBeCalledTimes(2);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));
      let { _value, _changed } = checkOption('number');
      expect(_value).toBe(0);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(false);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(false);

      _update(true);
      expect(updateFn).toBeCalledTimes(3);
      expect(updateFn).toHaveBeenLastCalledWith(true, expect.objectContaining({}));
      ({ _value, _changed } = checkOption('number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(false);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(true);

      _options({ number: 3, nested: { boolean: true } });
      _update(true);
      expect(updateFn).toBeCalledTimes(5);
      expect(updateFn).toHaveBeenLastCalledWith(true, expect.objectContaining({}));
      ({ _value, _changed } = checkOption('number'));
      expect(_value).toBe(3);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(true);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(true);

      _options({ number: 3, nested: { boolean: true } });
      _update();
      expect(updateFn).toBeCalledTimes(6);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));
      ({ _value, _changed } = checkOption('number'));
      expect(_value).toBe(3);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(true);
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(false);

      _options({ number: 4, nested: { boolean: false }, string: 'hi' });
      expect(updateFn).toBeCalledTimes(7);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));
      ({ _value, _changed } = checkOption('number'));
      expect(_value).toBe(4);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('string'));
      expect(_value).toBe('hi');
      expect(_changed).toBe(false);
      ({ _value, _changed } = checkOption('nested.boolean'));
      expect(_value).toBe(false);
      expect(_changed).toBe(true);
      ({ _value, _changed } = checkOption('nested.number'));
      expect(_value).toBe(0);
      expect(_changed).toBe(false);

      _update();
      expect(updateFn).toBeCalledTimes(8);
      expect(updateFn).toHaveBeenLastCalledWith(false, expect.objectContaining({}));

      _options();
      expect(updateFn).toBeCalledTimes(8);

      _options({ number: 4, nested: { boolean: false }, string: 'hi' });
      expect(updateFn).toBeCalledTimes(8);
    });
  });
});
