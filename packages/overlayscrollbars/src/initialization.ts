import { isFunction, isHTMLElement, isNull, isUndefined } from '~/support';
import { getEnvironment } from '~/environment';
import type { DeepPartial } from '~/typings';

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
 * If an `HTMLElement` is passed the passed element will be taken as the repsective element.
 * With `false`, `null` or `undefined` an appropriate element is generated automatically.
 */
export type StaticInitializationElement<Args extends any[]> =
  /** A function which returns the the StaticInitialization value. */
  | ((...args: Args) => StaticInitialization)
  /** The StaticInitialization value. */
  | StaticInitialization;

/**
 * Dynamic elements are elements which CAN be present in the final DOM.
 * If an `HTMLElement`is passed the passed element will be taken as the repsective element.
 * With `true` an appropriate element is generated automatically.
 * With `false`, `null` or `undefined` the element won't be in the DOM.
 */
export type DynamicInitializationElement<Args extends any[]> =
  /** A function which returns the the DynamicInitialization value. */
  | ((...args: Args) => DynamicInitialization)
  /** The DynamicInitialization value. */
  | DynamicInitialization;

/**
 * Describes how a OverlayScrollbar instance should initialize.
 */
export type Initialization = {
  /**
   * Customizes which elements are generated and used.
   * If a function is passed to any of the fields, it receives the `target` element as its argument.
   */
  elements: {
    /**
     * Assign a custom element as the host element.
     * Only relevant if the target element is a Textarea.
     */
    host: StaticInitializationElement<[target: InitializationTargetElement]>;
    /** Assign a custom element as the viewport element. */
    viewport: StaticInitializationElement<[target: InitializationTargetElement]>;
    /** Assign a custom element as the padding element or force the element not to be generated. */
    padding: DynamicInitializationElement<[target: InitializationTargetElement]>;
    /** Assign a custom element as the content element or force the element not to be generated. */
    content: DynamicInitializationElement<[target: InitializationTargetElement]>;
  };
  /**
   * Customizes elements related to the scrollbars.
   * If a function is passed, it receives the `target`, `host` and `viewport` element as arguments.
   */
  scrollbars: {
    slot: DynamicInitializationElement<
      [target: InitializationTargetElement, host: HTMLElement, viewport: HTMLElement]
    >;
  };
  /**
   * Customizes the cancelation behavior.
   */
  cancel: {
    /** Whether the initialization shall be canceled if the native scrollbars are overlaid. */
    nativeScrollbarsOverlaid: boolean;
    /**
     * Whether the initialization shall be canceled if its applied to a body element.
     * With `true` an initialization is always canceled, with `false` its never canceled.
     * With `null` the initialization will only be canceled when the initialization would affect the browsers functionality. (window.scrollTo, mobile browser behavior etc.)
     */
    body: boolean | null;
  };
};

/** The initialization target element. */
export type InitializationTargetElement = HTMLElement; // | HTMLTextAreaElement;

/**
 * The initialization target object.
 * OverlayScrollbars({ target: myElement }) is equivalent to OverlayScrollbars(myElement).
 */
export type InitializationTargetObject = DeepPartial<Initialization> & {
  target: InitializationTargetElement;
};

/** The initialization target. */
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
