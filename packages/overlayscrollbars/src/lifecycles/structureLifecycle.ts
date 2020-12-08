import {
  cssProperty,
  createDOM,
  runEach,
  contents,
  appendChildren,
  removeElements,
  addClass,
  topRightBottomLeft,
  TRBL,
  equalTRBL,
  optionsTemplateTypes as oTypes,
  OptionsTemplateValue,
} from 'support';
import { createLifecycleBase, Lifecycle } from 'lifecycles/lifecycleBase';
import { getEnvironment, Environment } from 'environment';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';

export type OverflowBehavior = 'hidden' | 'scroll' | 'visible-hidden' | 'visible-scroll';
export interface StructureLifecycleOptions {
  paddingAbsolute: boolean;
  overflowBehavior?: {
    x?: OverflowBehavior;
    y?: OverflowBehavior;
  };
}
interface StructureLifecycleCache {
  padding: TRBL;
}

const overflowBehaviorAllowedValues: OptionsTemplateValue<OverflowBehavior> = 'visible-hidden visible-scroll scroll hidden';

const classNameHost = 'os-host';
const classNameViewport = 'os-viewport';
const classNameContent = 'os-content';
const classNameViewportScrollbarStyling = `${classNameViewport}-scrollbar-styled`;

const cssMarginEnd = cssProperty('margin-inline-end');
const cssBorderEnd = cssProperty('border-inline-end');

export const createStructureLifecycle = (target: HTMLElement, initialOptions?: StructureLifecycleOptions): Lifecycle<StructureLifecycleOptions> => {
  const destructFns: (() => any)[] = [];
  const env: Environment = getEnvironment();
  const scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
  const supportsScrollbarStyling = env._nativeScrollbarStyling;
  const supportFlexboxGlue = env._flexboxGlue;
  // direction change is only needed to update scrollbar hiding, therefore its not needed if css can do it, scrollbars are invisible or overlaid on y axis
  const directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;

  const viewportElm = createDOM(`<div class="${classNameViewport} ${classNameViewportScrollbarStyling}"></div>`)[0];
  const contentElm = createDOM(`<div class="${classNameContent}"></div>`)[0];

  const { _options, _update, _cacheChange } = createLifecycleBase<StructureLifecycleOptions, StructureLifecycleCache>(
    {
      paddingAbsolute: [false, oTypes.boolean],
      overflowBehavior: {
        x: ['scroll', overflowBehaviorAllowedValues],
        y: ['scroll', overflowBehaviorAllowedValues],
      },
    },
    {
      padding: [() => topRightBottomLeft(target, 'padding'), equalTRBL],
    },
    initialOptions,
    (changedOptions, changedCache) => {
      console.log(changedOptions); // eslint-disable-line
      console.log(changedCache); // eslint-disable-line
    }
  );

  // eslint-disable-next-line
  const onSizeChanged = (direction?: 'ltr' | 'rtl') => {
    _cacheChange('padding');
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsic: boolean) => {
    console.log('heightAuot', heightIntrinsic); // eslint-disable-line
  };

  appendChildren(viewportElm, contentElm);
  appendChildren(contentElm, contents(target));
  appendChildren(target, viewportElm);
  addClass(target, classNameHost);

  destructFns.push(createSizeObserver(target, onSizeChanged, { _appear: true, _direction: !directionObserverObsolete }));
  destructFns.push(createTrinsicObserver(target, onTrinsicChanged));

  return {
    _options,
    _update,
    _destruct() {
      runEach(destructFns);
      removeElements(viewportElm);
    },
  };
};
