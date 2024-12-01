import type { QRL, Signal } from '@qwik.dev/core';

export type PossibleSignal<T> = T | Signal<T>;

export type PossibleQRL<T> = T | QRL<() => T>;
