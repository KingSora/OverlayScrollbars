import { isFunction, isBoolean, isNull, isUndefined } from 'support';
import type {
  StructureInitialization,
  StructureInitializationStrategy,
} from 'setups/structureSetup';
import type {
  ScrollbarsInitialization,
  ScrollbarsInitializationStrategy,
} from 'setups/scrollbarsSetup';

type StaticInitialization = HTMLElement | null | undefined;
type DynamicInitialization = HTMLElement | boolean | null | undefined;

export type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;

export type InitializationTargetObject = StructureInitialization & ScrollbarsInitialization;

export type InitializationTarget = InitializationTargetElement | InitializationTargetObject;

export type InitializationStrategy = StructureInitializationStrategy &
  ScrollbarsInitializationStrategy;

/**
 * Static elements MUST be present.
 * Null or undefined behave like if this element wasn't specified during initialization.
 */
export type StaticInitializationElement<Args extends any[]> =
  | ((...args: Args) => StaticInitialization)
  | StaticInitialization;

/**
 * Dynamic element CAN be present.
 * If its a element the element will be handled as the repsective element.
 * True means that the respective dynamic element is forced to be generated.
 * False means that the respective dynamic element is forced NOT to be generated.
 * Null or undefined behave like if this element wasn't specified during initialization.
 */
export type DynamicInitializationElement<Args extends any[]> =
  | ((...args: Args) => DynamicInitialization)
  | DynamicInitialization;

export type InitializtationElementStrategy<InitElm> = Exclude<InitElm, HTMLElement>;

export type DefaultInitializtationElementStrategy<
  InitElm extends StaticInitializationElement<any> | DynamicInitializationElement<any>
> = Extract<InitElm, (...args: any[]) => any> extends (...args: infer P) => any
  ? (...args: P) => HTMLElement
  : never;

const staticInitializationElement = <T extends StaticInitializationElement<any>>(
  args: Parameters<Extract<T, (...args: any[]) => any>>,
  defaultStaticInitializationElement: DefaultInitializtationElementStrategy<T>,
  staticInitializationElementStrategy?: InitializtationElementStrategy<T>,
  staticInitializationElementValue?: T | false
): HTMLElement => {
  const result =
    staticInitializationElementValue ||
    (isFunction(staticInitializationElementStrategy)
      ? staticInitializationElementStrategy.apply(0, args)
      : staticInitializationElementStrategy);

  return (
    (isFunction(result) ? result.apply(0, args) : result) ||
    defaultStaticInitializationElement.apply(0, args)
  );
};

const dynamicInitializationElement = <T extends DynamicInitializationElement<any>>(
  args: Parameters<Extract<T, (...args: any[]) => any>>,
  defaultDynamicInitializationElement: DefaultInitializtationElementStrategy<T>,
  dynamicInitializationElementStrategy?: InitializtationElementStrategy<T>,
  dynamicInitializationElementValue?: T | false
): HTMLElement | false => {
  const takeInitializationValue =
    isBoolean(dynamicInitializationElementValue) || !!dynamicInitializationElementValue;
  const result = takeInitializationValue
    ? (dynamicInitializationElementValue as boolean | HTMLElement)
    : isFunction(dynamicInitializationElementStrategy)
    ? dynamicInitializationElementStrategy.apply(0, args)
    : dynamicInitializationElementStrategy;

  return result === true || isNull(result) || isUndefined(result) || isFunction(result)
    ? defaultDynamicInitializationElement.apply(0, args)
    : result;
};

export { staticInitializationElement, dynamicInitializationElement };
