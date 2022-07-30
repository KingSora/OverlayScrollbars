declare type NodeCollection = ArrayLike<Node> | Node | false | null | undefined;
/**
 * Appends the given children at the end of the given Node.
 * @param node The Node to which the children shall be appended.
 * @param children The Nodes which shall be appended.
 */
export declare const appendChildren: (node: Node | false | null | undefined, children: NodeCollection) => void;
/**
 * Prepends the given children at the start of the given Node.
 * @param node The Node to which the children shall be prepended.
 * @param children The Nodes which shall be prepended.
 */
export declare const prependChildren: (node: Node | false | null | undefined, children: NodeCollection) => void;
/**
 * Inserts the given Nodes before the given Node.
 * @param node The Node before which the given Nodes shall be inserted.
 * @param insertedNodes The Nodes which shall be inserted.
 */
export declare const insertBefore: (node: Node | false | null | undefined, insertedNodes: NodeCollection) => void;
/**
 * Inserts the given Nodes after the given Node.
 * @param node The Node after which the given Nodes shall be inserted.
 * @param insertedNodes The Nodes which shall be inserted.
 */
export declare const insertAfter: (node: Node | false | null | undefined, insertedNodes: NodeCollection) => void;
/**
 * Removes the given Nodes from their parent.
 * @param nodes The Nodes which shall be removed.
 */
export declare const removeElements: (nodes: NodeCollection) => void;
export {};
