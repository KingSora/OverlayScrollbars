import { PlainObject } from 'typings';
import { Environment } from 'environment';

export abstract class OverlayScrollbarsLifecycle<T extends PlainObject> {
  protected environment: Environment;

  constructor(environment: Environment) {
    this.environment = environment;
  }

  abstract _update(options?: T): void;

  abstract _destruct(): void;
}
