import { style } from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';

/**
 * Lifecycle with the responsibility to adjust the trinsic behavior of the content element.
 * @param lifecycleHub
 * @returns
 */
export const createTrinsicLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup } = lifecycleHub;
  const { _content } = _structureSetup._targetObj;

  return (updateHints) => {
    const { _heightIntrinsic } = updateHints;
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: heightIntrinsic ? '' : '100%',
        display: heightIntrinsic ? '' : 'inline',
      });
    }

    return {
      _sizeChanged: heightIntrinsicChanged,
      _contentMutation: heightIntrinsicChanged,
    };
  };
};
