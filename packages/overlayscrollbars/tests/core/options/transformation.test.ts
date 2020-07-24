import { OptionsTemplate, OptionsAndOptionsTemplate, PlainObject } from 'core/typings';
import { optionsTemplateTypes as oTypes, transform } from 'core/options';

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

const optionsTemplate: OptionsTemplate<Required<TestOptions>> = {
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

const optionsAndOptionsTemplate: OptionsAndOptionsTemplate<Required<TestOptions>> = {
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
    expect(transform(optionsAndOptionsTemplate)).toEqual(options);
  });

  test('transforms correctly into template object', () => {
    expect(transform(optionsAndOptionsTemplate, true)).toEqual(optionsTemplate);
  });
});
