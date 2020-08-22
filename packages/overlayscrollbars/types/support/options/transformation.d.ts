import { OptionsTemplate, OptionsAndOptionsTemplate } from 'support/options';
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>): T;
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>, toTemplate: true | void): OptionsTemplate<T>;
