export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type ReadonlyOptions<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? ReadonlyOptions<T[P]> : T[P];
};

export type PlainObject<T = any> = { [name: string]: T };

export type StyleObject<CustomCssProps = ''> = {
  [Key in keyof CSSStyleDeclaration | (CustomCssProps extends string ? CustomCssProps : '')]?:
    | string
    | number;
};

export type OverflowStyle = 'scroll' | 'hidden' | 'visible';
