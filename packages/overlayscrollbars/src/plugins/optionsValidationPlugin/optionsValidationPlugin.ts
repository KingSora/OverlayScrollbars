import type {
  Options,
  PartialOptions,
  OverflowBehavior,
  ScrollbarsVisibilityBehavior,
  ScrollbarsAutoHideBehavior,
  ScrollbarsClickScrollBehavior,
} from '../../options';
import type { OptionsTemplate, OptionsTemplateValue } from './validation';
import type { StaticPlugin } from '../plugins';
import { validateOptions, optionsTemplateTypes as oTypes } from './validation';

export const optionsValidationPluginModuleName = '__osOptionsValidationPlugin';

export const OptionsValidationPlugin = /* @__PURE__ */ (() => ({
  [optionsValidationPluginModuleName]: {
    static: () => {
      const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
      const booleanAllowedValues: OptionsTemplateValue<boolean> = oTypes.boolean;
      const arrayNullValues: OptionsTemplateValue<Array<unknown> | null> = [
        oTypes.array,
        oTypes.null,
      ];
      const overflowAllowedValues: OptionsTemplateValue<OverflowBehavior> =
        'hidden scroll visible visible-hidden';
      const scrollbarsVisibilityAllowedValues: OptionsTemplateValue<ScrollbarsVisibilityBehavior> =
        'visible hidden auto';
      const scrollbarsAutoHideAllowedValues: OptionsTemplateValue<ScrollbarsAutoHideBehavior> =
        'never scroll leavemove';
      const scrollbarsClickScrollAllowedValues: OptionsTemplateValue<ScrollbarsClickScrollBehavior> =
        [booleanAllowedValues, oTypes.string];

      const optionsTemplate: OptionsTemplate<Options> = {
        paddingAbsolute: booleanAllowedValues, // true || false
        showNativeOverlaidScrollbars: booleanAllowedValues, // true || false
        update: {
          elementEvents: arrayNullValues, // array of tuples || null
          attributes: arrayNullValues,
          debounce: [oTypes.number, oTypes.array, oTypes.null], // number || number array || null
          ignoreMutation: [oTypes.function, oTypes.null], // function || null
        },
        overflow: {
          x: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scroll
          y: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scroll
        },
        scrollbars: {
          theme: [oTypes.string, oTypes.null], // string || null
          visibility: scrollbarsVisibilityAllowedValues, // visible || hidden || auto
          autoHide: scrollbarsAutoHideAllowedValues, // never || scroll || leave || move ||
          autoHideDelay: numberAllowedValues, // number
          autoHideSuspend: booleanAllowedValues, // true || false
          dragScroll: booleanAllowedValues, // true || false
          clickScroll: scrollbarsClickScrollAllowedValues, // true || false || instant
          pointers: [oTypes.array, oTypes.null], // string array
        },
        /*
        textarea: {
          dynWidth: booleanAllowedValues, // true || false
          dynHeight: booleanAllowedValues, // true || false
          inheritedAttrs: stringArrayNullAllowedValues, // string || array || nul
        },
        */
      };
      return (options: PartialOptions, doWriteErrors?: boolean): PartialOptions => {
        const [validated, foreign] = validateOptions(optionsTemplate, options, doWriteErrors);
        return { ...foreign, ...validated };
      };
    },
  },
}))() satisfies StaticPlugin<typeof optionsValidationPluginModuleName>;
