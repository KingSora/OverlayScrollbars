import { OverlayScrollbars } from 'overlayscrollbars';

const targets: Set<Element> = new Set();
const targetInstanceMap: WeakMap<Element, OverlayScrollbars> = new WeakMap();

/**
 * Adds the given OverlayScrollbars instance to the given element.
 * @param target The element which is the target of the OverlayScrollbars instance.
 * @param osInstance The OverlayScrollbars instance.
 */
export const addInstance = (target: Element, osInstance: OverlayScrollbars): void => {
  targetInstanceMap.set(target, osInstance);
  targets.add(target);
};

/**
 * Removes a OverlayScrollbars instance from the given element.
 * @param target The element from which its OverlayScrollbars instance shall be removed.
 */
export const removeInstance = (target: Element): void => {
  targetInstanceMap.delete(target);
  targets.delete(target);
};

/**
 * Gets the OverlayScrollbars from the given element or undefined if it doesn't have one.
 * @param target The element of which its OverlayScrollbars instance shall be get.
 */
export const getInstance = (target: Element): OverlayScrollbars | undefined => targetInstanceMap.get(target);

/**
 * Gets a Map which represents all active OverayScrollbars instances.
 * The Key is the ekement and the value is the instance.
 */
export const allInstances = (): ReadonlyMap<Element, OverlayScrollbars> => {
  const validTargetInstanceMap: Map<Element, OverlayScrollbars> = new Map();

  targets.forEach((target: Element) => {
    /* istanbul ignore else */
    if (targetInstanceMap.has(target)) {
      validTargetInstanceMap.set(target, targetInstanceMap.get(target)!);
    }
  });

  targets.clear();

  validTargetInstanceMap.forEach((instance: OverlayScrollbars, validTarget: Element) => {
    targets.add(validTarget);
  });

  return validTargetInstanceMap;
};
