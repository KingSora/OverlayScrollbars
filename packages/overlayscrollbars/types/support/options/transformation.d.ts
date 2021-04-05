import { OptionsTemplate, OptionsObjectType, OptionsTemplateNativeTypes, OptionsTemplateValue } from 'support/options/validation';
export interface OptionsWithOptionsTemplateTransformation<T> {
    _template: OptionsTemplate<T>;
    _options: T;
}
export declare type OptionsWithOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [T, OptionsTemplateValue<T>];
export declare type OptionsWithOptionsTemplate<T> = {
    [P in keyof T]: T[P] extends OptionsObjectType ? OptionsWithOptionsTemplate<T[P]> : T[P] extends OptionsTemplateNativeTypes ? OptionsWithOptionsTemplateValue<T[P]> : never;
};
/**
 * Transforms the given OptionsWithOptionsTemplate<T> object to its corresponding generic (T) Object or its corresponding Template object.
 * @param optionsWithOptionsTemplate The OptionsWithOptionsTemplate<T> object which shall be converted.
 * @param toTemplate True if the given OptionsWithOptionsTemplate<T> shall be converted to its corresponding Template object.
 */
export declare const transformOptions: <T>(optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>) => OptionsWithOptionsTemplateTransformation<T>;
