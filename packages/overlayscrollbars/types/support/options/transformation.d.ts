import { OptionsTemplate, OptionsWithOptionsTemplate } from 'support/options';
export interface OptionsWithOptionsTemplateTransformation<T extends Required<T>> {
    _template: OptionsTemplate<T>;
    _options: T;
}
/**
 * Transforms the given OptionsWithOptionsTemplate<T> object to its corresponding generic (T) Object or its corresponding Template object.
 * @param optionsWithOptionsTemplate The OptionsWithOptionsTemplate<T> object which shall be converted.
 * @param toTemplate True if the given OptionsWithOptionsTemplate<T> shall be converted to its corresponding Template object.
 */
export declare function transformOptions<T extends Required<T>>(optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>): OptionsWithOptionsTemplateTransformation<T>;
