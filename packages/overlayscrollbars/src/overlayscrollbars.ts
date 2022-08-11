import {
  assignDeep,
  isEmptyObject,
  each,
  isFunction,
  keys,
  isHTMLElement,
  createEventListenerHub,
  isPlainObject,
} from 'support';
import { getOptionsDiff } from 'options';
import { getEnvironment } from 'environment';
import { cancelInitialization } from 'initialization';
import { addInstance, getInstance, removeInstance } from 'instances';
import { createStructureSetup, createScrollbarsSetup } from 'setups';
import { getPlugins, addPlugin, optionsValidationPluginName } from 'plugins';
import type { XY, TRBL } from 'support';
import type { Options, ReadonlyOptions } from 'options';
import type { Plugin, OptionsValidationPluginInstance } from 'plugins';
import type { InitializationTarget, Initialization } from 'initialization';
import type { DeepPartial, OverflowStyle } from 'typings';
import type { EventListenerMap, EventListener, InitialEventListeners } from 'eventListeners';
import type {
  ScrollbarsSetupElement,
  ScrollbarStructure,
} from 'setups/scrollbarsSetup/scrollbarsSetup.elements';

// Notes:
// Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer

export interface OverlayScrollbarsStatic {
  (target: InitializationTarget): OverlayScrollbars | undefined;
  (
    target: InitializationTarget,
    options: DeepPartial<Options>,
    eventListeners?: InitialEventListeners
  ): OverlayScrollbars;

  plugin(plugin: Plugin | Plugin[]): void;
  valid(osInstance: any): boolean;
  env(): Environment;
}

export interface Environment {
  scrollbarsSize: XY<number>;
  scrollbarsOverlaid: XY<boolean>;
  scrollbarsHiding: boolean;
  rtlScrollBehavior: { n: boolean; i: boolean };
  flexboxGlue: boolean;
  cssCustomProperties: boolean;
  staticDefaultInitialization: Initialization;
  staticDefaultOptions: Options;

  getDefaultInitialization(): Initialization;
  setDefaultInitialization(newDefaultInitialization: DeepPartial<Initialization>): void;
  getDefaultOptions(): Options;
  setDefaultOptions(newDefaultOptions: DeepPartial<Options>): void;
}

export interface State {
  padding: TRBL;
  paddingAbsolute: boolean;
  overflowEdge: XY<number>;
  overflowAmount: XY<number>;
  overflowStyle: XY<OverflowStyle>;
  hasOverflow: XY<boolean>;
  directionRTL: boolean;
  destroyed: boolean;
}

export interface ScrollbarElements {
  scrollbar: HTMLElement;
  track: HTMLElement;
  handle: HTMLElement;
}

export interface CloneableScrollbarElements extends ScrollbarElements {
  clone(): ScrollbarElements;
}

export interface Elements {
  target: HTMLElement;
  host: HTMLElement;
  padding: HTMLElement;
  viewport: HTMLElement;
  content: HTMLElement;
  scrollOffsetElement: HTMLElement;
  scrollEventElement: HTMLElement | Document;
  scrollbarHorizontal: CloneableScrollbarElements;
  scrollbarVertical: CloneableScrollbarElements;
}

export interface OverlayScrollbars {
  options(): Options;
  options(newOptions: DeepPartial<Options>): Options;

  update(force?: boolean): OverlayScrollbars;

  destroy(): void;

  state(): State;

