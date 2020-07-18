declare type NodeCollection = ArrayLike<Node> | Node | undefined | null;
export declare const appendChildren: (node: Node | null, children: NodeCollection) => void;
export declare const prependChildren: (node: Node | null, children: NodeCollection) => void;
export declare const insertBefore: (node: Node | null, insertedNodes: NodeCollection) => void;
export declare const insertAfter: (node: Node | null, insertedNodes: NodeCollection) => void;
export declare const removeElements: (nodes: NodeCollection) => void;
export {};
