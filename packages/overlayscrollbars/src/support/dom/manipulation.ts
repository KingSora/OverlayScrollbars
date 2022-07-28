import { isArrayLike } from 'support/utils/types';
import { each, from } from 'support/utils/array';
import { parent } from 'support/dom/traversal';

type NodeCollection = ArrayLike<Node> | Node | false | null | undefined;

/**
 * Inserts Nodes before the given preferredAnchor element.
 * @param parentElm The parent of the preferredAnchor element or the element which shall be the parent of the inserted Nodes.
 * @param preferredAnchor The element before which the Nodes shall be inserted or null if the elements shall be appended at the end.
 * @param insertedElms The Nodes which shall be inserted.
 */
const before = (
  parentElm: Node | false | null | undefined,
  preferredAnchor: Node | false | null | undefined,
  insertedElms: NodeCollection
): void => {
  if (insertedElms && parentElm) {
    let anchor: Node | false | null | undefined = preferredAnchor;
    let fragment: DocumentFragment | Node | null | undefined;

    if (isArrayLike(insertedElms)) {
      fragment = document.createDocumentFragment();

      // append all insertedElms to the fragment and if one of these is the anchor, change the anchor
      each(insertedElms, (insertedElm) => {
        if (insertedElm === anchor) {
          anchor = insertedElm.previousSibling;
        }
        fragment!.appendChild(insertedElm);
      });
    } else {
      fragment = insertedElms;
    }

    // if the preferred anchor isn't null set it to a valid anchor
    if (preferredAnchor) {
      if (!anchor) {
        anchor = parentElm.firstChild;
      } else if (anchor !== preferredAnchor) {
        anchor = anchor.nextSibling;
      }
    }

    parentElm.insertBefore(fragment, anchor || null);
  }
};

/**
 * Appends the given children at the end of the given Node.
 * @param node The Node to which the children shall be appended.
 * @param children The Nodes which shall be appended.
 */
export const appendChildren = (
  node: Node | false | null | undefined,
  children: NodeCollection
): void => {
  before(node, null, children);
};

/**
 * Prepends the given children at the start of the given Node.
 * @param node The Node to which the children shall be prepended.
 * @param children The Nodes which shall be prepended.
 */
export const prependChildren = (
  node: Node | false | null | undefined,
  children: NodeCollection
): void => {
  before(node, node && node.firstChild, children);
};

/**
 * Inserts the given Nodes before the given Node.
 * @param node The Node before which the given Nodes shall be inserted.
 * @param insertedNodes The Nodes which shall be inserted.
 */
export const insertBefore = (
  node: Node | false | null | undefined,
  insertedNodes: NodeCollection
): void => {
  before(parent(node), node, insertedNodes);
};

/**
 * Inserts the given Nodes after the given Node.
 * @param node The Node after which the given Nodes shall be inserted.
 * @param insertedNodes The Nodes which shall be inserted.
 */
export const insertAfter = (
  node: Node | false | null | undefined,
  insertedNodes: NodeCollection
): void => {
  before(parent(node), node && node.nextSibling, insertedNodes);
};

/**
 * Removes the given Nodes from their parent.
 * @param nodes The Nodes which shall be removed.
 */
export const removeElements = (nodes: NodeCollection): void => {
  if (isArrayLike(nodes)) {
    each(from(nodes), (e) => removeElements(e));
  } else if (nodes) {
    const parentElm = parent(nodes);
    if (parentElm) {
      parentElm.removeChild(nodes);
    }
  }
};
