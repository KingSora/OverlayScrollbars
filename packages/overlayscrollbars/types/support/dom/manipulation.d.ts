declare type NodeCollection = ArrayLike<Node> | Node | null | undefined;
export declare const appendChildren: (node: Node | null | undefined, children: NodeCollection) => void;
export declare const prependChildren: (node: Node | null | undefined, children: NodeCollection) => void;
export declare const insertBefore: (node: Node | null | undefined, insertedNodes: NodeCollection) => void;
export declare const insertAfter: (node: Node | null | undefined, insertedNodes: NodeCollection) => void;
export declare const removeElements: (nodes: NodeCollection) => void;
export {};
