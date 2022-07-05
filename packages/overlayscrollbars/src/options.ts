import { assignDeep, each, isObject, keys, isArray, hasOwnProperty, isFunction } from 'support';
import { PartialOptions, ReadonlyOptions } from 'typings';

const stringify = (value: any) =>
  JSON.stringify(value, (_, val) => {
    if (isFunction(val)) {
      throw new Error();
    }
    return val;
  });

export type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical';

export type OverflowBehavior =
  | 'hidden'
  | 'scroll'
  | 'visible'
  | 'visible-hidden'
  | 'visible-scroll';

export type VisibilityBehavior = 'visible' | 'hidden' | 'auto';

export type AutoHideBehavior = 'never' | 'scroll' | 'leave' | 'move';

export type ScrollBehavior = 'always' | 'ifneeded' | 'never';

export type BasicEventCallback = (this: any) => void;

export type ScrollEventCallback = (this: any, args?: UIEvent) => void;

export type OverflowChangedCallback = (this: any, args?: OverflowChangedArgs) => void;

export type OverflowAmountChangedCallback = (this: any, args?: OverflowAmountChangedArgs) => void;

export type DirectionChangedCallback = (this: any, args?: DirectionChangedArgs) => void;

export type SizeChangedCallback = (this: any, args?: SizeChangedArgs) => void;

export type UpdatedCallback = (this: any, args?: UpdatedArgs) => void;

export interface OSOptions {
  paddingAbsolute: boolean;
  updating: {
    elementEvents: Array<[string, string]> | null;
    attributes: string[] | null;
    debounce: number | [number, number] | null;
  };
  overflow: {
    x: OverflowBehavior;
    y: OverflowBehavior;
  };
  scrollbars: {
    visibility: VisibilityBehavior;
    autoHide: AutoHideBehavior;
    autoHideDelay: number;
    dragScroll: boolean;
    clickScroll: boolean;
    touch: boolean;
  };
  nativeScrollbarsOverlaid: {
    show: boolean;
    initialize: boolean;
  };
}

export type ReadonlyOSOptions = ReadonlyOptions<OSOptions>;

export interface OverflowChangedArgs {
  x: boolean;
  y: boolean;
  xScrollable: boolean;
  yScrollable: boolean;
  clipped: boolean;
}

export interface OverflowAmountChangedArgs {
  x: number;
  y: number;
}

export interface DirectionChangedArgs {
  isRTL: number;
  dir: string;
}

export interface SizeChangedArgs {
  width: number;
  height: number;
}

export interface UpdatedArgs {
  forced: boolean;
}

export const defaultOptions: OSOptions = {
  // resize: 'none', // none || both  || horizontal || vertical || n || b || h || v
  paddingAbsolute: false, // true || false
  updating: {
    elementEvents: [['img', 'load']], // array of tuples || null
    attributes: null,
    debounce: [0, 33], // number || number array || null
  },
  overflow: {
    x: 'scroll', // visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
    y: 'scroll', // visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
  },
  nativeScrollbarsOverlaid: {
    show: false, // true || false
    initialize: false, // true || false
  },
  scrollbars: {
    visibility: 'auto', // visible || hidden || auto || v || h || a
    autoHide: 'never', // never || scroll || leave || move || n || s || l || m
    autoHideDelay: 800, // number
    dragScroll: true, // true || false
    clickScroll: false, // true || false
    touch: true, // true || false
  },
  /*
  textarea: {
    dynWidth: false, // true || false
    dynHeight: false, // true || false
    inheritedAttrs: ['style', 'class'], // string || array || null
  },
  */
};

export const getOptionsDiff = <T>(
  currOptions: T,
  newOptions: PartialOptions<T>
): PartialOptions<T> => {
  const diff: PartialOptions<T> = {};
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
          if (stringify(currOptionValue) === stringify(newOptionValue)) {
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
