import { describe, test, expect } from 'vitest';
import type { PlainObject } from '../../../../src/typings';
import type { OptionsTemplate } from '../../../../src/plugins/optionsValidationPlugin/validation';
import type { OptionsWithOptionsTemplate } from '../../../../src/plugins/optionsValidationPlugin/transformation';
import { transformOptions } from '../../../../src/plugins/optionsValidationPlugin/transformation';
import { optionsTemplateTypes as oTypes } from '../../../../src/plugins/optionsValidationPlugin/validation';

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
type DeepRequired<T> = {
  [P in keyof T]-?: PlainObject extends T[P] ? DeepRequired<T[P]> : T[P];
};

const options: DeepRequired<TestOptions> = {
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

const optionsTemplate: OptionsTemplate<DeepRequired<TestOptions>> = {
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

const TestOptionsWithOptionsTemplate: OptionsWithOptionsTemplate<DeepRequired<TestOptions>> = {
  str: [options.str, optionsTemplate.str],
  strArrNull: [options.strArrNull, optionsTemplate.strArrNull],
  nullbool: [options.nullbool, optionsTemplate.nullbool],
  nested: {
    num: [options.nested.num, optionsTemplate.nested.num],
    switch: [options.nested.switch, optionsTemplate.nested.switch],
    abc: [options.nested.abc, optionsTemplate.nested.abc],
  },
  obj: [options.obj, optionsTemplate.obj],
  abc: [options.abc, optionsTemplate.abc],
  arr: [options.arr, optionsTemplate.arr],
  func: [options.func, optionsTemplate.func],
};

describe('options and options template object transformation', () => {
  test('transforms correctly into options object', () => {
    expect(transformOptions(TestOptionsWithOptionsTemplate)._options).toEqual(options);
  });

  test('transforms correctly into template object', () => {
    expect(transformOptions(TestOptionsWithOptionsTemplate)._template).toEqual(optionsTemplate);
  });
});
