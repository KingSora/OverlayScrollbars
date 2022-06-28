import { style } from 'support';
import type { CreateStructureUpdateSegment } from 'setups/structureSetup/structureSetup.update';

/**
 * Lifecycle with the responsibility to adjust the trinsic behavior of the content element.
 * @param structureUpdateHub
 * @returns
 */
export const createTrinsicUpdate: CreateStructureUpdateSegment = (structureSetupElements) => {
  const { _content } = structureSetupElements;

  return (updateHints) => {
    const { _heightIntrinsic } = updateHints;
    const [heightIntrinsic, heightIntrinsicChanged] = _heightIntrinsic;

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
