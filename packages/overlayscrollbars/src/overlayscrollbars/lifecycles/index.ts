import { PlainObject } from 'typings';

export interface Lifecycle<T = PlainObject> {
  _options(options?: T): void;
  _update(force?: boolean): void;
  _destruct(): void;
}
