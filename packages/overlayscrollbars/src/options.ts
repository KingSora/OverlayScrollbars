import { assignDeep, each, isObject, keys, isArray, hasOwnProperty, isFunction } from 'support';
import { DeepPartial, DeepReadonly } from 'typings';

const opsStringify = (value: any) =>
  JSON.stringify(value, (_, val) => {
    if (isFunction(val)) {
      throw new Error();
    }
    return val;
  });

export type OverflowBehavior =
  | 'hidden'
  | 'scroll'
  | 'visible'
  | 'visible-hidden'
  | 'visible-scroll';

export type ScrollbarVisibilityBehavior = 'visible' | 'hidden' | 'auto';

export type ScrollbarAutoHideBehavior = 'never' | 'scroll' | 'leave' | 'move';

export interface Options {
  paddingAbsolute: boolean;
  showNativeOverlaidScrollbars: boolean;
  update: {
    elementEvents: Array<[elementSelector: string, eventNames: string]> | null;
    debounce: [timeout: number, maxWait: number] | number | null; // (if tuple: [timeout: 0, maxWait: 33], if number: [timeout: number, maxWait: false]) debounce for content Changes
    attributes: string[] | null;
    ignoreMutation: ((mutation: MutationRecord) => any) | null;
  };
  overflow: {
    x: OverflowBehavior;
    y: OverflowBehavior;
  };
  scrollbars: {
    theme: string | null;
    visibility: ScrollbarVisibilityBehavior;
    autoHide: ScrollbarAutoHideBehavior;
    autoHideDelay: number;
    dragScroll: boolean;
    clickScroll: boolean;
    pointers: string[] | null;
  };
}

export type ReadonlyOptions = DeepReadonly<Options>;

export const defaultOptions: Options = {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  update: {
    elementEvents: [['img', 'load']],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null,
  },
  overflow: {
    x: 'scroll',
    y: 'scroll',
  },
  scrollbars: {
    theme: 'os-theme-dark',
    visibility: 'auto',
    autoHide: 'never',
    autoHideDelay: 1300,
    dragScroll: true,
    clickScroll: false,
    pointers: ['mouse', 'touch', 'pen'],
  },
};

export const getOptionsDiff = <T>(currOptions: T, newOptions: DeepPartial<T>): DeepPartial<T> => {
  const diff: DeepPartial<T> = {};
  const optionsKeys = keys(newOptions).concat(keys(currOptions));

  each(optionsKeys, (optionKey) => {
    const currOptionValue = currOptions[optionKey];
    const newOptionValue = newOptions[optionKey];

    if (isObject(currOptionValue) && isObject(newOptionValue)) {
      assignDeep((diff[optionKey] = {}), getOptionsDiff(currOptionValue, newOptionValue));
    } else if (hasOwnProperty(newOptions, optionKey) && newOptionValue !== currOptionValue) {
      let isDiff = true;

      if (isArray(currOptionValue) || isArray(newOptionValue)) {
        try {
          if (opsStringify(currOptionValue) === opsStringify(newOptionValue)) {
            isDiff = false;
          }
        } catch {}
      }

      if (isDiff) {
        diff[optionKey] = newOptionValue;
      }
    }
  });

  return diff;
};
