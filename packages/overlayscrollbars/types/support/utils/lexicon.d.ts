interface GenericLexicon<T extends boolean> {
    _widthHeight: T extends true ? 'width' : 'height';
    _WidthHeight: T extends true ? 'Width' : 'Height';
    _leftTop: T extends true ? 'left' : 'top';
    _LeftTop: T extends true ? 'Left' : 'Top';
    _xy: T extends true ? 'x' : 'y';
    _XY: T extends true ? 'X' : 'Y';
    _wh: T extends true ? 'w' : 'h';
    _lt: T extends true ? 'l' : 't';
}
export interface Lexicon<T extends boolean> extends GenericLexicon<T> {
    _inverted: Lexicon<T extends true ? false : true>;
}
export declare const getLexicon: <T extends boolean = false>(horizontal?: T | undefined) => Lexicon<T>;
export {};
