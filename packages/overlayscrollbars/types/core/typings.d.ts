export declare type PlainObject<T = any> = {
    [name: string]: T;
};
export declare type Func = (this: any, ...args: any[]) => any;
export declare type OptionsTemplateType<T extends OptionsTemplateNativeTypes> = ExtractPropsKey<OptionsTemplateTypeMap, T>;
export declare type OptionsTemplateTypes = keyof OptionsTemplateTypeMap;
export declare type OptionsTemplateNativeTypes = OptionsTemplateTypeMap[keyof OptionsTemplateTypeMap];
export declare type OptionsTemplateValue<T extends OptionsTemplateNativeTypes = string> = T extends string ? string extends T ? OptionsTemplateValueNonEnum<T> : string : OptionsTemplateValueNonEnum<T>;
export declare type OptionsTemplate<T extends Required<T>> = {
    [P in keyof T]: PlainObject extends T[P] ? OptionsTemplate<Required<T[P]>> : T[P] extends OptionsTemplateNativeTypes ? OptionsTemplateValue<T[P]> : never;
};
export declare type OptionsValidated<T> = {
    [P in keyof T]?: OptionsValidated<T[P]>;
};
export declare type OptionsValidatedResult<T> = {
    readonly foreign: PlainObject;
    readonly validated: OptionsValidated<T>;
};
export declare type OptionsAndOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [T, OptionsTemplateValue<T>];
export declare type OptionsAndOptionsTemplate<T extends Required<T>> = {
    [P in keyof T]: PlainObject extends T[P] ? OptionsAndOptionsTemplate<Required<T[P]>> : T[P] extends OptionsTemplateNativeTypes ? OptionsAndOptionsTemplateValue<T[P]> : never;
};
declare type OptionsTemplateTypeMap = {
    __TPL_boolean_TYPE__: boolean;
    __TPL_number_TYPE__: number;
    __TPL_string_TYPE__: string;
    __TPL_array_TYPE__: Array<any>;
    __TPL_function_TYPE__: Func;
    __TPL_null_TYPE__: null;
    __TPL_object_TYPE__: object;
};
declare type ExtractPropsKey<T, TProps extends T[keyof T]> = {
    [P in keyof T]: TProps extends T[P] ? P : never;
}[keyof T];
declare type OptionsTemplateValueNonEnum<T extends OptionsTemplateNativeTypes> = OptionsTemplateType<T> | [OptionsTemplateType<T>, ...Array<OptionsTemplateTypes>];
export {};
