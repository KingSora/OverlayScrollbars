import { style } from 'support';
import type { CreateStructureUpdateSegment } from 'setups/structureSetup/structureSetup.update';

/**
 * Lifecycle with the responsibility to adjust the trinsic behavior of the content element.
 * @param structureUpdateHub
 * @returns
 */
export const createTrinsicUpdate: CreateStructureUpdateSegment = (
  structureSetupElements,
  state
) => {
  const { _content } = structureSetupElements;
  const [getState] = state;

  return (updateHints) => {
    const { _heightIntrinsic } = getState();
    const { _heightIntrinsicChanged } = updateHints;

    if (_heightIntrinsicChanged) {
      style(_content, {
        height: _heightIntrinsic ? '' : '100%',
        display: _heightIntrinsic ? '' : 'inline',
      });
    }

    return {
      _sizeChanged: _heightIntrinsicChanged,
      _contentMutation: _heightIntrinsicChanged,
    };
  };
};
