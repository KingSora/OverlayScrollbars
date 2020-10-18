import { PlainObject } from 'typings';
import { Environment } from 'environment';
export declare abstract class OverlayScrollbarsLifecycle<T extends PlainObject> {
    protected environment: Environment;
    constructor(environment: Environment);
    abstract _update(options?: T): void;
    abstract _destruct(): void;
}
