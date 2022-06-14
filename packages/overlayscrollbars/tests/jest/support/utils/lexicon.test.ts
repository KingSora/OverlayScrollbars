import { getLexicon } from 'support/utils/lexicon';

describe('getLexicon', () => {
  test('Get vertical Lexicon', () => {
    const lexicon = getLexicon();
    expect(lexicon._widthHeight).toBe('height');
    expect(lexicon._WidthHeight).toBe('Height');
    expect(lexicon._leftTop).toBe('top');
    expect(lexicon._LeftTop).toBe('Top');
    expect(lexicon._xy).toBe('y');
    expect(lexicon._XY).toBe('Y');
    expect(lexicon._wh).toBe('h');
    expect(lexicon._lt).toBe('t');
  });

  test('Get horizontal Lexicon', () => {
    const lexicon = getLexicon(true);
    expect(lexicon._widthHeight).toBe('width');
    expect(lexicon._WidthHeight).toBe('Width');
    expect(lexicon._leftTop).toBe('left');
    expect(lexicon._LeftTop).toBe('Left');
    expect(lexicon._xy).toBe('x');
    expect(lexicon._XY).toBe('X');
    expect(lexicon._wh).toBe('w');
    expect(lexicon._lt).toBe('l');
  });
});
