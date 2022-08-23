import { isFunction, isHTMLElement, isNull, isUndefined } from 'support';
import { getEnvironment } from 'environment';
import type { DeepPartial } from 'typings';

type StaticInitialization = HTMLElement | false | null;
type DynamicInitialization = HTMLElement | boolean | null;
type FallbackStaticInitializtationElement<Args extends any[]> = Extract<
  StaticInitializationElement<Args>,
  (...args: Args) => any
> extends (...args: infer P) => any
  ? (...args: P) => HTMLElement
  : never;
type FallbackDynamicInitializtationElement<Args extends any[]> = Extract<
  DynamicInitializationElement<Args>,
  (...args: Args) => any
> extends (...args: infer P) => any
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

export const staticInitializationElement = <Args extends any[]>(
  args: Args,
  fallbackStaticInitializationElement: FallbackStaticInitializtationElement<Args>,
  defaultStaticInitializationElement: StaticInitializationElement<Args>,
  staticInitializationElementValue?: StaticInitializationElement<Args>
): HTMLElement => {
  const staticInitialization = isUndefined(staticInitializationElementValue)
    ? defaultStaticInitializationElement
    : staticInitializationElementValue;
  const resolvedInitialization = resolveInitialization<StaticInitialization>(
    staticInitialization,
    args
  );
  return resolvedInitialization || fallbackStaticInitializationElement.apply(0, args);
};

export const dynamicInitializationElement = <Args extends any[]>(
  args: Args,
  fallbackDynamicInitializationElement: FallbackDynamicInitializtationElement<Args>,
  defaultDynamicInitializationElement: DynamicInitializationElement<Args>,
  dynamicInitializationElementValue?: DynamicInitializationElement<Args>
): HTMLElement | false => {
  const dynamicInitialization = isUndefined(dynamicInitializationElementValue)
    ? defaultDynamicInitializationElement
    : dynamicInitializationElementValue;
  const resolvedInitialization = resolveInitialization<DynamicInitialization>(
    dynamicInitialization,
    args
  );
  return (
    !!resolvedInitialization &&
    (isHTMLElement(resolvedInitialization)
      ? resolvedInitialization
      : fallbackDynamicInitializationElement.apply(0, args))
  );
};

export const cancelInitialization = (
  isBody: boolean,
  defaultCancelInitialization: Initialization['cancel'],
  cancelInitializationValue?: DeepPartial<Initialization['cancel']> | false | null | undefined
): boolean => {
  const { nativeScrollbarsOverlaid, body } = cancelInitializationValue || {};
  const { _nativeScrollbarsOverlaid, _nativeScrollbarsHiding } = getEnvironment();
  const { nativeScrollbarsOverlaid: defaultNativeScrollbarsOverlaid, body: defaultbody } =
    defaultCancelInitialization;

  const resolvedNativeScrollbarsOverlaid =
    nativeScrollbarsOverlaid ?? defaultNativeScrollbarsOverlaid;
  const resolvedDocumentScrollingElement = isUndefined(body) ? defaultbody : body;

  const finalNativeScrollbarsOverlaid =
    (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y) &&
    resolvedNativeScrollbarsOverlaid;
  const finalDocumentScrollingElement =
    isBody &&
    (isNull(resolvedDocumentScrollingElement)
      ? !_nativeScrollbarsHiding
      : resolvedDocumentScrollingElement);

  return !!finalNativeScrollbarsOverlaid || !!finalDocumentScrollingElement;
};
