import { assignDeep, hasOwnProperty } from 'support';
import type { OSOptions, ReadonlyOSOptions } from 'options';
import type { PartialOptions } from 'typings';

export type SetupElements<T extends Record<string, any>> = [elements: T, destroy: () => void];

export type SetupUpdate<T = void> = (
  changedOptions: PartialOptions<OSOptions>,
  force?: boolean
) => T;

export type SetupUpdateCheckOption = <T>(path: string) => [value: T, changed: boolean];

export type SetupUpdateSegment<Hints extends Record<string, any>> = (
  updateHints: Hints,
  checkOption: SetupUpdateCheckOption,
  force: boolean
) => Partial<Hints> | void;

export type SetupState<T extends Record<string, any>> = [
  get: () => T,
  set: (newState: Partial<T>) => void
];

export type Setup<DynamicState, StaticState extends Record<string, any> = Record<string, any>> = [
  update: SetupUpdate,
  state: (() => DynamicState) & StaticState,
  destroy: () => void
];

const getPropByPath = <T>(obj: any, path: string): T =>
  obj
    ? path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj)
    : undefined;

export const createOptionCheck =
  (
    options: ReadonlyOSOptions,
    changedOptions: PartialOptions<OSOptions>,
    force?: boolean
  ): SetupUpdateCheckOption =>
  (path: string) =>
    [getPropByPath(options, path), force || getPropByPath(changedOptions, path) !== undefined];

export const createState = <S>(initialState: S): SetupState<S> => {
  let state: S = initialState;
  return [
    () => state,
    (newState: Partial<S>) => {
      state = assignDeep({}, state, newState);
    },
  ];
};