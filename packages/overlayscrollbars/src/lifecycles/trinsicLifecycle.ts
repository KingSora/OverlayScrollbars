import { style } from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';

export const createTrinsicLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup } = lifecycleHub;
  const { _content } = _structureSetup._targetObj;

  return (updateHints) => {
    const { _heightIntrinsic } = updateHints;
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: heightIntrinsic ? 'auto' : '100%',
      });
    }
  };
};
