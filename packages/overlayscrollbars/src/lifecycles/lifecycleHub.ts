import { TRBL, CacheValues, each, push, OptionsValidated, hasOwnProperty } from 'support';
import { Options } from 'options';
import { getEnvironment } from 'environment';
import { StructureSetup } from 'setups/structureSetup';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';
import { createPaddingLifecycle } from 'lifecycles/paddingLifecycle';
import { createOverflowLifecycle } from 'lifecycles/overflowLifecycle';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver } from 'observers/domObserver';
import { StyleObject } from 'typings';

export type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;

export interface LifecycleOptionInfo<T> {
  readonly _value: T;
  _changed: boolean;
}

export interface LifecycleAdaptiveUpdateHints {
  _sizeChanged: boolean;
  _hostMutation: boolean;
  _contentMutation: boolean;
  _paddingStyleChanged: boolean;
}

export interface LifecycleUpdateHints extends LifecycleAdaptiveUpdateHints {
  _directionIsRTL: CacheValues<boolean>;
  _heightIntrinsic: CacheValues<boolean>;
}

export type Lifecycle = (
  updateHints: LifecycleUpdateHints,
  checkOption: LifecycleCheckOption,
  force: boolean
) => Partial<LifecycleAdaptiveUpdateHints> | void;

export interface LifecycleHubInstance {
  _update(changedOptions?: OptionsValidated<Options> | null, force?: boolean): void;
  _destroy(): void;
}

export interface LifecycleHub {
  _options: Options;
  _structureSetup: StructureSetup;
  _getPadding(): TRBL;
  _setPadding(newPadding?: TRBL | null): void;
  _getPaddingStyle(): StyleObject;
  _setPaddingStyle(newPaddingStlye?: StyleObject | null): void;
}

const getPropByPath = <T>(obj: any, path: string): T =>
  obj && path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj);

const attrs = ['id', 'class', 'style', 'open'];
const paddingFallback: TRBL = { t: 0, r: 0, b: 0, l: 0 };
const viewportPaddingStyleFallback: StyleObject = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};
const directionIsRTLCacheValuesFallback: CacheValues<boolean> = {
  _value: false,
  _previous: false,
  _changed: false,
};
const heightIntrinsicCacheValuesFallback: CacheValues<boolean> = {
  _value: false,
  _previous: false,
  _changed: false,
};

export const createLifecycleHub = (options: Options, structureSetup: StructureSetup): LifecycleHubInstance => {
  let padding = paddingFallback;
  let viewportPaddingStyle = viewportPaddingStyleFallback;
  const { _host, _viewport, _content } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const lifecycles: Lifecycle[] = [];
  const instance: LifecycleHub = {
    _options: options,
    _structureSetup: structureSetup,
    _getPadding: () => padding,
    _setPadding(newPadding) {
      padding = newPadding || paddingFallback;
    },
    _getPaddingStyle: () => viewportPaddingStyle,
    _setPaddingStyle(newPaddingStlye: StyleObject) {
      viewportPaddingStyle = newPaddingStlye || viewportPaddingStyleFallback;
    },
  };

  // push(lifecycles, createStructureLifecycle(instance));
  push(lifecycles, createPaddingLifecycle(instance));
  push(lifecycles, createOverflowLifecycle(instance));

  const runLifecycles = (updateHints?: Partial<LifecycleUpdateHints> | null, changedOptions?: OptionsValidated<Options> | null, force?: boolean) => {
    let {
      _directionIsRTL,
      _heightIntrinsic,
      _sizeChanged = force || false,
      _hostMutation = force || false,
      _contentMutation = force || false,
      _paddingStyleChanged = force || false,
    } = updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);
    const checkOption: LifecycleCheckOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });

    each(lifecycles, (lifecycle) => {
      const {
        _sizeChanged: adaptiveSizeChanged,
        _hostMutation: adaptiveHostMutation,
        _contentMutation: adaptiveContentMutation,
        _paddingStyleChanged: adaptivePaddingStyleChanged,
      } =
        lifecycle(
          {
            _directionIsRTL: finalDirectionIsRTL,
            _heightIntrinsic: finalHeightIntrinsic,
            _sizeChanged,
            _hostMutation,
            _contentMutation,
            _paddingStyleChanged,
          },
          checkOption,
          !!force
        ) || {};

      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
      _paddingStyleChanged = adaptivePaddingStyleChanged || _paddingStyleChanged;
    });
  };

  const onSizeChanged = (directionIsRTL?: CacheValues<boolean>) => {
    const sizeChanged = !directionIsRTL;
    runLifecycles({
      _directionIsRTL: directionIsRTL,
      _sizeChanged: sizeChanged,
    });
  };
  const onTrinsicChanged = (heightIntrinsic: CacheValues<boolean>) => {
    runLifecycles({
      _heightIntrinsic: heightIntrinsic,
    });
  };
  const onHostMutation = () => {
    // TODO: rAF only here because IE
    requestAnimationFrame(() => {
      runLifecycles({
        _hostMutation: true,
      });
    });
  };
  const onContentMutation = () => {
    // TODO: rAF only here because IE
    requestAnimationFrame(() => {
      runLifecycles({
        _contentMutation: true,
      });
    });
  };

  const sizeObserver = createSizeObserver(_host, onSizeChanged, { _appear: true, _direction: !_nativeScrollbarStyling });
  const trinsicObserver = createTrinsicObserver(_host, onTrinsicChanged);
  const hostMutationObserver = createDOMObserver(_host, onHostMutation, {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
  });
  const contentMutationObserver = createDOMObserver(_content || _viewport, onContentMutation, {
    _observeContent: true,
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: options!.updating!.elementEvents as [string, string][],
    /*
      _nestedTargetSelector: hostSelector,
      _ignoreContentChange: (mutation, isNestedTarget) => {
        const { target, attributeName } = mutation;
        return isNestedTarget ? false : attributeName ? liesBetween(target as Element, hostSelector, '.content') : false;
      },
      _ignoreTargetAttrChange: (target, attrName, oldValue, newValue) => {
        if (attrName === 'class' && oldValue && newValue) {
          const diff = diffClass(oldValue, newValue);
          const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
          return ignore;
        }
        return false;
      },
      */
  });

  const updateAll = (changedOptions?: OptionsValidated<Options> | null, force?: boolean) => {
    runLifecycles(null, changedOptions, force);
  };
  const envUpdateListener = updateAll.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);

  console.log('flexboxGlue', _flexboxGlue);

  return {
    _update: updateAll,
    _destroy() {
      removeEnvironmentListener(envUpdateListener);
    },
  };
};