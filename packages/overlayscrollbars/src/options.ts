import { OptionsTemplate, OptionsTemplateValue, OptionsAndOptionsTemplateValue, OptionsAndOptionsTemplate, Func } from "core/typings";
import { optionsTemplateTypes as oTypes, transform } from "core/options";
import { OverlayScrollbars } from "typings";

const classNameAllowedValues: OptionsTemplateValue<string | null> = [oTypes.string, oTypes.null];
const numberAllowedValues: OptionsTemplateValue<number> = oTypes.number;
const booleanNullAllowedValues: OptionsTemplateValue<boolean | null> = [oTypes.boolean, oTypes.null];
const stringArrayNullAllowedValues: OptionsTemplateValue<string | Array<string> | null> = [oTypes.string, oTypes.array, oTypes.null];
const booleanTrueTemplate: OptionsAndOptionsTemplateValue<boolean> = [true, oTypes.boolean];
const booleanFalseTemplate: OptionsAndOptionsTemplateValue<boolean> = [false, oTypes.boolean];
const callbackTemplate: OptionsAndOptionsTemplateValue<Func | null> = [null, [oTypes.function, oTypes.null]];
const resizeAllowedValues: OptionsTemplateValue<OverlayScrollbars.ResizeBehavior> = 'none both horizontal vertical';
const overflowBehaviorAllowedValues: OptionsTemplateValue<OverlayScrollbars.OverflowBehavior> = 'visible-hidden visible-scroll scroll hidden';
const scrollbarsVisibilityAllowedValues: OptionsTemplateValue<OverlayScrollbars.VisibilityBehavior> = 'visible hidden auto';
const scrollbarsAutoHideAllowedValues: OptionsTemplateValue<OverlayScrollbars.AutoHideBehavior> = 'never scroll leavemove';

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
const defaultOptionsWithTemplate: OptionsAndOptionsTemplate<Required<OverlayScrollbars.Options>> = {
    className: ['os-theme-dark', classNameAllowedValues],                   //null || string
    resize: ['none', resizeAllowedValues],                                  //none || both  || horizontal || vertical || n || b || h || v
    sizeAutoCapable: booleanTrueTemplate,                                   //true || false
    clipAlways: booleanTrueTemplate,                                        //true || false
    normalizeRTL: booleanTrueTemplate,                                      //true || false
    paddingAbsolute: booleanFalseTemplate,                                  //true || false
    autoUpdate: [null, booleanNullAllowedValues],                           //true || false || null
    autoUpdateInterval: [33, numberAllowedValues],                          //number
    updateOnLoad: [['img'], stringArrayNullAllowedValues],                  //string || array || null
    nativeScrollbarsOverlaid: {
        showNativeScrollbars: booleanFalseTemplate,                         //true || false
        initialize: booleanFalseTemplate                                    //true || false
    },
    overflowBehavior: {
        x: ['scroll', overflowBehaviorAllowedValues],                       //visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
        y: ['scroll', overflowBehaviorAllowedValues]                        //visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
    },
    scrollbars: {
        visibility: ['auto', scrollbarsVisibilityAllowedValues],            //visible || hidden || auto || v || h || a
        autoHide: ['never', scrollbarsAutoHideAllowedValues],               //never || scroll || leave || move || n || s || l || m
        autoHideDelay: [800, numberAllowedValues],                          //number
        dragScrolling: booleanTrueTemplate,                                 //true || false
        clickScrolling: booleanFalseTemplate,                               //true || false
        touchSupport: booleanTrueTemplate,                                  //true || false
        snapHandle: booleanFalseTemplate                                    //true || false
    },
    textarea: {
        dynWidth: booleanFalseTemplate,                                     //true || false
        dynHeight: booleanFalseTemplate,                                    //true || false
        inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues], //string || array || null
    },
    callbacks: {
        onInitialized: callbackTemplate,                                    //null || function
        onInitializationWithdrawn: callbackTemplate,                        //null || function
        onDestroyed: callbackTemplate,                                      //null || function
        onScrollStart: callbackTemplate,                                    //null || function
        onScroll: callbackTemplate,                                         //null || function
        onScrollStop: callbackTemplate,                                     //null || function
        onOverflowChanged: callbackTemplate,                                //null || function
        onOverflowAmountChanged: callbackTemplate,                          //null || function
        onDirectionChanged: callbackTemplate,                               //null || function
        onContentSizeChanged: callbackTemplate,                             //null || function
        onHostSizeChanged: callbackTemplate,                                //null || function
        onUpdated: callbackTemplate                                         //null || function
    }
}

export const optionsTemplate: OptionsTemplate<Required<OverlayScrollbars.Options>> = transform(defaultOptionsWithTemplate, true);
export const defaultOptions: OverlayScrollbars.Options = transform(defaultOptionsWithTemplate);

