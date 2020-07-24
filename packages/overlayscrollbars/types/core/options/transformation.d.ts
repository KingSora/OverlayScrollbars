import { OptionsTemplate, OptionsAndOptionsTemplate } from 'core/typings';
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>): T;
export declare function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>, toTemplate: true | void): OptionsTemplate<T>;
