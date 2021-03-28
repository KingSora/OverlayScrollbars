import {
  optionsTemplateTypes as oTypes,
  transformOptions,
  OptionsTemplateValue,
  OptionsWithOptionsTemplateValue,
  OptionsWithOptionsTemplate,
  Func,
} from 'support/options';
import { ResizeBehavior, OverflowBehavior, VisibilityBehavior, AutoHideBehavior, Options } from 'options';

const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
const stringArrayNullAllowedValues: OptionsTemplateValue<string | ReadonlyArray<string> | null> = [oTypes.string, oTypes.array, oTypes.null];
const booleanTrueTemplate: OptionsWithOptionsTemplateValue<boolean> = [true, oTypes.boolean];
const booleanFalseTemplate: OptionsWithOptionsTemplateValue<boolean> = [false, oTypes.boolean];
// const callbackTemplate: OptionsWithOptionsTemplateValue<Func | null> = [null, [oTypes.function, oTypes.null]];
const resizeAllowedValues: OptionsTemplateValue<ResizeBehavior> = 'none both horizontal vertical';
const overflowAllowedValues: OptionsTemplateValue<OverflowBehavior> = 'visible-hidden visible-scroll scroll hidden';
const scrollbarsVisibilityAllowedValues: OptionsTemplateValue<VisibilityBehavior> = 'visible hidden auto';
const scrollbarsAutoHideAllowedValues: OptionsTemplateValue<AutoHideBehavior> = 'never scroll leavemove';

/**
 * A object which serves as "default options object" and "options template object".
 * I combined these two into one object so that I don't have to define two separate big objects, instead I define one big object.
 *
 * The property value is a tuple:
 * the first value is the default value
 * the second value is the template value
 * Example:
 * {
 *  a: ['default', [Type.string, Type.null]],
 *  b: [250, Type.number]
 * }
 * Property "a" has a default value of 'default' and it can be a string or null
 * Property "b" has a default value of 250 and it can be number
 */
const defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<Options>> = {
  resize: ['none', resizeAllowedValues], // none || both  || horizontal || vertical || n || b || h || v
  paddingAbsolute: booleanFalseTemplate, // true || false
  updating: {
    elementEvents: [[['img', 'load']], [oTypes.array, oTypes.null]], // array of tuples || null
    contentMutationDebounce: [80, numberAllowedValues], // number
    hostMutationDebounce: [0, numberAllowedValues], // number
    resizeDebounce: [0, numberAllowedValues], // number
  },
  overflow: {
    x: ['scroll', overflowAllowedValues], // visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
    y: ['scroll', overflowAllowedValues], // visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
  },
  scrollbars: {
    visibility: ['auto', scrollbarsVisibilityAllowedValues], // visible || hidden || auto || v || h || a
    autoHide: ['never', scrollbarsAutoHideAllowedValues], // never || scroll || leave || move || n || s || l || m
    autoHideDelay: [800, numberAllowedValues], // number
    dragScroll: booleanTrueTemplate, // true || false
    clickScroll: booleanFalseTemplate, // true || false
    touch: booleanTrueTemplate, // true || false
  },
  textarea: {
    dynWidth: booleanFalseTemplate, // true || false
    dynHeight: booleanFalseTemplate, // true || false
    inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues], // string || array || null
  },
  nativeScrollbarsOverlaid: {
    show: booleanFalseTemplate, // true || false
    initialize: booleanFalseTemplate, // true || false
  },
  /*
  callbacks: {
    onInitialized: callbackTemplate, // null || function
    onInitializationWithdrawn: callbackTemplate, // null || function
    onDestroyed: callbackTemplate, // null || function
    onScrollStart: callbackTemplate, // null || function
    onScroll: callbackTemplate, // null || function
    onScrollStop: callbackTemplate, // null || function
    onOverflowChanged: callbackTemplate, // null || function
    onOverflowAmountChanged: callbackTemplate, // null || function
    onDirectionChanged: callbackTemplate, // null || function
    onContentSizeChanged: callbackTemplate, // null || function
    onHostSizeChanged: callbackTemplate, // null || function
    onUpdated: callbackTemplate, // null || function
  },
  */
};

export const { _template: optionsTemplate, _options: defaultOptions } = transformOptions(defaultOptionsWithTemplate);
