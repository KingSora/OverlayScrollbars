import { OSTarget, OSTargetObject } from 'typings';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';
import { Cache, each, push } from 'support';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver } from 'observers/domObserver';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { Lifecycle } from 'lifecycles/lifecycleBase';

const OverlayScrollbars = (target: OSTarget | OSTargetObject, options?: any, extensions?: any): void => {
  const structureSetup: StructureSetup = createStructureSetup(target);
  const lifecycles: Lifecycle<any>[] = [];
  const { _host, _viewport, _content } = structureSetup._targetObj;

  push(lifecycles, createStructureLifecycle(structureSetup._targetObj));

  // eslint-disable-next-line
  const onSizeChanged = (directionCache?: Cache<boolean>) => {
    if (directionCache) {
      each(lifecycles, (lifecycle) => {
        lifecycle._onDirectionChanged && lifecycle._onDirectionChanged(directionCache);
      });
    } else {
      each(lifecycles, (lifecycle) => {
        lifecycle._onSizeChanged && lifecycle._onSizeChanged();
      });
    }
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsicCache: Cache<boolean>) => {
    each(lifecycles, (lifecycle) => {
      lifecycle._onTrinsicChanged && lifecycle._onTrinsicChanged(widthIntrinsic, heightIntrinsicCache);
    });
  };

  createSizeObserver(_host, onSizeChanged, { _appear: true, _direction: true });
  createTrinsicObserver(_host, onTrinsicChanged);
  createDOMObserver(_host, () => {
    return null;
  });
  createDOMObserver(
    _content || _viewport,
    () => {
      return null;
    },
    { _observeContent: true }
  );
};

export { OverlayScrollbars };
