import type { OptionsObject } from '../../options';
import type {
  OptionsTemplate,
  OptionsTemplateNativeTypes,
  OptionsTemplateTypes,
  OptionsTemplateValue,
} from './validation';
import type { PlainObject } from '../../typings';
import { isArray, each } from '../../support';

export interface OptionsWithOptionsTemplateTransformation<T> {
  _template: OptionsTemplate<T>;
  _options: T;
}

export type OptionsWithOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [
  T,
  OptionsTemplateValue<T>,
];

export type OptionsWithOptionsTemplate<T> = {
  [P in keyof T]: T[P] extends OptionsObject
    ? OptionsWithOptionsTemplate<T[P]>
    : T[P] extends OptionsTemplateNativeTypes
      ? OptionsWithOptionsTemplateValue<T[P]>
      : never;
};

/**
 * Transforms the given OptionsWithOptionsTemplate<T> object to its corresponding generic (T) Object or its corresponding Template object.
 * @param optionsWithOptionsTemplate The OptionsWithOptionsTemplate<T> object which shall be converted.
 * @param toTemplate True if the given OptionsWithOptionsTemplate<T> shall be converted to its corresponding Template object.
 */
export const transformOptions = <T>(
  optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>
): OptionsWithOptionsTemplateTransformation<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {
    _template: {},
    _options: {},
  };

  each(optionsWithOptionsTemplate, (_, key) => {
    const val: PlainObject | OptionsTemplateTypes | Array<OptionsTemplateTypes> =
      optionsWithOptionsTemplate[key as Extract<keyof T, string>];

    if (isArray(val)) {
      result._options[key] = val[0];
      result._template[key] = val[1];
    } else {
      //  if (isObject(val))
      const tmpResult = transformOptions(val as OptionsWithOptionsTemplate<typeof val>);
      result._template[key] = tmpResult._template;
      result._options[key] = tmpResult._options;
    }
  });

  return result;
};
