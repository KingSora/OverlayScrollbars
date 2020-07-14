import { OptionsTemplate, OptionsAndOptionsTemplate, PlainObject, OptionsTemplateTypes } from "core/typings";
import { isArray, isObject } from "core/utils/types";
import { each } from "core/utils/arrays";

/**
 * Transforms the given OptionsAndOptionsTemplate<T> object to its corresponding generic (T) Object or its corresponding Template object.
 * @param optionsWithOptionsTemplate The OptionsAndOptionsTemplate<T> object which shall be converted.
 * @param toTemplate True if the given OptionsAndOptionsTemplate<T> shall be converted to its corresponding Template object.
 */
export function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>): T;
export function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>, toTemplate: true | void): OptionsTemplate<T>;
export function transform<T extends Required<T>>(optionsWithOptionsTemplate: OptionsAndOptionsTemplate<T>, toTemplate?: true | void): OptionsTemplate<T> | T {
    const result: any = {};

    each(Object.keys(optionsWithOptionsTemplate), (key: Extract<keyof T, string>) => {
        const val: PlainObject | OptionsTemplateTypes | Array<OptionsTemplateTypes> = optionsWithOptionsTemplate[key];

        /* istanbul ignore else */
        if (isArray(val))
            result[key] = val[toTemplate ? 1 : 0];
        else if (isObject(val))
            result[key] = transform(val as OptionsAndOptionsTemplate<typeof val>, toTemplate);
    });

    return result;
};
