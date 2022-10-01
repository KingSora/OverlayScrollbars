import { isArray } from '~/support/utils/types';
import { each, keys } from '~/support/utils';
import type {
  OptionsTemplate,
  OptionsObjectType,
  OptionsTemplateNativeTypes,
  OptionsTemplateTypes,
  OptionsTemplateValue,
} from '~/plugins/optionsValidationPlugin/validation';
import type { PlainObject } from '~/typings';

export interface OptionsWithOptionsTemplateTransformation<T> {
  _template: OptionsTemplate<T>;
  _options: T;
}

export type OptionsWithOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [
  T,
  OptionsTemplateValue<T>
];

export type OptionsWithOptionsTemplate<T> = {
  [P in keyof T]: T[P] extends OptionsObjectType
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
  const result: any = {
    _template: {},
    _options: {},
  };

  each(keys(optionsWithOptionsTemplate), (key: Extract<keyof T, string>) => {
    const val: PlainObject | OptionsTemplateTypes | Array<OptionsTemplateTypes> =
      optionsWithOptionsTemplate[key];

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
