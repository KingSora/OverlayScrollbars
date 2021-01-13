import { OSTarget, OSTargetObject, CSSDirection } from 'typings';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';
import { Cache, appendChildren, addClass, contents, is, isHTMLElement, createDiv, each, push } from 'support';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { Lifecycle } from 'lifecycles/lifecycleBase';
import { classNameHost, classNamePadding, classNameViewport, classNameContent } from 'classnames';

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

  push(lifecycles, createStructureLifecycle(osTarget));

  // eslint-disable-next-line
  const onSizeChanged = (directionCache?: Cache<CSSDirection>) => {
    if (directionCache) {
      each(lifecycles, (lifecycle) => {
        lifecycle._onDirectionChanged && lifecycle._onDirectionChanged(directionCache);
      });
    } else {
      each(lifecycles, (lifecycle) => {
        lifecycle._onSizeChanged && lifecycle._onSizeChanged();
      });
    }
  };
  const onTrinsicChanged = (widthIntrinsic: boolean, heightIntrinsicCache: Cache<boolean>) => {
    each(lifecycles, (lifecycle) => {
      lifecycle._onTrinsicChanged && lifecycle._onTrinsicChanged(widthIntrinsic, heightIntrinsicCache);
    });
  };

  createSizeObserver(host, onSizeChanged, { _appear: true, _direction: true });
  createTrinsicObserver(host, onTrinsicChanged);
};

export { OverlayScrollbars };
