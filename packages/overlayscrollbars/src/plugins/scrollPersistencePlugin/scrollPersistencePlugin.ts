import type { OverlayScrollbars } from '../../overlayscrollbars';
import type { InstancePlugin, InstancePluginEvent } from '../plugins';
import {
  dataAttributeScrollKey,
  dataAttributeViewport,
  dataValueViewportScrolling,
} from '../../classnames';
import {
  addEventListener,
  addRemoveAttrClass,
  debounce,
  equalXY,
  getAttr,
  getElementScroll,
  isBodyElement,
  isFunction,
  isNumber,
  isObject,
  isString,
  mathAbs,
  noop,
  push,
  runEachAndClear,
  scrollElementTo,
  wnd,
} from '../../support';

export type ScrollPersistenceStorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type ScrollPersistenceStorage = 'session' | 'local' | ScrollPersistenceStorageAdapter;

export interface ScrollPersistencePosition {
  x: number;
  y: number;
}

export type ScrollPersistenceAxis = 'x' | 'y' | 'xy';

export type ScrollPersistenceKeyResolver = (
  instance: OverlayScrollbars
) => string | false | null | undefined;

export interface ScrollPersistencePluginOptions {
  storage: ScrollPersistenceStorage;
  prefix: string;
  key: string | ScrollPersistenceKeyResolver | null;
  axes: ScrollPersistenceAxis;
  debounce: number | false | null;
  restoreOnUpdate: boolean;
}

export interface ScrollPersistencePluginInstance {
  save: () => void;
  restore: () => boolean;
  clear: () => void;
  get: () => ScrollPersistencePosition | null;
  key: () => string | null;
}

export const scrollPersistencePluginModuleName = 'osScrollPersistencePlugin';

const defaultPluginOptions: ScrollPersistencePluginOptions = {
  storage: 'session',
  prefix: 'os-scroll:',
  key: null,
  axes: 'xy',
  debounce: 100,
  restoreOnUpdate: true,
};

const isFiniteNumber = (value: unknown): value is number =>
  isNumber(value) && Number.isFinite(value);

const isAxisReached = (actual: number, expected: number) => mathAbs(actual - expected) <= 1;

const isStorageAdapter = (value: unknown): value is ScrollPersistenceStorageAdapter =>
  isObject(value) &&
  isFunction((value as ScrollPersistenceStorageAdapter).getItem) &&
  isFunction((value as ScrollPersistenceStorageAdapter).setItem) &&
  isFunction((value as ScrollPersistenceStorageAdapter).removeItem);

const resolveStorage = (
  storageOption: ScrollPersistenceStorage,
  docWindow: Window
): ScrollPersistenceStorageAdapter | null => {
  if (isString(storageOption)) {
    try {
      const storage = storageOption === 'local' ? docWindow.localStorage : docWindow.sessionStorage;
      return isStorageAdapter(storage) ? storage : null;
    } catch {
      return null;
    }
  }
  return isStorageAdapter(storageOption) ? storageOption : null;
};

const getLocationScope = (docWindow: Window): string => {
  try {
    const loc = docWindow.location;
    return loc ? `${loc.pathname || ''}${loc.search || ''}` : '';
  } catch {
    return '';
  }
};

const getElementDomPath = (elm: HTMLElement): string => {
  const segments: string[] = [];
  let curr: HTMLElement | null = elm;

  while (curr) {
    if (isBodyElement(curr)) {
      segments.unshift('body');
      break;
    }

    const id = getAttr(curr, 'id');
    if (id) {
      segments.unshift(`#${id}`);
      break;
    }

    const tagName = curr.tagName.toLowerCase();
    let index = 0;
    let sibling = curr.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tagName) {
        index += 1;
      }
      sibling = sibling.previousElementSibling;
    }

    segments.unshift(`${tagName}[${index}]`);
    curr = curr.parentElement;
  }

  return segments.join('>');
};

const resolveStorageKey = (
  osInstance: OverlayScrollbars,
  options: ScrollPersistencePluginOptions,
  docWindow: Window
): string | null => {
  const { key, prefix } = options;

  if (isFunction(key)) {
    const resolved = key(osInstance);
    return isString(resolved) && resolved ? `${prefix}${resolved}` : null;
  }

  if (isString(key)) {
    return key ? `${prefix}${key}` : null;
  }

  const { target } = osInstance.elements();
  const attrKey = getAttr(target, dataAttributeScrollKey);
  if (attrKey === 'false') {
    return null;
  }

  const scope = getLocationScope(docWindow);
  const elementKey = attrKey || getElementDomPath(target);
  return elementKey ? `${prefix}${scope}:${elementKey}` : null;
};

