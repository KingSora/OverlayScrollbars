import { isBoolean, isFunction, isNull, isUndefined } from 'support';
import type {
  StructureInitialization,
  DefaultStructureInitialization,
} from 'setups/structureSetup';
import type {
  ScrollbarsInitialization,
  DefaultScrollbarsInitialization,
} from 'setups/scrollbarsSetup';
import { getEnvironment } from 'environment';
import { DeepPartial } from 'typings';
import { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';

type StaticInitialization = HTMLElement | null | undefined;
type DynamicInitialization = HTMLElement | boolean | null | undefined;

export type CancelInitialization = {
  cancel: {
    nativeScrollbarsOverlaid: boolean | undefined;
    body: boolean | null | undefined;
  };
};

export type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;

export type InitializationTargetObject = StructureInitialization &
  ScrollbarsInitialization &
  DeepPartial<CancelInitialization>;

export type InitializationTarget = InitializationTargetElement | InitializationTargetObject;

export type DefaultInitialization = DefaultStructureInitialization &
  DefaultScrollbarsInitialization &
  CancelInitialization;

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

export type DefaultInitializtationElement<InitElm> = Exclude<InitElm, HTMLElement>;

export type FallbackInitializtationElement<
  InitElm extends StaticInitializationElement<any> | DynamicInitializationElement<any>
> = Extract<InitElm, (...args: any[]) => any> extends (...args: infer P) => any
  ? (...args: P) => HTMLElement
  : never;

const resolveInitialization = <T>(value: any, args: any): T =>
  isFunction(value) ? value.apply(0, args) : value;

const staticInitializationElement = <T extends StaticInitializationElement<any>>(
  args: Parameters<Extract<T, (...args: any[]) => any>>,
  fallbackStaticInitializationElement: FallbackInitializtationElement<T>,
  defaultStaticInitializationElementStrategy?: DefaultInitializtationElement<T>,
  staticInitializationElementValue?: T | false
): HTMLElement =>
  resolveInitialization<StaticInitialization>(
    staticInitializationElementValue ||
      resolveInitialization<StaticInitialization>(defaultStaticInitializationElementStrategy, args),
    args
  ) || fallbackStaticInitializationElement.apply(0, args);

const dynamicInitializationElement = <T extends DynamicInitializationElement<any>>(
  args: Parameters<Extract<T, (...args: any[]) => any>>,
  fallbackDynamicInitializationElement: FallbackInitializtationElement<T>,
  defaultDynamicInitializationElementStrategy?: DefaultInitializtationElement<T>,
  dynamicInitializationElementValue?: T | false
): HTMLElement | false => {
  let result = resolveInitialization<DynamicInitialization>(
    dynamicInitializationElementValue,
    args
  );

  if (isNull(result) || isUndefined(result)) {
    result = resolveInitialization<DynamicInitialization>(
      defaultDynamicInitializationElementStrategy,
      args
    );
  }

  return result === true || isNull(result) || isUndefined(result)
    ? fallbackDynamicInitializationElement.apply(0, args)
    : result;
};

const cancelInitialization = (
  cancelInitializationValue: DeepPartial<CancelInitialization['cancel']> | false | null | undefined,
  structureSetupElements: StructureSetupElementsObj
): boolean => {
  const { nativeScrollbarsOverlaid, body } = cancelInitializationValue || {};
  const { _isBody, _viewportIsTarget } = structureSetupElements;
  const { _getDefaultInitialization, _nativeScrollbarsOverlaid } = getEnvironment();
  const { nativeScrollbarsOverlaid: defaultNativeScrollbarsOverlaid, body: defaultbody } =
    _getDefaultInitialization().cancel;

  const resolvedNativeScrollbarsOverlaid =
    nativeScrollbarsOverlaid ?? defaultNativeScrollbarsOverlaid;
  const resolvedDocumentScrollingElement = isBoolean(body) || isNull(body) ? body : defaultbody;

  const finalNativeScrollbarsOverlaid =
    (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y) &&
    resolvedNativeScrollbarsOverlaid;
  const finalDocumentScrollingElement =
    _isBody &&
    (isNull(resolvedDocumentScrollingElement)
      ? !_viewportIsTarget
      : resolvedDocumentScrollingElement);

  return !!finalNativeScrollbarsOverlaid || !!finalDocumentScrollingElement;
};

export { staticInitializationElement, dynamicInitializationElement, cancelInitialization };
