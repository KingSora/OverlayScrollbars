import { cssProperty, runEach, topRightBottomLeft, TRBL, equalTRBL, optionsTemplateTypes as oTypes, OptionsTemplateValue, style } from 'support';
import { OSTargetObject } from 'typings';
import { createLifecycleBase, Lifecycle } from 'lifecycles/lifecycleBase';
import { getEnvironment, Environment } from 'environment';

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

export const createStructureLifecycle = (
  target: OSTargetObject,
  initialOptions?: StructureLifecycleOptions
): Lifecycle<StructureLifecycleOptions> => {
  const { host, padding: paddingElm, viewport, content } = target;
  const destructFns: (() => any)[] = [];
  const env: Environment = getEnvironment();
  const scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
  const supportsScrollbarStyling = env._nativeScrollbarStyling;
  const supportFlexboxGlue = env._flexboxGlue;
  // direction change is only needed to update scrollbar hiding, therefore its not needed if css can do it, scrollbars are invisible or overlaid on y axis
  const directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;

  const { _options, _update, _updateCache } = createLifecycleBase<StructureLifecycleOptions, StructureLifecycleCache>(
    {
      paddingAbsolute: [false, oTypes.boolean],
      overflowBehavior: {
        x: ['scroll', overflowBehaviorAllowedValues],
        y: ['scroll', overflowBehaviorAllowedValues],
      },
    },
    {
      padding: [() => topRightBottomLeft(host, 'padding'), equalTRBL],
    },
    initialOptions,
    (options, cache) => {
      const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = options.paddingAbsolute;
      const { _value: padding, _changed: paddingChanged } = cache.padding;

      if (paddingAbsoluteChanged || paddingChanged) {
        const paddingStyle: TRBL = {
          t: 0,
          r: 0,
          b: 0,
          l: 0,
        };

        if (!paddingAbsolute) {
          paddingStyle.t = -padding!.t;
          paddingStyle.r = -(padding!.r + padding!.l);
          paddingStyle.b = -(padding!.b + padding!.t);
          paddingStyle.l = -padding!.l;
        }

        if (!supportsScrollbarStyling) {
          paddingStyle.r -= env._nativeScrollbarSize.y;
          paddingStyle.b -= env._nativeScrollbarSize.x;
        }

        style(paddingElm, { top: paddingStyle.t, left: paddingStyle.l, 'margin-right': paddingStyle.r, 'margin-bottom': paddingStyle.b });
      }

      console.log(options); // eslint-disable-line
      console.log(cache); // eslint-disable-line
    }
  );

  const onSizeChanged = () => {
    _updateCache('padding');
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsic: boolean) => {
    if (heightIntrinsic) {
      style(content, { height: 'auto' });
    } else {
      style(content, { height: '100%' });
    }
  };

  return {
    _options,
    _update,
    _onSizeChanged: onSizeChanged,
    _onTrinsicChanged: onTrinsicChanged,
    _destruct() {
      runEach(destructFns);
    },
  };
};
