import { PlainObject } from 'typings';
export * from 'support/options/validation';
export * from 'support/options/transformation';
export declare type Func = (this: any, ...args: any[]) => any;
export declare type OptionsTemplateType<T extends OptionsTemplateNativeTypes> = ExtractPropsKey<OptionsTemplateTypeMap, T>;
export declare type OptionsTemplateTypes = keyof OptionsTemplateTypeMap;
export declare type OptionsTemplateNativeTypes = OptionsTemplateTypeMap[keyof OptionsTemplateTypeMap];
export declare type OptionsTemplateValue<T extends OptionsTemplateNativeTypes = string> = T extends string ? string extends T ? OptionsTemplateValueNonEnum<T> : string : OptionsTemplateValueNonEnum<T>;
export declare type OptionsTemplate<T extends Required<T>> = {
    [P in keyof T]: PlainObject extends T[P] ? OptionsTemplate<Required<T[P]>> : T[P] extends OptionsTemplateNativeTypes ? OptionsTemplateValue<T[P]> : never;
};
export declare type OptionsValidated<T> = {
    [P in keyof T]?: T[P];
};
export declare type OptionsValidationResult<T> = {
    readonly _foreign: PlainObject;
    readonly _validated: OptionsValidated<T>;
};
export declare type OptionsWithOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [T, OptionsTemplateValue<T>];
export declare type OptionsWithOptionsTemplate<T extends Required<T>> = {
    [P in keyof T]: PlainObject extends T[P] ? OptionsWithOptionsTemplate<Required<T[P]>> : T[P] extends OptionsTemplateNativeTypes ? OptionsWithOptionsTemplateValue<T[P]> : never;
};
declare type OptionsTemplateTypeMap = {
    __TPL_boolean_TYPE__: boolean;
    __TPL_number_TYPE__: number;
    __TPL_string_TYPE__: string;
    __TPL_array_TYPE__: Array<any>;
    __TPL_function_TYPE__: Func;
    __TPL_null_TYPE__: null;
    __TPL_object_TYPE__: Record<string, unknown>;
};
declare type OptionsTemplateValueNonEnum<T extends OptionsTemplateNativeTypes> = OptionsTemplateType<T> | [OptionsTemplateType<T>, ...Array<OptionsTemplateTypes>];
declare type ExtractPropsKey<T, TProps extends T[keyof T]> = {
    [P in keyof T]: TProps extends T[P] ? P : never;
}[keyof T];
