import { OptionsTemplate, OptionsWithOptionsTemplate } from 'support/options';
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>): T;
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsWithOptionsTemplate<T>, toTemplate: true | void): OptionsTemplate<T>;
