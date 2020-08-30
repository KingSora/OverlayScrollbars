export * from 'support/dom/attribute';
export * from 'support/dom/class';
export * from 'support/dom/create';
export * from 'support/dom/dimensions';
export * from 'support/dom/style';
export * from 'support/dom/manipulation';
export * from 'support/dom/offset';
export * from 'support/dom/traversal';

export interface XY<T = number> {
  x: T;
  y: T;
}

export interface WH<T = number> {
  w: T;
  h: T;
}
