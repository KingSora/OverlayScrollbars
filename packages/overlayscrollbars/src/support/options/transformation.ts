import { OptionsTemplate, OptionsWithOptionsTemplate, OptionsTemplateTypes } from 'support/options';
import { PlainObject } from 'typings';
import { isArray } from 'support/utils/types';
import { each, keys } from 'support/utils';

export interface OptionsWithOptionsTemplateTransformation<T extends Required<T>> {
  _template: OptionsTemplate<T>;
  _options: T;
}

/**
 * Transforms the given OptionsWithOptionsTemplate<T> object to its corresponding generic (T) Object or its corresponding Template object.
 * @param optionsWithOptionsTemplate The OptionsWithOptionsTemplate<T> object which shall be converted.
 * @param toTemplate True if the given OptionsWithOptionsTemplate<T> shall be converted to its corresponding Template object.
 */
export function transformOptions<T extends Required<T>>(
  optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>
): OptionsWithOptionsTemplateTransformation<T> {
  const result: any = {
    _template: {},
    _options: {},
  };

  each(keys(optionsWithOptionsTemplate), (key: Extract<keyof T, string>) => {
    const val: PlainObject | OptionsTemplateTypes | Array<OptionsTemplateTypes> = optionsWithOptionsTemplate[key];

    if (isArray(val)) {
      result._template[key] = val[1];
      result._options[key] = val[0];
    } else {
      //  if (isObject(val))
      const tmpResult = transformOptions(val as OptionsWithOptionsTemplate<typeof val>);
      result._template[key] = tmpResult._template;
      result._options[key] = tmpResult._options;
    }
  });

  return result;
}
