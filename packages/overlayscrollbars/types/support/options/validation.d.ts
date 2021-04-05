import { PlainObject } from 'typings';
export declare type OptionsObjectType = Record<string, unknown>;
export declare type OptionsFunctionType = (this: unknown, ...args: unknown[]) => unknown;
export declare type OptionsTemplateType<T extends OptionsTemplateNativeTypes> = ExtractPropsKey<OptionsTemplateTypeMap, T>;
export declare type OptionsTemplateTypes = keyof OptionsTemplateTypeMap;
export declare type OptionsTemplateNativeTypes = OptionsTemplateTypeMap[keyof OptionsTemplateTypeMap];
export declare type OptionsTemplateValue<T extends OptionsTemplateNativeTypes = string> = T extends string ? string extends T ? OptionsTemplateValueNonEnum<T> : string : OptionsTemplateValueNonEnum<T>;
export declare type OptionsTemplate<T> = {
    [P in keyof T]: T[P] extends OptionsObjectType ? OptionsTemplate<T[P]> : T[P] extends OptionsTemplateNativeTypes ? OptionsTemplateValue<T[P]> : never;
};
export declare type OptionsValidationResult<T> = {
    readonly _foreign: Record<string, unknown>;
    readonly _validated: PartialOptions<T>;
};
export declare type PartialOptions<T> = {
    [P in keyof T]?: T[P] extends OptionsObjectType ? PartialOptions<T[P]> : T[P];
};
declare type OptionsTemplateTypeMap = {
    __TPL_boolean_TYPE__: boolean;
    __TPL_number_TYPE__: number;
    __TPL_string_TYPE__: string;
    __TPL_array_TYPE__: Array<any> | ReadonlyArray<any>;
    __TPL_function_TYPE__: OptionsFunctionType;
    __TPL_null_TYPE__: null;
    __TPL_object_TYPE__: OptionsObjectType;
};
declare type OptionsTemplateValueNonEnum<T extends OptionsTemplateNativeTypes> = OptionsTemplateType<T> | [OptionsTemplateType<T>, ...Array<OptionsTemplateTypes>];
declare type ExtractPropsKey<T, TProps extends T[keyof T]> = {
    [P in keyof T]: TProps extends T[P] ? P : never;
}[keyof T];
declare type OptionsTemplateTypesDictionary = {
    readonly boolean: OptionsTemplateType<boolean>;
    readonly number: OptionsTemplateType<number>;
    readonly string: OptionsTemplateType<string>;
    readonly array: OptionsTemplateType<Array<any>>;
    readonly object: OptionsTemplateType<OptionsObjectType>;
    readonly function: OptionsTemplateType<OptionsFunctionType>;
    readonly null: OptionsTemplateType<null>;
};
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
declare const validateOptions: <T extends PlainObject<any>>(options: PartialOptions<T>, template: OptionsTemplate<T>, optionsDiff?: T | null | undefined, doWriteErrors?: boolean | undefined) => OptionsValidationResult<T>;
export { validateOptions, optionsTemplateTypes };
