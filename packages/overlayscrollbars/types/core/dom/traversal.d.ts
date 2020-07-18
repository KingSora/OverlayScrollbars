export declare const find: (selector: string, elm?: Element | null) => ReadonlyArray<Element>;
export declare const findFirst: (selector: string, elm?: Element | null) => Element | null;
export declare const is: (elm: Element | null, selector: string) => boolean;
export declare const children: (elm: Element | null, selector?: string) => ReadonlyArray<Element>;
export declare const contents: (elm: Element | null) => ReadonlyArray<ChildNode>;
export declare const parent: (elm: Node | null) => Node | null;