const readStoredPosition = (
  storage: ScrollPersistenceStorageAdapter | null,
  storageKey: string | null
): ScrollPersistencePosition | null => {
  if (!storage || !storageKey) {
    return null;
  }

  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (isObject(parsed)) {
      const { x, y } = parsed as Record<string, unknown>;
      if (isFiniteNumber(x) && isFiniteNumber(y)) {
        return { x, y };
      }
    }
  } catch {
    return null;
  }

  return null;
};

const writeStoredPosition = (
  storage: ScrollPersistenceStorageAdapter | null,
  storageKey: string | null,
  position: ScrollPersistencePosition
): void => {
  if (!storage || !storageKey) {
    return;
  }

  try {
    storage.setItem(storageKey, JSON.stringify({ x: position.x, y: position.y }));
  } catch {
    noop();
  }
};

const removeStoredPosition = (
  storage: ScrollPersistenceStorageAdapter | null,
  storageKey: string | null
): void => {
  if (!storage || !storageKey) {
    return;
  }

  try {
    storage.removeItem(storageKey);
  } catch {
    noop();
  }
};

const createScrollPersistenceInstance = (
  osInstance: OverlayScrollbars,
  event: InstancePluginEvent,
  pluginOptions?: Partial<ScrollPersistencePluginOptions>
): ScrollPersistencePluginInstance => {
  const options: ScrollPersistencePluginOptions = {
    storage: pluginOptions?.storage ?? defaultPluginOptions.storage,
    prefix: pluginOptions?.prefix ?? defaultPluginOptions.prefix,
    key: pluginOptions?.key !== undefined ? pluginOptions.key : defaultPluginOptions.key,
    axes: pluginOptions?.axes ?? defaultPluginOptions.axes,
    debounce:
      pluginOptions?.debounce !== undefined
        ? pluginOptions.debounce
        : defaultPluginOptions.debounce,
    restoreOnUpdate: pluginOptions?.restoreOnUpdate ?? defaultPluginOptions.restoreOnUpdate,
  };
  const { storage: storageOption, axes, debounce: debounceOption, restoreOnUpdate } = options;
  const persistX = axes === 'x' || axes === 'xy';
  const persistY = axes === 'y' || axes === 'xy';

  let isInitialized = false;
  let isDestroyed = false;
  let hasAttemptedInitialRestore = false;
  let pendingRestore: ScrollPersistencePosition | null = null;
  let lastAppliedScroll: ScrollPersistencePosition | null = null;

  const cleanupFns: Array<() => void> = [];
  const interactionCleanupFns: Array<() => void> = [];

  const getDocumentWindow = (): Window => {
    const { target } = osInstance.elements();
    return (target && target.ownerDocument && target.ownerDocument.defaultView) || wnd;
  };

  const getStorage = () => resolveStorage(storageOption, getDocumentWindow());
  const getKey = () => resolveStorageKey(osInstance, options, getDocumentWindow());

  const isPositionReached = (
    actual: ScrollPersistencePosition,
    expected: ScrollPersistencePosition
  ) =>
    (!persistX || isAxisReached(actual.x, expected.x)) &&
    (!persistY || isAxisReached(actual.y, expected.y));

  const clearPendingRestore = () => {
    pendingRestore = null;
    runEachAndClear(interactionCleanupFns);
  };

  const attachInteractionListeners = () => {
    if (interactionCleanupFns.length) {
      return;
    }

    const { host, scrollEventElement } = osInstance.elements();
    const cancelRestore = () => {
      lastAppliedScroll = null;
      clearPendingRestore();
    };
    const interactionEvents = 'wheel pointerdown touchstart keydown';

    push(interactionCleanupFns, [
      addEventListener(host, interactionEvents, cancelRestore),
      scrollEventElement !== host
        ? addEventListener(scrollEventElement, interactionEvents, cancelRestore)
        : noop,
    ]);
  };

  const applyPosition = (targetPos: ScrollPersistencePosition, allowRetry: boolean): boolean => {
    const { scrollOffsetElement } = osInstance.elements();
    const before = getElementScroll(scrollOffsetElement);
    const revertScrollObscuringStyles = addRemoveAttrClass(
      scrollOffsetElement,
      dataAttributeViewport,
      dataValueViewportScrolling,
      true
    );

    scrollElementTo(scrollOffsetElement, {
      x: persistX ? targetPos.x : undefined,
      y: persistY ? targetPos.y : undefined,
    });

    revertScrollObscuringStyles();

    const after = getElementScroll(scrollOffsetElement);
    if (!equalXY(before, after)) {
      lastAppliedScroll = after;
    }

    if (isPositionReached(after, targetPos)) {
      clearPendingRestore();
      return true;
    }

    if (allowRetry && restoreOnUpdate) {
      pendingRestore = targetPos;
      attachInteractionListeners();
    } else {
      clearPendingRestore();
    }

    return false;
  };

  const saveNow = () => {
    if (isDestroyed || !isInitialized) {
      return;
    }

    const { scrollOffsetElement } = osInstance.elements();
    const current = getElementScroll(scrollOffsetElement);
    writeStoredPosition(getStorage(), getKey(), {
      x: persistX ? current.x : 0,
      y: persistY ? current.y : 0,
    });
  };

  const debouncedSave = debounce(saveNow, {
    _debounceTiming: debounceOption,
  });

  const save = () => {
    debouncedSave._clear();
    lastAppliedScroll = null;
    saveNow();
  };

  const restore = (): boolean => {
    if (isDestroyed || !isInitialized) {
      return false;
    }

    const saved = readStoredPosition(getStorage(), getKey());
    if (!saved) {
      return false;
    }

    applyPosition(saved, true);
    return true;
  };

  const clear = () => {
    debouncedSave._clear();
    clearPendingRestore();
    lastAppliedScroll = null;
    removeStoredPosition(getStorage(), getKey());
  };

  const get = (): ScrollPersistencePosition | null => readStoredPosition(getStorage(), getKey());

  event('initialized', () => {
    isInitialized = true;

    if (isFunction(options.key) || getKey()) {
      const docWindow = getDocumentWindow();
      push(
        cleanupFns,
        addEventListener(docWindow, 'pagehide beforeunload', () => {
          debouncedSave._flush();
        })
      );
    }
  });

  event('updated', () => {
    if (!isInitialized || isDestroyed) {
      return;
    }

    if (!hasAttemptedInitialRestore) {
      hasAttemptedInitialRestore = true;

      const { scrollOffsetElement } = osInstance.elements();
      const currentScroll = getElementScroll(scrollOffsetElement);
      const { start } = osInstance.state().scrollCoordinates;
      const atOrigin =
        (!persistX || currentScroll.x === start.x) && (!persistY || currentScroll.y === start.y);

      if (atOrigin) {
        const saved = readStoredPosition(getStorage(), getKey());
        if (saved) {
          applyPosition(saved, true);
        }
      }
      return;
    }

    if (pendingRestore && restoreOnUpdate) {
      applyPosition(pendingRestore, true);
    }
  });

  event('scroll', () => {
    if (isDestroyed) {
      return;
    }

    const { scrollOffsetElement } = osInstance.elements();
    const current = getElementScroll(scrollOffsetElement);

    if (
      lastAppliedScroll &&
      isAxisReached(current.x, lastAppliedScroll.x) &&
      isAxisReached(current.y, lastAppliedScroll.y)
    ) {
      lastAppliedScroll = null;
      return;
    }

    lastAppliedScroll = null;

    if (pendingRestore) {
      clearPendingRestore();
    }

    debouncedSave();
  });

  event('destroyed', (_, canceled) => {
    if (!canceled && isInitialized) {
      debouncedSave._flush();
    }

    debouncedSave._clear();
    clearPendingRestore();
    runEachAndClear(cleanupFns);
    lastAppliedScroll = null;
    isDestroyed = true;
  });

  return {
    save,
    restore,
    clear,
    get,
    key: getKey,
  };
};

export const createScrollPersistencePlugin = (
  pluginOptions?: Partial<ScrollPersistencePluginOptions>
): InstancePlugin<typeof scrollPersistencePluginModuleName, ScrollPersistencePluginInstance> => ({
  osScrollPersistencePlugin: {
    instance: (osInstance, event) =>
      createScrollPersistenceInstance(osInstance, event, pluginOptions),
  },
});

export const ScrollPersistencePlugin: InstancePlugin<
  typeof scrollPersistencePluginModuleName,
  ScrollPersistencePluginInstance
> = {
  osScrollPersistencePlugin: {
    instance: (osInstance, event) => createScrollPersistenceInstance(osInstance, event),
  },
};
