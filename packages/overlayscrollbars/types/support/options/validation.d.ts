import { OptionsTemplate, OptionsTemplateType, Func, OptionsValidationResult } from 'support/options';
import { PlainObject } from 'typings';
declare const optionsTemplateTypes: OptionsTemplateTypesDictionary;
declare const validateOptions: <T extends PlainObject<any>>(options: T, template: OptionsTemplate<Required<T>>, optionsDiff?: T | undefined, doWriteErrors?: boolean | undefined) => OptionsValidationResult<T>;
export { validateOptions, optionsTemplateTypes };
declare type OptionsTemplateTypesDictionary = {
    readonly boolean: OptionsTemplateType<boolean>;
    readonly number: OptionsTemplateType<number>;
    readonly string: OptionsTemplateType<string>;
    readonly array: OptionsTemplateType<Array<any>>;
    readonly object: OptionsTemplateType<object>;
    readonly function: OptionsTemplateType<Func>;
    readonly null: OptionsTemplateType<null>;
};
