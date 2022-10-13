import {
  assignDeep,
  each,
  isObject,
  keys,
  isArray,
  hasOwnProperty,
  isFunction,
  isEmptyObject,
} from '~/support';
import type { DeepPartial, DeepReadonly } from '~/typings';

const opsStringify = (value: any) =>
  JSON.stringify(value, (_, val) => {
    if (isFunction(val)) {
      throw new Error();
    }
    return val;
  });

/**
 * The overflow behavior of an axis.
 */
export type OverflowBehavior =
  /** No scrolling is possible and the content is clipped. */
  | 'hidden'
  /** No scrolling is possible and the content isn't clipped. */
  | 'visible'
  /** Scrolling is possible if there is an overflow. */
  | 'scroll'
  /**
   * If the other axis has no overflow the behavior is similar to `visible`.
   * If the other axis has overflow the behavior is similar to `hidden`.
   */
  | 'visible-hidden'
  /**
   * If the other axis has no overflow the behavior is similar to `visible`.
   * If the other axis has overflow the behavior is similar to `scroll`.
   */
  | 'visible-scroll';

/**
 * The scrollbars visibility behavior.
 */
export type ScrollbarsVisibilityBehavior =
  /** The scrollbars are always visible. */
  | 'visible'
  /** The scrollbars are always hidden. */
  | 'hidden'
  /** The scrollbars are only visibile if there is overflow. */
  | 'auto';

/**
 * The scrollbars auto hide behavior
 */
export type ScrollbarsAutoHideBehavior =
  /** The scrollbars are never hidden automatically. */
  | 'never'
  /** The scrollbars are hidden unless the user scrolls. */
  | 'scroll'
  /** The scrollbars are hidden unless the pointer moves in the host element or the user scrolls. */
  | 'move'
  /** The scrollbars are hidden if the pointer leaves the host element or unless the user scrolls. */
  | 'leave';

/**
 * Describes the options of a OverlayScrollbars instance.
 */
export interface Options {
  /** Whether the padding shall be absolute. */
  paddingAbsolute: boolean;
  /** Whether to show the native scrollbars. Has only an effect it the native scrollbars are overlaid. */
  showNativeOverlaidScrollbars: boolean;
  /** Customizes the automatic update behavior. */
  update: {
    /**
     * The given Event(s) from the elements with the given selector(s) will trigger an update.
     * Useful for everything the MutationObserver and ResizeObserver can't detect
     * e.g.: and Images `load` event or the `transitionend` / `animationend` events.
     */
    elementEvents: Array<[elementSelector: string, eventNames: string]> | null;
    /**
     * The debounce which is used to detect content changes.
     * If a tuple is provided you can customize the `timeout` and the `maxWait` in milliseconds.
     * If a single number customizes only the `timeout`.
     *
     * If the `timeout` is `0`, a debounce still exists. (its executed via `requestAnimationFrame`).
     */
    debounce: [timeout: number, maxWait: number] | number | null;
    /**
     * HTML attributes which will trigger an update if they're changed.
     * Basic attributes like `id`, `class`, `style` etc. are always observed and doesn't have to be added explicitly.
     */
    attributes: string[] | null;
    /**
     * A function which makes it possible to ignore a content mutation or null if nothing shall be ignored.
     * @param mutation The MutationRecord from the MutationObserver.
     * @returns A Truthy value if the mutation shall be ignored, a falsy value otherwise.
     */
    ignoreMutation: ((mutation: MutationRecord) => any) | null;
  };
  /** Customizes the overflow behavior per axis. */
  overflow: {
    /** The overflow behavior of the horizontal (x) axis. */
    x: OverflowBehavior;
    /** The overflow behavior of the vertical (y) axis. */
    y: OverflowBehavior;
  };
  /** Customizes appearance of the scrollbars. */
  scrollbars: {
    /**
     * The scrollbars theme.
     * The theme value will be added as `class` to all `scrollbar` elements of the instance.
     */
    theme: string | null;
    /** The scrollbars visibility behavior. */
    visibility: ScrollbarsVisibilityBehavior;
    /** The scrollbars auto hide behavior. */
    autoHide: ScrollbarsAutoHideBehavior;
    /** The scrollbars auto hide delay in milliseconds. */
    autoHideDelay: number;
    /** Whether its possible to drag the handle of a scrollbar to scroll the viewport. */
    dragScroll: boolean;
    /** Whether its possible to click the track of a scrollbar to scroll the viewport. */
    clickScroll: boolean;
    /**
     * An array of pointer types which shall be supported.
     * Common pointer types are: `mouse`, `pen` and `touch`.
     * https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
     */
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
      // delete empty nested objects
      if (isEmptyObject(diff[optionKey])) {
        delete diff[optionKey];
      }
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
