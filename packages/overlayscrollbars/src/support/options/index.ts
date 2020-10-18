import { PlainObject } from 'typings';

export * from 'support/options/validation';
export * from 'support/options/transformation';

export type Func = (this: any, ...args: any[]) => any;
export type OptionsTemplateType<T extends OptionsTemplateNativeTypes> = ExtractPropsKey<OptionsTemplateTypeMap, T>;
export type OptionsTemplateTypes = keyof OptionsTemplateTypeMap;
export type OptionsTemplateNativeTypes = OptionsTemplateTypeMap[keyof OptionsTemplateTypeMap];
export type OptionsTemplateValue<T extends OptionsTemplateNativeTypes = string> = T extends string
  ? string extends T
    ? OptionsTemplateValueNonEnum<T>
    : string
  : OptionsTemplateValueNonEnum<T>;
export type OptionsTemplate<T extends Required<T>> = {
  [P in keyof T]: PlainObject extends T[P]
    ? OptionsTemplate<Required<T[P]>>
    : T[P] extends OptionsTemplateNativeTypes
    ? OptionsTemplateValue<T[P]>
    : never;
};
export type OptionsValidatedResult<T> = {
  readonly foreign: PlainObject;
  readonly validated: T;
};
// Options With Options Template Typings:
export type OptionsAndOptionsTemplateValue<T extends OptionsTemplateNativeTypes> = [T, OptionsTemplateValue<T>];
export type OptionsAndOptionsTemplate<T extends Required<T>> = {
  [P in keyof T]: PlainObject extends T[P]
    ? OptionsAndOptionsTemplate<Required<T[P]>>
    : T[P] extends OptionsTemplateNativeTypes
    ? OptionsAndOptionsTemplateValue<T[P]>
    : never;
};
type OptionsTemplateTypeMap = {
  __TPL_boolean_TYPE__: boolean;
  __TPL_number_TYPE__: number;
  __TPL_string_TYPE__: string;
  __TPL_array_TYPE__: Array<any>;
  __TPL_function_TYPE__: Func;
  __TPL_null_TYPE__: null;
  __TPL_object_TYPE__: object; // eslint-disable-line @typescript-eslint/ban-types
};
type OptionsTemplateValueNonEnum<T extends OptionsTemplateNativeTypes> =
  | OptionsTemplateType<T>
  | [OptionsTemplateType<T>, ...Array<OptionsTemplateTypes>];
type ExtractPropsKey<T, TProps extends T[keyof T]> = {
  [P in keyof T]: TProps extends T[P] ? P : never;
}[keyof T];
