import { vi, describe, test, expect } from 'vitest';
import type { OptionsTemplate } from '../../../../src/plugins/optionsValidationPlugin/validation';
import {
  validateOptions,
  optionsTemplateTypes as oTypes,
} from '../../../../src/plugins/optionsValidationPlugin/validation';
import { assignDeep } from '../../../../src/support/utils';

type TestOptionsObj = { propA: 'propA'; null: null };
type TestOptionsEnum = 'A' | 'B' | 'C';
type TestOptions = {
  str: string;
  strArrNull: string | Array<string> | null;
  nullbool: boolean | null;
  nested: {
    num: number;
    switch: boolean;
    abc: TestOptionsEnum;
  };
  obj: TestOptionsObj | null;
  abc: TestOptionsEnum;
  arr: Array<any>;
  func: () => void;
};

const options: TestOptions = {
  str: 'hi',
  strArrNull: null,
  nullbool: true,
  nested: {
    num: 1,
    switch: false,
    abc: 'B',
  },
  obj: { propA: 'propA', null: null },
  abc: 'A',
  arr: [1, 2, 3],
  func: () => {},
};

const template: OptionsTemplate<TestOptions> = {
  str: oTypes.string,
  strArrNull: [oTypes.string, oTypes.array, oTypes.null],
  nullbool: [oTypes.boolean, oTypes.null],
  nested: {
    num: oTypes.number,
    switch: oTypes.boolean,
    abc: 'A B C',
  },
  obj: [oTypes.object, oTypes.null],
  abc: 'A B C',
  arr: oTypes.array,
  func: oTypes.function,
};

describe('options validation', () => {
  describe('object return & mutation', () => {
    test('foreign properties wont affect validated object', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep({}, options, { nested: foreignObj }, foreignObj);
      const [validated, foreign] = validateOptions(template, modifiedOptions);

      expect(validated).toEqual(options);
      expect(foreign).toEqual({ ...foreignObj, nested: foreignObj });
    });

    test('passed object isnt returned object', () => {
      const clonedOptions = assignDeep({}, options);
      const [validated, foreign] = validateOptions(template, clonedOptions);

      expect(validated).not.toBe(clonedOptions);
      expect(foreign).toEqual({});
    });
  });

  describe('foreign property return', () => {
    test('return no foreign property', () => {
      const [, foreign] = validateOptions(template, options);

      expect(foreign).toEqual({});
    });

    test('return signle non-object foreign property', () => {
      const foreignObj = { foreignProp: 'foreign' };
      const modifiedOptions = assignDeep({}, options, foreignObj);
      const [, foreign] = validateOptions(template, modifiedOptions);

      expect(foreign).toEqual(foreignObj);
    });

    test('return complex foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep({}, options, foreignObj);
      const [, foreign] = validateOptions(template, modifiedOptions);

      expect(foreign).toEqual(foreignObj);
    });

    test('return nested complex foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep({}, options, { nested: foreignObj }, foreignObj);
      const [, foreign] = validateOptions(template, modifiedOptions);

      expect(foreign.nested).toEqual(foreignObj);
      delete foreign.nested;
      expect(foreign).toEqual(foreignObj);
    });
  });

  describe('value validity', () => {
    test('single value doesnt match template', () => {
      const modifiedOptions = assignDeep({}, options, { str: 1 });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('str');
    });

    test('single enum value doesnt match template', () => {
      const modifiedOptions = assignDeep({}, options, { abc: 'testval' });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('abc');
    });

    test('multiple values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        str: 1,
        abc: 'testval',
        nullbool: 'string',
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('str');
      expect(validated).not.toHaveProperty('abc');
      expect(validated).not.toHaveProperty('nullbool');
    });

    test('single nested value dont match template', () => {
      const modifiedOptions = assignDeep({}, options, { nested: { num: 'hi' } });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated.nested).not.toHaveProperty('num');
    });

    test('single nested enum value dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { abc: 'testabc' },
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated.nested).not.toHaveProperty('abc');
    });

    test('multiple nested values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { num: 'hi', abc: 'testabc' },
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated.nested).not.toHaveProperty('num');
      expect(validated.nested).not.toHaveProperty('abc');
    });

    test('all nested values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { num: 'hi', abc: 'testabc', switch: 1 },
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('nested');
    });

    test('all nested values dont match template with foreign property', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: {
          foreign: 'foreign',
          num: 'hi',
          abc: 'testabc',
          switch: 1,
        },
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('nested');
    });

    test('various values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { switch: null },
        obj: 1,
        abc: 'testest',
        func: {},
      });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated.nested).not.toHaveProperty('switch');
      expect(validated).not.toHaveProperty('obj');
      expect(validated).not.toHaveProperty('abc');
      expect(validated).not.toHaveProperty('func');
    });

    test('various values dont match template with foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep(
        {},
        options,
        {
          nested: { switch: null },
          obj: 1,
          abc: 'testest',
          func: {},
        },
        foreignObj,
        { nested: foreignObj }
      );
      const [validated, foreign] = validateOptions(template, modifiedOptions);

      expect(foreign.nested).toEqual(foreignObj);
      delete foreign.nested;
      expect(foreign).toEqual(foreignObj);

      expect(validated.nested).not.toHaveProperty('switch');
      expect(validated).not.toHaveProperty('obj');
      expect(validated).not.toHaveProperty('abc');
      expect(validated).not.toHaveProperty('func');
    });

    test('nested object is string', () => {
      const modifiedOptions = assignDeep({}, options, { nested: 'string' });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('nested');
    });

    test('nested object is null', () => {
      const modifiedOptions = assignDeep({}, options, { nested: null });
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('nested');
    });

    test('nested object is undefined', () => {
      const modifiedOptions: Partial<TestOptions> = assignDeep({}, options);
      modifiedOptions.nested = undefined;
      const [validated] = validateOptions(template, modifiedOptions);

      expect(validated).not.toHaveProperty('nested');
    });
  });

  describe('error logging', () => {
    test('dont log error if nothing is wrong', () => {
      const { warn } = console;
      console.warn = vi.fn();

      validateOptions(template, options, true);
      expect(console.warn).not.toBeCalled();

      console.warn = warn;
    });

    test('dont log error if something is wrong and flag is false', () => {
      const { warn } = console;
      console.warn = vi.fn();

      const modifiedOptions = assignDeep({}, options, { str: 1 });
      validateOptions(template, modifiedOptions, false);
      expect(console.warn).not.toBeCalled();

      console.warn = warn;
    });

    test('log error if something is wrong and flag is true', () => {
      const { warn } = console;
      console.warn = vi.fn();

      // str must be string
      validateOptions(template, assignDeep({}, options, { str: 1 }), true);
      expect(console.warn).toBeCalledTimes(1);

      // abc must be A | B | C
      validateOptions(template, assignDeep({}, options, { abc: 'some string' }), true);
      expect(console.warn).toBeCalledTimes(2);

      // everthing OK
      validateOptions(template, assignDeep({}, options, { abc: 'C' }), true);
      expect(console.warn).toBeCalledTimes(2);

      console.warn = warn;
    });
  });
});
