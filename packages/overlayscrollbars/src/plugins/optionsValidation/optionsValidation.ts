import { OSPlugin } from 'plugins';
import { OSOptions, OverflowBehavior, VisibilityBehavior, AutoHideBehavior } from 'options';
import {
  validateOptions,
  OptionsTemplate,
  OptionsTemplateValue,
  optionsTemplateTypes as oTypes,
} from 'plugins/optionsValidation/validation';
import { PartialOptions } from 'typings';

const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
const booleanAllowedValues: OptionsTemplateValue<boolean> = oTypes.boolean;
const arrayNullValues: OptionsTemplateValue<Array<unknown> | null> = [oTypes.array, oTypes.null];
const overflowAllowedValues: OptionsTemplateValue<OverflowBehavior> =
  'hidden scroll visible visible-hidden';
const scrollbarsVisibilityAllowedValues: OptionsTemplateValue<VisibilityBehavior> =
  'visible hidden auto';
const scrollbarsAutoHideAllowedValues: OptionsTemplateValue<AutoHideBehavior> =
  'never scroll leavemove';

const optionsTemplate: OptionsTemplate<OSOptions> = {
  // resize: resizeAllowedValues, // none || both  || horizontal || vertical || n || b ||
  paddingAbsolute: booleanAllowedValues, // true || false
  updating: {
    elementEvents: arrayNullValues, // array of tuples || null
    attributes: arrayNullValues,
    debounce: [oTypes.number, oTypes.array, oTypes.null], // number || number array || null
  },
  overflow: {
    x: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scrol
    y: overflowAllowedValues, // visible-hidden  || visible-scroll || hidden || scrol
  },
  scrollbars: {
    visibility: scrollbarsVisibilityAllowedValues, // visible || hidden || auto || v ||
    autoHide: scrollbarsAutoHideAllowedValues, // never || scroll || leave || move ||
    autoHideDelay: numberAllowedValues, // number
    dragScroll: booleanAllowedValues, // true || false
    clickScroll: booleanAllowedValues, // true || false
    touch: booleanAllowedValues, // true || false
  },
  /*
  textarea: {
    dynWidth: booleanAllowedValues, // true || false
    dynHeight: booleanAllowedValues, // true || false
    inheritedAttrs: stringArrayNullAllowedValues, // string || array || nul
  },
  */
  nativeScrollbarsOverlaid: {
    show: booleanAllowedValues, // true || false
    initialize: booleanAllowedValues, // true || false
  },
};

export type OptionsValidationPluginInstance = {
  _: (options: PartialOptions<OSOptions>, doWriteErrors?: boolean) => PartialOptions<OSOptions>;
};

export const optionsValidationPluginName = '__osOptionsValidationPlugin';

export const optionsValidationPlugin: OSPlugin<OptionsValidationPluginInstance> = [
  optionsValidationPluginName,
  {
    _: (options: PartialOptions<OSOptions>, doWriteErrors?: boolean) => {
      const [validated, foreign] = validateOptions(optionsTemplate, options, doWriteErrors);
      return { ...foreign, ...validated };
    },
  },
];
