import { style } from '~/support';
import { getEnvironment } from '~/environment';
import type { CreateStructureUpdateSegment } from '~/setups/structureSetup/structureSetup.update';

/**
 * Lifecycle with the responsibility to adjust the trinsic behavior of the content element.
 * @param structureUpdateHub
 * @returns
 */
export const createTrinsicUpdateSegment: CreateStructureUpdateSegment = (
  structureSetupElements,
  state
) => {
  const { _content } = structureSetupElements;
  const [getState] = state;

  return (updateHints) => {
    const { _flexboxGlue } = getEnvironment();
    const { _heightIntrinsic } = getState();
    const { _heightIntrinsicChanged } = updateHints;
    const heightIntrinsicChanged = (_content || !_flexboxGlue) && _heightIntrinsicChanged;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: _heightIntrinsic ? '' : '100%',
      });
    }

    return {
      _sizeChanged: heightIntrinsicChanged,
      _contentMutation: heightIntrinsicChanged,
    };
  };
};
