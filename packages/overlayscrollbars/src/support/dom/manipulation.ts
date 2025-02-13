import type { NodeElementTarget, NodeElementTargetCollection } from './types';
import { createOrKeepArray, each } from '../utils/array';
import { parent } from './traversal';
import { bind } from '../utils';

/**
 * Removes the given Nodes from their parent.
 * @param nodes The Nodes which shall be removed.
 */
export const removeElements = (nodes: NodeElementTargetCollection): void => {
  each(createOrKeepArray(nodes), (node) => {
    const parentElm = parent(node);
    if (node && parentElm) {
      parentElm.removeChild(node);
    }
  });
};

/**
 * Appends the given children at the end of the given Node.
 * @param node The Node to which the children shall be appended.
 * @param children The Nodes which shall be appended.
 * @returns A function which removes the inserted nodes.
 */
export const appendChildren = (node: NodeElementTarget, children: NodeElementTargetCollection) =>
  bind(
    removeElements,
    node &&
      children &&
      each(createOrKeepArray(children), (child) => {
        if (child) {
          node.appendChild(child);
        }
      })
  );
