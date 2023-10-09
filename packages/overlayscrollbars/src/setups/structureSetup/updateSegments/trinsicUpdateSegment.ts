import { style } from '~/support';
import { getEnvironment } from '~/environment';
import type { CreateStructureUpdateSegment } from '~/setups/structureSetup/structureSetup.update';

/**
 * Lifecycle with the responsibility to adjust the trinsic behavior of the content element.
 * @param structureUpdateHub
 * @returns
 */
export const createTrinsicUpdateSegment: CreateStructureUpdateSegment = (
  structureSetupElements
) => {
  const { _content } = structureSetupElements;

  return ({ _observersUpdateHints, _observersState }) => {
    const { _flexboxGlue } = getEnvironment();
    const { _heightIntrinsicChanged } = _observersUpdateHints || {};
    const { _heightIntrinsic } = _observersState;
    const heightIntrinsicChanged = (_content || !_flexboxGlue) && _heightIntrinsicChanged;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: _heightIntrinsic ? '' : '100%',
      });
    }
  };
};
