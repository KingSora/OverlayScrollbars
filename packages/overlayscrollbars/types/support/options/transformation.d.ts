import { OptionsTemplate, OptionsWithOptionsTemplate } from 'support/options';
export interface OptionsWithOptionsTemplateTransformation<T extends Required<T>> {
    _template: OptionsTemplate<T>;
    _options: T;
}
export declare function transformOptions<T extends Required<T>>(optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>): OptionsWithOptionsTemplateTransformation<T>;
