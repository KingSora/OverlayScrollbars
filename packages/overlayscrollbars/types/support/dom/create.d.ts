/**
 * Creates a div DOM node.
 */
export declare const createDiv: (classNames?: string | undefined) => HTMLDivElement;
/**
 * Creates DOM nodes modeled after the passed html string and returns the root dom nodes as a array.
 * @param html The html string after which the DOM nodes shall be created.
 */
export declare const createDOM: (html: string) => ReadonlyArray<Node>;
