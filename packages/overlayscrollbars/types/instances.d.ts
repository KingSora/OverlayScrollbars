import { OverlayScrollbars } from 'overlayscrollbars';
/**
 * Adds the given OverlayScrollbars instance to the given element.
 * @param target The element which is the target of the OverlayScrollbars instance.
 * @param osInstance The OverlayScrollbars instance.
 */
export declare const addInstance: (target: Element, osInstance: OverlayScrollbars) => void;
/**
 * Removes a OverlayScrollbars instance from the given element.
 * @param target The element from which its OverlayScrollbars instance shall be removed.
 */
export declare const removeInstance: (target: Element) => void;
/**
 * Gets the OverlayScrollbars from the given element or undefined if it doesn't have one.
 * @param target The element of which its OverlayScrollbars instance shall be get.
 */
export declare const getInstance: (target: Element) => OverlayScrollbars | undefined;
/**
 * Gets a Map which represents all active OverayScrollbars instances.
 * The Key is the ekement and the value is the instance.
 */
export declare const allInstances: () => ReadonlyMap<Element, OverlayScrollbars>;
