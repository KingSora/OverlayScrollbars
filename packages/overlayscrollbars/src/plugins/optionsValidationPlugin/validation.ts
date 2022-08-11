import { each, hasOwnProperty, keys, push, isEmptyObject } from 'support/utils';
import { type, isArray, isUndefined, isPlainObject, isString } from 'support/utils/types';
import { PlainObject, DeepPartial } from 'typings';

export type OptionsObjectType = Record<string, unknown>;
export type OptionsFunctionType = (this: any, ...args: any[]) => any;
export type OptionsTemplateType<T extends OptionsTemplateNativeTypes> = ExtractPropsKey<
  OptionsTemplateTypeMap,
  T
>;
export type OptionsTemplateTypes = keyof OptionsTemplateTypeMap;
export type OptionsTemplateNativeTypes = OptionsTemplateTypeMap[keyof OptionsTemplateTypeMap];

export type OptionsTemplateValue<T extends OptionsTemplateNativeTypes = string> = T extends string
  ? string extends T
    ? OptionsTemplateValueNonEnum<T>
    : string
  : OptionsTemplateValueNonEnum<T>;

export type OptionsTemplate<T> = {
  [P in keyof T]: T[P] extends OptionsObjectType
    ? OptionsTemplate<T[P]>
    : T[P] extends OptionsTemplateNativeTypes
    ? OptionsTemplateValue<T[P]>
    : never;
};

export type OptionsValidationResult<T> = [
  DeepPartial<T>, // validated
  Record<string, unknown> // foreign
];

type OptionsTemplateTypeMap = {
  __TPL_boolean_TYPE__: boolean;
  __TPL_number_TYPE__: number;
  __TPL_string_TYPE__: string;
  __TPL_array_TYPE__: Array<any> | ReadonlyArray<any>;
  __TPL_function_TYPE__: OptionsFunctionType;
  __TPL_null_TYPE__: null;
  __TPL_object_TYPE__: OptionsObjectType;
};

type OptionsTemplateValueNonEnum<T extends OptionsTemplateNativeTypes> =
  | OptionsTemplateType<T>
  | [OptionsTemplateType<T>, ...Array<OptionsTemplateTypes>];

type ExtractPropsKey<T, TProps extends T[keyof T]> = {
  [P in keyof T]: TProps extends T[P] ? P : never;
}[keyof T];

type OptionsTemplateTypesDictionary = {
  readonly boolean: OptionsTemplateType<boolean>;
  readonly number: OptionsTemplateType<number>;
  readonly string: OptionsTemplateType<string>;
  readonly array: OptionsTemplateType<Array<any>>;
  readonly object: OptionsTemplateType<OptionsObjectType>;
  readonly function: OptionsTemplateType<OptionsFunctionType>;
  readonly null: OptionsTemplateType<null>;
};

const optionsTemplateTypes: OptionsTemplateTypesDictionary = {
  boolean: '__TPL_boolean_TYPE__',
  number: '__TPL_number_TYPE__',
  string: '__TPL_string_TYPE__',
  array: '__TPL_array_TYPE__',
  object: '__TPL_object_TYPE__',
  function: '__TPL_function_TYPE__',
  null: '__TPL_null_TYPE__',
};

/**
 * Validates the given options object according to the given template object and returns a object which looks like:
 * {
 *  foreign   : a object which consists of properties which aren't defined inside the template. (foreign properties)
 *  validated : a object which consists only of valid properties. (property name is inside the template and value has a correct type)
 * }
 * @param template The template according to which the options object shall be validated.
 * @param options The options object which shall be validated.
 * @param optionsDiff When provided the returned validated object will only have properties which are different to this objects properties.
 * Example (assume all properties are valid to the template):
 * Options object            : { a: 'a', b: 'b', c: 'c' }
 * optionsDiff object        : { a: 'a', b: 'b', c: undefined }
 * Returned validated object : { c: 'c' }
 * Because the value of the properties a and b didn't change, they aren't included in the returned object.
 * Without the optionsDiff object the returned validated object would be: { a: 'a', b: 'b', c: 'c' }
 * @param doWriteErrors True if errors shall be logged into the console, false otherwise.
 * @param propPath The propertyPath which lead to this object. (used for error logging)
 */
