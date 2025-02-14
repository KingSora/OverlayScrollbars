import { describe, test, expect } from 'vitest';
import {
  equal,
  equalTRBL,
  equalWH,
  equalXY,
  equalBCRWH,
} from '../../../../src/support/utils/equal';

describe('equal', () => {
  test('equal', () => {
    interface Test {
      a: number;
      b: number;
      c?: number;
    }
    const equalTest = (a?: Test, b?: Test) => equal<Test>(a, b, ['a', 'b']);

    expect(equalTest({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(true);
    expect(equalTest({ a: 1, b: 1 }, { a: 1, b: 1, c: 5 })).toBe(true);
    expect(equalTest({ a: 1, b: 1, c: 4 }, { a: 1, b: 1, c: 5 })).toBe(true);

    expect(equalTest({ a: 1, b: 1 }, { a: 2, b: 2 })).toBe(false);
    expect(equalTest({ a: 1, b: 1 }, { a: 2, b: 1 })).toBe(false);
    expect(equalTest(undefined, { a: 2, b: 1 })).toBe(false);
    expect(equalTest({ a: 1, b: 1 }, undefined)).toBe(false);
  });

  test('equalTRBL', () => {
    expect(equalTRBL({ t: 0, r: 0, b: 0, l: 0 }, { t: 0, r: 0, b: 0, l: 0 })).toBe(true);
    expect(equalTRBL({ t: 0, r: 0, b: 0, l: 0 }, { t: 0, r: 0, b: 0, l: 1 })).toBe(false);
  });

  test('equalWH', () => {
    expect(equalWH({ w: 0, h: 0 }, { w: 0, h: 0 })).toBe(true);
    expect(equalWH({ w: 0, h: 0 }, { w: 0, h: 1 })).toBe(false);
  });

  test('equalXY', () => {
    expect(equalXY({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
    expect(equalXY({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(false);
  });

  test('equalBCRWH', () => {
    const bodyBCR = document.body.getBoundingClientRect();
    expect(equalBCRWH(bodyBCR, bodyBCR)).toBe(true);
    expect(equalBCRWH(bodyBCR, { ...bodyBCR, height: 5 })).toBe(false);

    expect(equalBCRWH({ ...bodyBCR, height: 4.1 }, { ...bodyBCR, height: 4.12 })).toBe(false);
    expect(equalBCRWH({ ...bodyBCR, height: 4.1 }, { ...bodyBCR, height: 4.12 }, true)).toBe(true);
  });
});
