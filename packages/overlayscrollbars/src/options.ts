import {
  optionsTemplateTypes as oTypes,
  transformOptions,
  OptionsTemplateValue,
  OptionsWithOptionsTemplateValue,
  OptionsWithOptionsTemplate,
} from 'support/options';

export type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical';

export type OverflowBehavior = 'hidden' | 'scroll' | 'visible' | 'visible-hidden';

export type VisibilityBehavior = 'visible' | 'hidden' | 'auto';

export type AutoHideBehavior = 'never' | 'scroll' | 'leave' | 'move';

export type ScrollBehavior = 'always' | 'ifneeded' | 'never';

export type BasicEventCallback = (this: any) => void;

export type ScrollEventCallback = (this: any, args?: UIEvent) => void;

export type OverflowChangedCallback = (this: any, args?: OverflowChangedArgs) => void;

export type OverflowAmountChangedCallback = (this: any, args?: OverflowAmountChangedArgs) => void;

export type DirectionChangedCallback = (this: any, args?: DirectionChangedArgs) => void;

export type SizeChangedCallback = (this: any, args?: SizeChangedArgs) => void;

export type UpdatedCallback = (this: any, args?: UpdatedArgs) => void;

export interface OSOptions {
  resize: ResizeBehavior;
  paddingAbsolute: boolean;
  updating: {
    elementEvents: Array<[string, string, boolean?]> | null;
    attributes: string[] | null;
    debounce: number | [number, number] | null;
  };
  overflow: {
    x: OverflowBehavior;
    y: OverflowBehavior;
  };
  scrollbars: {
    visibility: VisibilityBehavior;
    autoHide: AutoHideBehavior;
    autoHideDelay: number;
    dragScroll: boolean;
    clickScroll: boolean;
    touch: boolean;
  };
  textarea: {
    dynWidth: boolean;
    dynHeight: boolean;
    inheritedAttrs: string | Array<string> | null;
  };
  nativeScrollbarsOverlaid: {
    show: boolean;
    initialize: boolean;
  };
  callbacks: {
    onUpdated: (() => any) | null;
  };
  /*
  callbacks?: {
    onInitialized?: BasicEventCallback | null;
    onInitializationWithdrawn?: BasicEventCallback | null;
    onDestroyed?: BasicEventCallback | null;
    onScrollStart?: ScrollEventCallback | null;
    onScroll?: ScrollEventCallback | null;
    onScrollStop?: ScrollEventCallback | null;
    onOverflowChanged?: OverflowChangedCallback | null;
    onOverflowAmountChanged?: OverflowAmountChangedCallback | null;
    onDirectionChanged?: DirectionChangedCallback | null;
    onContentSizeChanged?: SizeChangedCallback | null;
    onHostSizeChanged?: SizeChangedCallback | null;
    onUpdated?: UpdatedCallback | null;
  };
  */
}

export interface OverflowChangedArgs {
  x: boolean;
  y: boolean;
  xScrollable: boolean;
  yScrollable: boolean;
  clipped: boolean;
}

export interface OverflowAmountChangedArgs {
  x: number;
  y: number;
}

export interface DirectionChangedArgs {
  isRTL: number;
  dir: string;
}

export interface SizeChangedArgs {
  width: number;
  height: number;
}

export interface UpdatedArgs {
  forced: boolean;
}

const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
const arrayNullValues: OptionsTemplateValue<Array<unknown> | null> = [oTypes.array, oTypes.null];
const stringArrayNullAllowedValues: OptionsTemplateValue<string | ReadonlyArray<string> | null> = [oTypes.string, oTypes.array, oTypes.null];
const booleanTrueTemplate: OptionsWithOptionsTemplateValue<boolean> = [true, oTypes.boolean];
const booleanFalseTemplate: OptionsWithOptionsTemplateValue<boolean> = [false, oTypes.boolean];
// const callbackTemplate: OptionsWithOptionsTemplateValue<Func | null> = [null, [oTypes.function, oTypes.null]];
const resizeAllowedValues: OptionsTemplateValue<ResizeBehavior> = 'none both horizontal vertical';
const overflowAllowedValues: OptionsTemplateValue<OverflowBehavior> = 'hidden scroll visible visible-hidden';
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
const defaultOptionsWithTemplate: OptionsWithOptionsTemplate<OSOptions> = {
  resize: ['none', resizeAllowedValues], // none || both  || horizontal || vertical || n || b || h || v
  paddingAbsolute: booleanFalseTemplate, // true || false
  updating: {
    elementEvents: [[['img', 'load', true]], arrayNullValues], // array of tuples || null
    attributes: [null, arrayNullValues],
    debounce: [
      [0, 33],
      [oTypes.number, oTypes.array, oTypes.null],
    ], // number || number array || null
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
  callbacks: {
    onUpdated: [null, [oTypes.function, oTypes.null]],
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
