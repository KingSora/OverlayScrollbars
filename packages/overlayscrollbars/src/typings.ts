export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainObject<T = any> = { [name: string]: T };

export type NonEmptyObject<T extends Record<string, unknown>> =
  T extends Record<string, never> ? never : T;

export type StyleObjectKey = Extract<keyof CSSStyleDeclaration, string> | `--${string}`;

export type StyleObjectValue = string | number | false | null;

export type StyleObject = {
  [Key in StyleObjectKey]?: StyleObjectValue;
};

export type OverflowStyle = 'scroll' | 'hidden' | 'visible';