  elements(): Elements;

  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): () => void;
  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): () => void;

  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): void;
  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: InitializationTarget,
  options?: DeepPartial<Options>,
  eventListeners?: InitialEventListeners
) => {
  const { _getDefaultOptions, _addListener: addEnvListener } = getEnvironment();
  const plugins = getPlugins();
  const targetIsElement = isHTMLElement(target);
  const instanceTarget = targetIsElement ? target : target.target;
  const potentialInstance = getInstance(instanceTarget);
  if (options && !potentialInstance) {
    let destroyed = false;
    const optionsValidationPlugin = plugins[
      optionsValidationPluginName
    ] as OptionsValidationPluginInstance;
    const validateOptions = (newOptions?: DeepPartial<Options>) => {
      const opts = newOptions || {};
      const validate = optionsValidationPlugin && optionsValidationPlugin._;
      return validate ? validate(opts, true) : opts;
    };
    const currentOptions: ReadonlyOptions = assignDeep(
      {},
      _getDefaultOptions(),
      validateOptions(options)
    );
    const [addEvent, removeEvent, triggerEvent] = createEventListenerHub(eventListeners);
    const [updateStructure, structureState, destroyStructure] = createStructureSetup(
      target,
      currentOptions
    );
    const [updateScrollbars, scrollbarsState, destroyScrollbars] = createScrollbarsSetup(
      target,
      currentOptions,
      structureState
    );
    const update = (changedOptions: DeepPartial<Options>, force?: boolean) => {
      updateStructure(changedOptions, !!force);
    };
    const removeEnvListener = addEnvListener(update.bind(0, {}, true));
    const destroy = (canceled?: boolean) => {
      removeInstance(instanceTarget);
      removeEnvListener();

      destroyScrollbars();
      destroyStructure();

      destroyed = true;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      triggerEvent('destroyed', [instance, !!canceled]);
      removeEvent();
    };

    const instance: OverlayScrollbars = {
      options(newOptions?: DeepPartial<Options>) {
        if (newOptions) {
          const changedOptions = getOptionsDiff(currentOptions, validateOptions(newOptions));

          if (!isEmptyObject(changedOptions)) {
            assignDeep(currentOptions, changedOptions);
            update(changedOptions);
          }
        }
        return assignDeep({}, currentOptions);
      },
      on: addEvent,
      off: (name, listener) => {
        name && listener && removeEvent(name, listener as any);
      },
      state() {
        const {
          _overflowEdge,
          _overflowAmount,
          _overflowStyle,
          _hasOverflow,
          _padding,
          _paddingAbsolute,
          _directionIsRTL,
        } = structureState();
        return assignDeep(
          {},
          {
            overflowEdge: _overflowEdge,
            overflowAmount: _overflowAmount,
            overflowStyle: _overflowStyle,
            hasOverflow: _hasOverflow,
            padding: _padding,
            paddingAbsolute: _paddingAbsolute,
            directionRTL: _directionIsRTL,
            destroyed,
          }
        );
      },
      elements() {
        const {
          _target,
          _host,
          _padding,
          _viewport,
          _content,
          _scrollOffsetElement,
          _scrollEventElement,
        } = structureState._elements;
        const { _horizontal, _vertical } = scrollbarsState._elements;
        const translateScrollbarStructure = (
          scrollbarStructure: ScrollbarStructure
        ): ScrollbarElements => {
          const { _handle, _track, _scrollbar } = scrollbarStructure;
          return {
            scrollbar: _scrollbar,
            track: _track,
            handle: _handle,
          };
        };
        const translateScrollbarsSetupElement = (
          scrollbarsSetupElement: ScrollbarsSetupElement
        ): CloneableScrollbarElements => {
          const { _scrollbarStructures, _clone } = scrollbarsSetupElement;
          const translatedStructure = translateScrollbarStructure(_scrollbarStructures[0]);

          return assignDeep({}, translatedStructure, {
            clone: () => {
              const result = translateScrollbarStructure(_clone());
              updateScrollbars({}, true, {});
              return result;
            },
          });
        };
        return assignDeep(
          {},
          {
            target: _target,
            host: _host,
            padding: _padding || _viewport,
            viewport: _viewport,
            content: _content || _viewport,
            scrollOffsetElement: _scrollOffsetElement,
            scrollEventElement: _scrollEventElement,
            scrollbarHorizontal: translateScrollbarsSetupElement(_horizontal),
            scrollbarVertical: translateScrollbarsSetupElement(_vertical),
          }
        );
      },
      update(force?: boolean) {
        update({}, force);
        return instance;
      },
      destroy: destroy.bind(0),
    };

    structureState._addOnUpdatedListener((updateHints, changedOptions, force: boolean) => {
      updateScrollbars(changedOptions, force, updateHints);
    });

    each(keys(plugins), (pluginName) => {
      const pluginInstance = plugins[pluginName];
      if (isFunction(pluginInstance)) {
        pluginInstance(OverlayScrollbars, instance);
      }
    });

    if (cancelInitialization(!targetIsElement && target.cancel, structureState._elements)) {
      destroy(true);
      return instance;
    }

    structureState._appendElements();
    scrollbarsState._appendElements();

    addInstance(instanceTarget, instance);
    triggerEvent('initialized', [instance]);

    structureState._addOnUpdatedListener((updateHints, changedOptions, force) => {
      const {
        _sizeChanged,
        _directionChanged,
        _heightIntrinsicChanged,
        _overflowEdgeChanged,
        _overflowAmountChanged,
        _overflowStyleChanged,
        _contentMutation,
        _hostMutation,
      } = updateHints;

      triggerEvent('updated', [
        instance,
        {
          updateHints: {
            sizeChanged: _sizeChanged,
            directionChanged: _directionChanged,
            heightIntrinsicChanged: _heightIntrinsicChanged,
            overflowEdgeChanged: _overflowEdgeChanged,
            overflowAmountChanged: _overflowAmountChanged,
            overflowStyleChanged: _overflowStyleChanged,
            contentMutation: _contentMutation,
            hostMutation: _hostMutation,
          },
          changedOptions,
          force,
        },
      ]);
    });

    return instance.update(true);
  }
  return potentialInstance!;
};

OverlayScrollbars.plugin = addPlugin;
OverlayScrollbars.valid = (osInstance: any) => {
  const hasElmsFn = osInstance && (osInstance as OverlayScrollbars).elements;
  const elements = isFunction(hasElmsFn) && hasElmsFn();
  return isPlainObject(elements) && !!getInstance(elements.target);
};
OverlayScrollbars.env = () => {
  const {
    _nativeScrollbarsSize,
    _nativeScrollbarsOverlaid,
    _nativeScrollbarsHiding,
    _rtlScrollBehavior,
    _flexboxGlue,
    _cssCustomProperties,
    _staticDefaultInitialization,
    _staticDefaultOptions,
    _getDefaultInitialization,
    _setDefaultInitialization,
    _getDefaultOptions,
    _setDefaultOptions,
  } = getEnvironment();
  return assignDeep(
    {},
    {
      scrollbarsSize: _nativeScrollbarsSize,
      scrollbarsOverlaid: _nativeScrollbarsOverlaid,
      scrollbarsHiding: _nativeScrollbarsHiding,
      rtlScrollBehavior: _rtlScrollBehavior,
      flexboxGlue: _flexboxGlue,
      cssCustomProperties: _cssCustomProperties,
      staticDefaultInitialization: _staticDefaultInitialization,
      staticDefaultOptions: _staticDefaultOptions,

      getDefaultInitialization: _getDefaultInitialization,
      setDefaultInitialization: _setDefaultInitialization,
      getDefaultOptions: _getDefaultOptions,
      setDefaultOptions: _setDefaultOptions,
    }
  );
};
