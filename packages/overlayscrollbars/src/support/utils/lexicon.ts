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
  // _inverted: Lexicon<T extends true ? false : true>;
}

export const getLexicon = <T extends boolean = false>(horizontal?: T): Lexicon<T> =>
  ({
    _widthHeight: horizontal ? 'width' : 'height',
    _WidthHeight: horizontal ? 'Width' : 'Height',
    _leftTop: horizontal ? 'left' : 'top',
    _LeftTop: horizontal ? 'Left' : 'Top',
    _xy: horizontal ? 'x' : 'y',
    _XY: horizontal ? 'X' : 'Y',
    _wh: horizontal ? 'w' : 'h',
    _lt: horizontal ? 'l' : 't',
    // _inverted: getLexicon(!horizontal),
  } as Lexicon<T>);
