import { OptionsTemplate, OptionsTemplateType, Func, OptionsValidationResult } from 'support/options';
import { PlainObject } from 'typings';
/**
 * A object which serves as a mapping for "normal" types and template types.
 * Key   = normal type string
 * value = template type string
 */
declare const optionsTemplateTypes: OptionsTemplateTypesDictionary;
/**
 * Validates the given options object according to the given template object and returns a object which looks like:
 * {
 *  foreign   : a object which consists of properties which aren't defined inside the template. (foreign properties)
 *  validated : a object which consists only of valid properties. (property name is inside the template and value has a correct type)
 * }
 * @param options The options object which shall be validated.
 * @param template The template according to which the options object shall be validated.
 * @param optionsDiff When provided the returned validated object will only have properties which are different to this objects properties.
 * Example (assume all properties are valid to the template):
 * Options object            : { a: 'a', b: 'b', c: 'c' }
 * optionsDiff object        : { a: 'a', b: 'b', c: undefined }
 * Returned validated object : { c: 'c' }
 * Because the value of the properties a and b didn't change, they aren't included in the returned object.
 * Without the optionsDiff object the returned validated object would be: { a: 'a', b: 'b', c: 'c' }
 * @param doWriteErrors True if errors shall be logged into the console, false otherwise.
 */
declare const validateOptions: <T extends PlainObject<any>>(options: T, template: OptionsTemplate<Required<T>>, optionsDiff?: T | null | undefined, doWriteErrors?: boolean | undefined) => OptionsValidationResult<T>;
export { validateOptions, optionsTemplateTypes };
declare type OptionsTemplateTypesDictionary = {
    readonly boolean: OptionsTemplateType<boolean>;
    readonly number: OptionsTemplateType<number>;
    readonly string: OptionsTemplateType<string>;
    readonly array: OptionsTemplateType<Array<any>>;
    readonly object: OptionsTemplateType<Record<string, unknown>>;
    readonly function: OptionsTemplateType<Func>;
    readonly null: OptionsTemplateType<null>;
};
