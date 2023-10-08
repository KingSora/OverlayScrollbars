import type { OptionsCheckFn } from '~/options';

export type SetupUpdateSegment<Hints extends Record<string, any>> = (
  updateHints: Hints,
  checkOption: OptionsCheckFn,
  force: boolean
) => Partial<Hints> | void;

export interface Setup<U extends Record<string, any>, S extends Record<string, any>, R> {
  /** The create function which returns the `destroy` function. */
  _create: () => () => void;
  /** Function which updates the setup and returns the update result. */
  _update: (updateInfo: U) => R;
  /** Function which returns the current state. */
  _state: S;
}
