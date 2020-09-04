import { validate, optionsTemplateTypes as oTypes, OptionsTemplate } from 'support/options';
import { assignDeep, isEmptyObject } from 'support/utils';

type TestOptionsObj = { propA: 'propA'; null: null };
type TestOptionsEnum = 'A' | 'B' | 'C';
type TestOptions = {
  str?: string;
  strArrNull?: string | Array<string> | null;
  nullbool?: boolean | null;
  nested?: {
    num?: number;
    switch?: boolean;
    abc?: TestOptionsEnum;
  };
  obj?: TestOptionsObj | null;
  abc?: TestOptionsEnum;
  arr?: Array<any>;
  func?: () => void;
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

const template: OptionsTemplate<Required<TestOptions>> = {
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
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).toEqual(options);
    });

    test('passed objects arent mutated', () => {
      const clonedOptions = assignDeep({}, options);
      validate(clonedOptions, template, clonedOptions);

      expect(clonedOptions).toEqual(options);
    });

    test('passed object isnt returned object', () => {
      const clonedOptions = assignDeep({}, options);
      const result = validate(clonedOptions, template);

      expect(result.validated).not.toBe(clonedOptions);
    });
  });

  describe('foreign property return', () => {
    test('return no foreign property', () => {
      const result = validate(options, template);

      expect(isEmptyObject(result.foreign)).toBe(true);
    });

    test('return signle non-object foreign property', () => {
      const foreignObj = { foreignProp: 'foreign' };
      const modifiedOptions = assignDeep({}, options, foreignObj);
      const result = validate(modifiedOptions, template);
      const { foreign } = result;

      expect(foreign).toEqual(foreignObj);
    });

    test('return complex foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep({}, options, foreignObj);
      const result = validate(modifiedOptions, template);
      const { foreign } = result;

      expect(foreign).toEqual(foreignObj);
    });

    test('return nested complex foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const modifiedOptions = assignDeep({}, options, { nested: foreignObj }, foreignObj);
      const result = validate(modifiedOptions, template);
      const { foreign } = result;

      expect(foreign.nested).toEqual(foreignObj);
      delete foreign.nested;
      expect(foreign).toEqual(foreignObj);
    });
  });

  describe('diff property return', () => {
    test('one value changed', () => {
      const modifiedOptions = assignDeep({}, options, { str: 'newvaluetest' });
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.str).toBe('newvaluetest');
      delete validated.str;
      expect(isEmptyObject(validated)).toBe(true);
    });

    test('multiple values changed', () => {
      const modifiedOptions = assignDeep({}, options, {
        str: 'newvaluetest',
        nullbool: null,
      });
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.str).toBe('newvaluetest');
      expect(validated.nullbool).toBe(null);
      delete validated.str;
      delete validated.nullbool;
      expect(isEmptyObject(validated)).toBe(true);
    });

    test('one nested value changed', () => {
      const modifiedOptions = assignDeep({}, options, { nested: { num: -1293 } });
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.nested?.num).toBe(-1293);
      delete validated.nested?.num;
      expect(isEmptyObject(validated.nested)).toBe(true);
      delete validated.nested;
      expect(isEmptyObject(validated)).toBe(true);
    });

    test('multiple nested values changed', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { num: -1293, abc: 'C' },
      });
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.nested?.num).toBe(-1293);
      expect(validated.nested?.abc).toBe('C');
      delete validated.nested?.num;
      delete validated.nested?.abc;
      expect(isEmptyObject(validated.nested)).toBe(true);
      delete validated.nested;
      expect(isEmptyObject(validated)).toBe(true);
    });

    test('various values changed', () => {
      const newFunc = () => {};
      const modifiedOptions = assignDeep({}, options, {
        str: 'newstrvalue',
        func: newFunc,
        abc: 'C',
        nested: { num: -1293, abc: 'C' },
      });
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.str).toBe('newstrvalue');
      expect(validated.func).toBe(newFunc);
      expect(validated.abc).toBe('C');
      delete validated.str;
      delete validated.func;
      delete validated.abc;
      expect(validated.nested?.num).toBe(-1293);
      expect(validated.nested?.abc).toBe('C');
      delete validated.nested?.num;
      delete validated.nested?.abc;
      expect(isEmptyObject(validated.nested)).toBe(true);
      delete validated.nested;
      expect(isEmptyObject(validated)).toBe(true);
    });

    test('various values changed with foreign properties', () => {
      const foreignObj = {
        foreignProp: 'foreign',
        foreignDeep: { a: 'A', b: 'B' },
      };
      const newFunc = () => {};
      const modifiedOptions = assignDeep(
        {},
        options,
        {
          str: 'newstrvalue',
          func: newFunc,
          abc: 'C',
          nested: { num: -1293, abc: 'C' },
        },
        foreignObj,
        { nested: foreignObj }
      );
      const result = validate(modifiedOptions, template, options);
      const { validated } = result;

      expect(validated.str).toBe('newstrvalue');
      expect(validated.func).toBe(newFunc);
      expect(validated.abc).toBe('C');
      delete validated.str;
      delete validated.func;
      delete validated.abc;
      expect(validated.nested?.num).toBe(-1293);
      expect(validated.nested?.abc).toBe('C');
      delete validated.nested?.num;
      delete validated.nested?.abc;
      expect(isEmptyObject(validated.nested)).toBe(true);
      delete validated.nested;
      expect(isEmptyObject(validated)).toBe(true);
    });
  });

  describe('value validity', () => {
    test('single value doesnt match template', () => {
      const modifiedOptions = assignDeep({}, options, { str: 1 });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('str');
    });

    test('single enum value doesnt match template', () => {
      const modifiedOptions = assignDeep({}, options, { abc: 'testval' });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('abc');
    });

    test('multiple values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        str: 1,
        abc: 'testval',
        nullbool: 'string',
      });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('str');
      expect(validated).not.toHaveProperty('abc');
      expect(validated).not.toHaveProperty('nullbool');
    });

    test('single nested value dont match template', () => {
      const modifiedOptions = assignDeep({}, options, { nested: { num: 'hi' } });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated.nested).not.toHaveProperty('num');
    });

    test('single nested enum value dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { abc: 'testabc' },
      });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated.nested).not.toHaveProperty('abc');
    });

    test('multiple nested values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { num: 'hi', abc: 'testabc' },
      });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated.nested).not.toHaveProperty('num');
      expect(validated.nested).not.toHaveProperty('abc');
    });

    test('all nested values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { num: 'hi', abc: 'testabc', switch: 1 },
      });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

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
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('nested');
    });

    test('various values dont match template', () => {
      const modifiedOptions = assignDeep({}, options, {
        nested: { switch: null },
        obj: 1,
        abc: 'testest',
        func: {},
      });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

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
      const result = validate(modifiedOptions, template);
      const { validated, foreign } = result;

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
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('nested');
    });

    test('nested object is null', () => {
      const modifiedOptions = assignDeep({}, options, { nested: null });
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('nested');
    });

    test('nested object is undefined', () => {
      const modifiedOptions = assignDeep({}, options);
      modifiedOptions.nested = undefined;
      const result = validate(modifiedOptions, template);
      const { validated } = result;

      expect(validated).not.toHaveProperty('nested');
    });
  });

  describe('error logging', () => {
    test('dont log error if nothing is wrong', () => {
      const { warn } = console;
      console.warn = jest.fn();

      validate(options, template, {}, true);
      expect(console.warn).not.toBeCalled();

      console.warn = warn;
    });

    test('dont log error if something is wrong and flag is false', () => {
      const { warn } = console;
      console.warn = jest.fn();

      const modifiedOptions = assignDeep({}, options, { str: 1 });
      validate(modifiedOptions, template, {}, false);
      expect(console.warn).not.toBeCalled();

      console.warn = warn;
    });

    test('log error if something is wrong and flag is true', () => {
      const { warn } = console;
      console.warn = jest.fn();

      // str must be string
      validate(assignDeep({}, options, { str: 1 }), template, {}, true);
      expect(console.warn).toBeCalledTimes(1);

      // abc must be A | B | C
      validate(assignDeep({}, options, { abc: 'some string' }), template, {}, true);
      expect(console.warn).toBeCalledTimes(2);

      // everthing OK
      validate(assignDeep({}, options, { abc: 'C' }), template, {}, true);
      expect(console.warn).toBeCalledTimes(2);

      console.warn = warn;
    });
  });
});
