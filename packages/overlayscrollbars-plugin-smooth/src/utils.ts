export interface XY<T> {
  x: T;
  y: T;
}

export const isNumber = (obj: any): obj is number => typeof obj === 'number';

export const newXY0 = (): XY<number> => ({ x: 0, y: 0 });
