import {
  assignDeep,
  bind,
  each,
  getElmentScroll,
  isEmptyObject,
  keys,
  runEachAndClear,
  scrollElementTo,
} from '~/support';
import { createOptionCheck } from '~/options';
import type { OptionsCheckFn, Options, PartialOptions, ReadonlyOptions } from '~/options';
import type { DeepReadonly } from '~/typings';
import type { InitializationTarget } from '~/initialization';
import type { ObserversSetupState, ObserversSetupUpdateHints } from './observersSetup';
import type { StructureSetupState, StructureSetupUpdateHints } from './structureSetup';
import type { StructureSetupElementsObj } from './structureSetup/structureSetup.elements';
import type { ScrollbarsSetupElementsObj } from './scrollbarsSetup/scrollbarsSetup.elements';
import { createObserversSetup } from './observersSetup';
import { createScrollbarsSetup } from './scrollbarsSetup';
import { createStructureSetup } from './structureSetup';

export type SetupUpdateHints = Partial<Record<string, boolean>>;

export type SetupUpdateInfo = {
  _checkOption: OptionsCheckFn<Options>;
  _changedOptions: PartialOptions;
  _force: boolean;
};

export type Setup<
  U extends SetupUpdateInfo,
  S extends Readonly<Record<string, any>>,
  H extends SetupUpdateHints | void
> = [
  /** The create function which returns the `destroy` function. */
  _create: () => () => void,
  /** Function which updates the setup and returns the update result. */
  _update: (updateInfo: U) => H,
  /** Function which returns the current state. */
  _state: S
];

export interface SetupsUpdateInfo {
  /** The options that changed or `undefined` if none changed. */
  _changedOptions?: PartialOptions;
  /** Whether chache should be ignored. */
  _force?: boolean;
  /** Whether observers should take their records and thus update as well. */
  _takeRecords?: boolean;
  /** Whether one or more scrollbars has been cloned. */
  _cloneScrollbar?: boolean;
  /** Whether the window was resized because of a zoom or resize. */
  _windowResize?: boolean;
}

export interface SetupsUpdateHints {
  readonly _observersUpdateHints: Required<DeepReadonly<ObserversSetupUpdateHints>>;
  readonly _structureUpdateHints: Required<DeepReadonly<StructureSetupUpdateHints>>;
}

export interface SetupsState {
  readonly _observersSetupState: DeepReadonly<ObserversSetupState>;
  readonly _structureSetupState: DeepReadonly<StructureSetupState>;
}

export interface SetupsElements {
  readonly _structureSetupElements: DeepReadonly<StructureSetupElementsObj>;
  readonly _scrollbarsSetupElements: DeepReadonly<ScrollbarsSetupElementsObj>;
}

export type Setups = [
  construct: () => () => void,
  update: (updateInfo: SetupsUpdateInfo) => boolean,
  getState: () => SetupsState,
  elements: SetupsElements,
  canceled: () => void
];

export const createSetups = (
  target: InitializationTarget,
  options: ReadonlyOptions,
  onUpdated: (updateInfo: SetupsUpdateInfo, updateHints: SetupsUpdateHints) => void,
  onScroll: (scrollEvent: Event) => void
): Setups => {
  const [
    structureSetupCreate,
    structureSetupUpdate,
    structureSetupState,
    structureSetupElements,
    structureSetupCanceled,
  ] = createStructureSetup(target);
  const [observersSetupCreate, observersSetupUpdate, observersSetupState] = createObserversSetup(
    structureSetupElements,
    (observersUpdateHints) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      update({}, observersUpdateHints);
    }
  );
  const [scrollbarsSetupCreate, scrollbarsSetupUpdate, , scrollbarsSetupElements] =
    createScrollbarsSetup(
      target,
      options,
      observersSetupState,
      structureSetupState,
      structureSetupElements,
      onScroll
    );

  const booleanUpdateHints = <T extends SetupUpdateHints>(hints: T): Required<T> =>
    each(assignDeep({}, hints) as Required<T>, (value, key, booleanHints) => {
      booleanHints[key as keyof T] = !!value as T[keyof T];
    });

  const updateHintsAreTruthy = (hints: SetupUpdateHints) =>
    keys(hints).some((key) => !!hints[key as keyof typeof hints]);

  const update = (
    updateInfo: SetupsUpdateInfo,
    observerUpdateHints?: ObserversSetupUpdateHints
  ): boolean => {
    const {
      _changedOptions: rawChangedOptions,
      _force: rawForce,
      _takeRecords,
      _cloneScrollbar,
      _windowResize,
    } = updateInfo;
    const _changedOptions = rawChangedOptions || {};
    const _force = !!rawForce;
    const baseUpdateInfoObj: SetupUpdateInfo = {
      _checkOption: createOptionCheck(options, _changedOptions, _force),
      _changedOptions,
      _force,
    };

    if (_cloneScrollbar) {
      scrollbarsSetupUpdate(baseUpdateInfoObj);
      return false;
    }

    const observersHints =
      observerUpdateHints ||
      observersSetupUpdate(
        assignDeep({}, baseUpdateInfoObj, {
          _takeRecords,
        })
      );

    if (_windowResize) {
      assignDeep(observersHints, {
        _sizeChanged: true,
        _contentMutation: true,
      } satisfies ObserversSetupUpdateHints);
    }

    const structureHints = structureSetupUpdate(
      assignDeep({}, baseUpdateInfoObj, {
        _observersState: observersSetupState,
        _observersUpdateHints: observersHints,
      })
    );
    scrollbarsSetupUpdate(
      assignDeep({}, baseUpdateInfoObj, {
        _observersUpdateHints: observersHints,
        _structureUpdateHints: structureHints,
      })
    );

    const truthyObserversHints = updateHintsAreTruthy(observersHints);
    const truthyStructureHints = updateHintsAreTruthy(structureHints);
    const changed =
      truthyObserversHints || truthyStructureHints || !isEmptyObject(_changedOptions) || _force;

    changed &&
      onUpdated(updateInfo, {
        _observersUpdateHints: booleanUpdateHints(observersHints),
        _structureUpdateHints: booleanUpdateHints(structureHints),
      });

    return changed;
  };

  return [
    () => {
      const { _target, _viewport, _documentElm, _isBody } = structureSetupElements;
      const scrollingElement = _isBody ? _documentElm.documentElement : _target;
      const initialScroll = getElmentScroll(scrollingElement);
      const destroyFns = [observersSetupCreate(), structureSetupCreate(), scrollbarsSetupCreate()];

      scrollElementTo(_viewport, initialScroll);

      return bind(runEachAndClear, destroyFns);
    },
    update,
    () => ({
      _observersSetupState: observersSetupState,
      _structureSetupState: structureSetupState,
    }),
    {
      _structureSetupElements: structureSetupElements,
      _scrollbarsSetupElements: scrollbarsSetupElements,
    },
    structureSetupCanceled,
  ];
};
