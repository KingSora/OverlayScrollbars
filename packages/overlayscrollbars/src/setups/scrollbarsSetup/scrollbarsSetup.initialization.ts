import type { InitializationTargetElement, DynamicInitializationElement } from 'initialization';

export type ScrollbarsDynamicInitializationElement = DynamicInitializationElement<
  [target: InitializationTargetElement, host: HTMLElement, viewport: HTMLElement]
>;

/**
 * Object for special initialization.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Null or Undefined means that the environment initialization strategy is used.
 */
export interface ScrollbarsInitialization {
  scrollbarsSlot: ScrollbarsDynamicInitializationElement;
}
