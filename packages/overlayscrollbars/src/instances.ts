import { OverlayScrollbars } from 'overlayscrollbars';

const targetInstanceMap: WeakMap<Element, OverlayScrollbars> = new WeakMap();

/**
 * Adds the given OverlayScrollbars instance to the given element.
 * @param target The element which is the target of the OverlayScrollbars instance.
 * @param osInstance The OverlayScrollbars instance.
 */
export const addInstance = (target: Element, osInstance: OverlayScrollbars): void => {
  targetInstanceMap.set(target, osInstance);
};

/**
 * Removes a OverlayScrollbars instance from the given element.
 * @param target The element from which its OverlayScrollbars instance shall be removed.
 */
export const removeInstance = (target: Element): void => {
  targetInstanceMap.delete(target);
};

/**
 * Gets the OverlayScrollbars from the given element or undefined if it doesn't have one.
 * @param target The element of which its OverlayScrollbars instance shall be get.
 */
export const getInstance = (target: Element): OverlayScrollbars | undefined =>
  targetInstanceMap.get(target);
