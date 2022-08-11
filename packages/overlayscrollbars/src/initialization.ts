import { isFunction, isHTMLElement, isNull, isUndefined } from 'support';
import { getEnvironment } from 'environment';
import { DeepPartial } from 'typings';
import { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';

type StaticInitialization = HTMLElement | false | null;
type DynamicInitialization = HTMLElement | boolean | null;

type FallbackInitializtationElement<
  InitElm extends StaticInitializationElement<any> | DynamicInitializationElement<any>
> = Extract<InitElm, (...args: any[]) => any> extends (...args: infer P) => any
  ? (...args: P) => HTMLElement
  : never;

/**
 * Static elements are elements which MUST be present in the final DOM.
 * With false, null or undefined the element will be generated, otherwise the specified element is taken.
 */
export type StaticInitializationElement<Args extends any[]> =
  | ((...args: Args) => StaticInitialization)
  | StaticInitialization;

/**
 * Dynamic element are elements which CAN be present in the final DOM.
 * If its a element the element will be taken as the repsective element.
 * With true the element will be generated.
 * With false, null or undefined the element won't be generated and wont be in the DOM.
 */
export type DynamicInitializationElement<Args extends any[]> =
  | ((...args: Args) => DynamicInitialization)
  | DynamicInitialization;

export type Initialization = {
  elements: {
    host: StaticInitializationElement<[target: InitializationTargetElement]>; // only relevant for textarea
    viewport: StaticInitializationElement<[target: InitializationTargetElement]>;
    padding: DynamicInitializationElement<[target: InitializationTargetElement]>;
    content: DynamicInitializationElement<[target: InitializationTargetElement]>;
  };
  scrollbars: {
    slot: DynamicInitializationElement<
      [target: InitializationTargetElement, host: HTMLElement, viewport: HTMLElement]
    >;
  };
  cancel: {
    nativeScrollbarsOverlaid: boolean;
    body: boolean | null;
  };
};

export type InitializationTargetElement = HTMLElement | HTMLTextAreaElement;

export type InitializationTargetObject = DeepPartial<Initialization> & {
  target: InitializationTargetElement;
};

export type InitializationTarget = InitializationTargetElement | InitializationTargetObject;

const resolveInitialization = <T>(value: any, args: any): T =>
  isFunction(value) ? value.apply(0, args) : value;

export const staticInitializationElement = <T extends StaticInitializationElement<any>>(
  args: Parameters<Extract<T, (...initializationFnArgs: any[]) => any>>,
  fallbackStaticInitializationElement: FallbackInitializtationElement<T>,
  defaultStaticInitializationElementStrategy: T,
  staticInitializationElementValue?: T
): HTMLElement => {
  const staticInitialization = isUndefined(staticInitializationElementValue)
    ? defaultStaticInitializationElementStrategy
    : staticInitializationElementValue;
  const resolvedInitialization = resolveInitialization<StaticInitialization>(
    staticInitialization,
    args
  );
  return resolvedInitialization || fallbackStaticInitializationElement();
};

export const dynamicInitializationElement = <T extends DynamicInitializationElement<any>>(
  args: Parameters<Extract<T, (...initializationFnArgs: any[]) => any>>,
  fallbackDynamicInitializationElement: FallbackInitializtationElement<T>,
  defaultDynamicInitializationElementStrategy: T,
  dynamicInitializationElementValue?: T
): HTMLElement | false => {
  const dynamicInitialization = isUndefined(dynamicInitializationElementValue)
    ? defaultDynamicInitializationElementStrategy
    : dynamicInitializationElementValue;
  const resolvedInitialization = resolveInitialization<DynamicInitialization>(
    dynamicInitialization,
    args
  );
  return (
    !!resolvedInitialization &&
    (isHTMLElement(resolvedInitialization)
      ? resolvedInitialization
      : fallbackDynamicInitializationElement())
  );
};

export const cancelInitialization = (
  cancelInitializationValue: DeepPartial<Initialization['cancel']> | false | null | undefined,
  structureSetupElements: StructureSetupElementsObj
): boolean => {
  const { nativeScrollbarsOverlaid, body } = cancelInitializationValue || {};
  const { _isBody } = structureSetupElements;
  const { _getDefaultInitialization, _nativeScrollbarsOverlaid, _nativeScrollbarsHiding } =
    getEnvironment();
  const { nativeScrollbarsOverlaid: defaultNativeScrollbarsOverlaid, body: defaultbody } =
    _getDefaultInitialization().cancel;

  const resolvedNativeScrollbarsOverlaid =
    nativeScrollbarsOverlaid ?? defaultNativeScrollbarsOverlaid;
  const resolvedDocumentScrollingElement = isUndefined(body) ? defaultbody : body;

  const finalNativeScrollbarsOverlaid =
    (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y) &&
    resolvedNativeScrollbarsOverlaid;
  const finalDocumentScrollingElement =
    _isBody &&
    (isNull(resolvedDocumentScrollingElement)
      ? !_nativeScrollbarsHiding
      : resolvedDocumentScrollingElement);

  return !!finalNativeScrollbarsOverlaid || !!finalDocumentScrollingElement;
};
