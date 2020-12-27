import { OSTarget, OSTargetObject } from 'typings';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';
import { appendChildren, addClass, contents, is, isHTMLElement, createDiv, each } from 'support';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { Lifecycle } from 'lifecycles/lifecycleBase';

const classNameHost = 'os-host';
const classNamePadding = 'os-padding';
const classNameViewport = 'os-viewport';
const classNameContent = 'os-content';

const normalizeTarget = (target: OSTarget): OSTargetObject => {
  if (isHTMLElement(target)) {
    const isTextarea = is(target, 'textarea');
    const host = (isTextarea ? createDiv() : target) as HTMLElement;
    const padding = createDiv(classNamePadding);
    const viewport = createDiv(classNameViewport);
    const content = createDiv(classNameContent);

    appendChildren(padding, viewport);
    appendChildren(viewport, content);
    appendChildren(content, contents(target));
    appendChildren(target, padding);
    addClass(host, classNameHost);

    return {
      target,
      host,
      padding,
      viewport,
      content,
    };
  }

  const { host, padding, viewport, content } = target;

  addClass(host, classNameHost);
  addClass(padding, classNamePadding);
  addClass(viewport, classNameViewport);
  addClass(content, classNameContent);

  return target;
};

const OverlayScrollbars = (target: OSTarget, options?: any, extensions?: any): void => {
  const osTarget: OSTargetObject = normalizeTarget(target);
  const lifecycles: Lifecycle<any>[] = [];
  const { host } = osTarget;

  lifecycles.push(createStructureLifecycle(osTarget));

  // eslint-disable-next-line
  const onSizeChanged = (direction?: 'ltr' | 'rtl') => {
    if (direction) {
      each(lifecycles, (lifecycle) => {
        lifecycle._onDirectionChanged && lifecycle._onDirectionChanged(direction);
      });
    } else {
      each(lifecycles, (lifecycle) => {
        lifecycle._onSizeChanged && lifecycle._onSizeChanged();
      });
    }
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsic: boolean) => {
    each(lifecycles, (lifecycle) => {
      lifecycle._onTrinsicChanged && lifecycle._onTrinsicChanged(widthIntrinsic, heightIntrinsic);
    });
  };

  createSizeObserver(host, onSizeChanged, { _appear: true, _direction: true });
  createTrinsicObserver(host, onTrinsicChanged);
};

export { OverlayScrollbars };