const validateRecursive = <T extends PlainObject>(
  template: OptionsTemplate<T>,
  options: DeepPartial<T>,
  doWriteErrors?: boolean,
  propPath?: string
): OptionsValidationResult<T> => {
  const validatedOptions: DeepPartial<T> = {};
  const optionsCopy: DeepPartial<T> = { ...options };
  const props = keys(template).filter((prop) => hasOwnProperty(options, prop));

  each(props, (prop: Extract<keyof T, string>) => {
    const optionsValue: any = options[prop];
    const templateValue: PlainObject | string | OptionsTemplateTypes | Array<OptionsTemplateTypes> =
      template[prop];
    const templateIsComplex = isPlainObject(templateValue);
    const propPrefix = propPath ? `${propPath}.` : '';

    // if the template has a object as value, it means that the options are complex (verschachtelt)
    if (templateIsComplex && isPlainObject(optionsValue)) {
      const [validated, foreign] = validateRecursive(
        templateValue as T,
        optionsValue,
        doWriteErrors,
        propPrefix + prop
      );
      validatedOptions[prop] = validated as any;
      optionsCopy[prop] = foreign as any;

      each([optionsCopy, validatedOptions], (value) => {
        if (isEmptyObject(value[prop])) {
          delete value[prop];
        }
      });
    } else if (!templateIsComplex) {
      let isValid = false;
      const errorEnumStrings: Array<string> = [];
      const errorPossibleTypes: Array<string> = [];
      const optionsValueType = type(optionsValue);
      const templateValueArr: Array<string | OptionsTemplateTypes> = !isArray(templateValue)
        ? [templateValue as string | OptionsTemplateTypes]
        : (templateValue as Array<OptionsTemplateTypes>);

      each(templateValueArr, (currTemplateType) => {
        // if currType value isn't inside possibleTemplateTypes we assume its a enum string value
        let typeString: string | undefined;
        each(optionsTemplateTypes, (value: string, key: string) => {
          if (value === currTemplateType) {
            typeString = key;
          }
        });
        const isEnumString = isUndefined(typeString);
        if (isEnumString && isString(optionsValue)) {
          // split it into a array which contains all possible values for example: ["yes", "no", "maybe"]
          const enumStringSplit = currTemplateType.split(' ');
          isValid = !!enumStringSplit.find((possibility) => possibility === optionsValue);

          // build error message
          push(errorEnumStrings, enumStringSplit);
        } else {
          isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
        }

        // build error message
        push(errorPossibleTypes, isEnumString ? optionsTemplateTypes.string : typeString!);

        // continue if invalid, break if valid
        return !isValid;
      });

      if (isValid) {
        validatedOptions[prop] = optionsValue;
      } else if (doWriteErrors) {
        console.warn(
          `${
            `The option "${propPrefix}${prop}" wasn't set, because it doesn't accept the type [ ${optionsValueType.toUpperCase()} ] with the value of "${optionsValue}".\r\n` +
            `Accepted types are: [ ${errorPossibleTypes.join(', ').toUpperCase()} ].\r\n`
          }${
            errorEnumStrings.length > 0
              ? `\r\nValid strings are: [ ${errorEnumStrings.join(', ')} ].`
              : ''
          }`
        );
      }

      delete optionsCopy[prop];
    }
  });

  return [validatedOptions, optionsCopy]; // optionsCopy equals now to foreign options
};

/**
 * Validates the given options object according to the given template object and returns a tuple which looks like:
 * [
 *  validated : a object which consists only of valid properties. (property name is inside the template and value has a correct type)
 *  foreign   : a object which consists of properties which aren't defined inside the template. (foreign properties)
 * ]
 * @param template The template according to which the options object shall be validated.
 * @param options The options object which shall be validated.
 * @param doWriteErrors True if errors shall be logged into the console, false otherwise.
 */
const validateOptions = <T extends PlainObject>(
  template: OptionsTemplate<T>,
  options: DeepPartial<T>,
  doWriteErrors?: boolean
): OptionsValidationResult<T> => validateRecursive<T>(template, options, doWriteErrors);

export { validateOptions, optionsTemplateTypes };
