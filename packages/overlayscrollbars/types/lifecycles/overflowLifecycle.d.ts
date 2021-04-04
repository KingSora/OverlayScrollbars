import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
/**
 * Lifecycle with the responsibility to set the correct overflow and scrollbar hiding styles of the viewport element.
 * @param lifecycleHub
 * @returns
 */
export declare const createOverflowLifecycle: (lifecycleHub: LifecycleHub) => Lifecycle;
