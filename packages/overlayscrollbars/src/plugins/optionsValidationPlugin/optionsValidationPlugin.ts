import {
  Options,
  OverflowBehavior,
  ScrollbarVisibilityBehavior,
  ScrollbarAutoHideBehavior,
} from 'options';
import {
  validateOptions,
  OptionsTemplate,
  OptionsTemplateValue,
  optionsTemplateTypes as oTypes,
} from 'plugins/optionsValidationPlugin/validation';
import type { DeepPartial } from 'typings';
import type { Plugin } from 'plugins';

const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
const booleanAllowedValues: OptionsTemplateValue<boolean> = oTypes.boolean;
const arrayNullValues: OptionsTemplateValue<Array<unknown> | null> = [oTypes.array, oTypes.null];
const overflowAllowedValues: OptionsTemplateValue<OverflowBehavior> =
  'hidden scroll visible visible-hidden';
const scrollbarsVisibilityAllowedValues: OptionsTemplateValue<ScrollbarVisibilityBehavior> =
  'visible hidden auto';
const scrollbarsAutoHideAllowedValues: OptionsTemplateValue<ScrollbarAutoHideBehavior> =
  'never scroll leavemove';

const optionsTemplate: OptionsTemplate<Options> = {
  // resize: resizeAllowedValues, // none || both  || horizontal || vertical || n || b ||
  paddingAbsolute: booleanAllowedValues, // true || false
  showNativeOverlaidScrollbars: booleanAllowedValues, // true || false
  update: {
    elementEvents: arrayNullValues, // array of tuples || null
    attributes: arrayNullValues,
    debounce: [oTypes.number, oTypes.array, oTypes.null], // number || number array || null
    ignoreMutation: [oTypes.function, oTypes.null], // function || null
  },
  overflow: {
    x: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scrol
    y: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scrol
  },
  scrollbars: {
    theme: [oTypes.string, oTypes.null], // string || null
    visibility: scrollbarsVisibilityAllowedValues, // visible || hidden || auto || v ||
    autoHide: scrollbarsAutoHideAllowedValues, // never || scroll || leave || move ||
    autoHideDelay: numberAllowedValues, // number
    dragScroll: booleanAllowedValues, // true || false
    clickScroll: booleanAllowedValues, // true || false
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

export type OptionsValidationPluginInstance = {
  _: (options: DeepPartial<Options>, doWriteErrors?: boolean) => DeepPartial<Options>;
};

export const optionsValidationPluginName = '__osOptionsValidationPlugin';

export const optionsValidationPlugin: Plugin<OptionsValidationPluginInstance> =
  /* @__PURE__ */ (() => ({
    [optionsValidationPluginName]: {
      _: (options: DeepPartial<Options>, doWriteErrors?: boolean) => {
        const [validated, foreign] = validateOptions(optionsTemplate, options, doWriteErrors);
        return { ...foreign, ...validated };
      },
    },
  }))();
