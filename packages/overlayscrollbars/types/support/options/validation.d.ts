import { OptionsTemplate, OptionsTemplateType, OptionsValidated, Func, OptionsValidatedResult } from 'support/options';
import { PlainObject } from 'typings';
declare const optionsTemplateTypes: OptionsTemplateTypesDictionary;
declare const validate: <T extends PlainObject<any>>(options: T, template: OptionsTemplate<Required<T>>, optionsDiff?: OptionsValidated<T> | undefined, doWriteErrors?: boolean | undefined) => OptionsValidatedResult<T>;
export { validate, optionsTemplateTypes };
declare type OptionsTemplateTypesDictionary = {
    readonly boolean: OptionsTemplateType<boolean>;
    readonly number: OptionsTemplateType<number>;
    readonly string: OptionsTemplateType<string>;
    readonly array: OptionsTemplateType<Array<any>>;
    readonly object: OptionsTemplateType<object>;
    readonly function: OptionsTemplateType<Func>;
    readonly null: OptionsTemplateType<null>;
};
