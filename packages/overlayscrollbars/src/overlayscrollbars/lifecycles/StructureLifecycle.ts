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
  createCache,
} from 'support';
import { Lifecycle } from 'overlayscrollbars/lifecycles';
import { getEnvironment, Environment } from 'environment';
import { createSizeObserver } from 'overlayscrollbars/observers/SizeObserver';
import { createTrinsicObserver } from 'overlayscrollbars/observers/TrinsicObserver';

export type OverflowBehavior = 'hidden' | 'scroll' | 'visible-hidden' | 'visible-scroll';
export interface StructureLifecycleOptions {
  _paddingAbsolute?: boolean;
  _overflowBehavior?: {
    x: OverflowBehavior;
    y: OverflowBehavior;
  };
}

interface StructureLifecycleCache {
  padding: TRBL;
}

const classNameHost = 'os-host';
const classNameViewport = 'os-viewport';
const classNameContent = 'os-content';
const classNameViewportScrollbarStyling = `${classNameViewport}-scrollbar-styled`;

const cssMarginEnd = cssProperty('margin-inline-end');
const cssBorderEnd = cssProperty('border-inline-end');

export const createStructureLifecycle = (target: HTMLElement, options?: StructureLifecycleOptions): Lifecycle<StructureLifecycleOptions> => {
  const destructFns: (() => any)[] = [];
  const env: Environment = getEnvironment();
  const scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
  const supportsScrollbarStyling = env._nativeScrollbarStyling;
  const supportFlexboxGlue = env._flexboxGlue;
  // direction change is only needed to update scrollbar hiding, therefore its not needed if css can do it, scrollbars are invisible or overlaid on y axis
  const directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;

  const viewportElm = createDOM(`<div class="${classNameViewport} ${classNameViewportScrollbarStyling}"></div>`)[0];
  const contentElm = createDOM(`<div class="${classNameContent}"></div>`)[0];

  const updateCache = createCache<StructureLifecycleCache>({
    padding: [() => topRightBottomLeft(target, 'padding'), equalTRBL],
  });

  const onSizeChanged = (direction?: 'ltr' | 'rtl') => {
    updateCache('padding');
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsic: boolean) => {
    console.log('heightAuot', heightIntrinsic);
  };

  appendChildren(viewportElm, contentElm);
  appendChildren(contentElm, contents(target));
  appendChildren(target, viewportElm);
  addClass(target, classNameHost);

  destructFns.push(createSizeObserver(target, onSizeChanged, { _appear: true, _direction: !directionObserverObsolete }));
  destructFns.push(createTrinsicObserver(target, onTrinsicChanged));

  return {
    _options() {
      // eslint-disable-next-line
      console.log('_options');
    },
    _destruct() {
      runEach(destructFns);
      removeElements(viewportElm);
    },
  };
};
