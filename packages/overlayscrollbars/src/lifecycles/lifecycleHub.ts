import { CacheValues, each, push, validateOptions, assignDeep, isEmptyObject, OptionsValidated } from 'support';
import { Options } from 'options';
import { getEnvironment, Environment } from 'environment';
import { StructureSetup } from 'setups/structureSetup';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';
import { createOverflowLifecycle } from 'lifecycles/overflowLifecycle';
import { LifecycleUpdateFunction, LifecycleUpdateHints } from 'lifecycles/lifecycleUpdateFunction';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver } from 'observers/domObserver';

export interface LifecycleHubInstance {
  _update(changedOptions?: OptionsValidated<Options> | null, force?: boolean): void;
  _destroy(): void;
}

export interface LifecycleHub {
  _options: Options;
  _structureSetup: StructureSetup;
}

const attrs = ['id', 'class', 'style', 'open'];
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
  const { _host, _viewport, _content } = structureSetup._targetObj;
  const environment: Environment = getEnvironment();
  const lifecycles: LifecycleUpdateFunction[] = [];
  const instance: LifecycleHub = {
    _options: options,
    _structureSetup: structureSetup,
  };

  // push(lifecycles, createStructureLifecycle(instance));
  push(lifecycles, createOverflowLifecycle(instance));

  const runLifecycles = (updateHints?: Partial<LifecycleUpdateHints> | null, changedOptions?: OptionsValidated<Options> | null, force?: boolean) => {
    let { _directionIsRTL, _heightIntrinsic, _sizeChanged = force || false, _hostMutation = force || false, _contentMutation = force || false } =
      updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);

    each(lifecycles, (lifecycle) => {
      const { _sizeChanged: adaptiveSizeChanged, _hostMutation: adaptiveHostMutation, _contentMutation: adaptiveContentMutation } = lifecycle(
        {
          _directionIsRTL: finalDirectionIsRTL,
          _heightIntrinsic: finalHeightIntrinsic,
          _sizeChanged,
          _hostMutation,
          _contentMutation,
        },
        changedOptions,
        force
      );

      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
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

  const sizeObserver = createSizeObserver(_host, onSizeChanged, { _appear: true, _direction: true });
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
  environment._addListener(envUpdateListener);

  console.log('flexboxglue', environment._flexboxGlue);

  return {
    _update: updateAll,
    _destroy() {
      environment._removeListener(envUpdateListener);
    },
  };
};
