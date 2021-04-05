import {
  isHTMLElement,
  appendChildren,
  is,
  createDiv,
  contents,
  insertAfter,
  addClass,
  parent,
  isUndefined,
  removeElements,
  removeClass,
  push,
  runEach,
  insertBefore,
  attr,
  isBoolean,
} from 'support';
import {
  classNameHost,
  classNamePadding,
  classNameViewport,
  classNameViewportArrange,
  classNameContent,
  classNameViewportScrollbarStyling,
} from 'classnames';
import { getEnvironment } from 'environment';
import { OSTarget, OSTargetObject, OSTargetElement } from 'typings';

export interface OSTargetContext {
  _isTextarea: boolean;
  _isBody: boolean;
  _htmlElm: HTMLHtmlElement;
  _bodyElm: HTMLBodyElement;
  _windowElm: Window;
  _documentElm: HTMLDocument;
}

export interface PreparedOSTargetObject {
  _target: OSTargetElement;
  _host: HTMLElement;
  _viewport: HTMLElement;
  _padding: HTMLElement | false | null;
  _content: HTMLElement | false | null;
  _viewportArrange: HTMLStyleElement | false | null;
}

export interface StructureSetup {
  _targetObj: PreparedOSTargetObject;
  _targetCtx: OSTargetContext;
  _destroy: () => void;
}

const unwrap = (elm: HTMLElement | false | null | undefined) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

let contentArrangeCounter = 0;
const createUniqueViewportArrangeElement = (): HTMLStyleElement => {
  const elm = document.createElement('style');

  attr(elm, 'id', `${classNameViewportArrange}-${contentArrangeCounter}`);
  contentArrangeCounter++;

  return elm;
};
const evaluateCreationFromStrategy = (initializationValue: HTMLElement | boolean | undefined, strategy: boolean): HTMLElement | false | undefined => {
  const isBooleanValue = isBoolean(initializationValue);
  if (isBooleanValue || isUndefined(initializationValue)) {
    return (isBooleanValue ? initializationValue : strategy) && undefined;
  }
  return initializationValue as HTMLElement;
};

export const createStructureSetup = (target: OSTarget | OSTargetObject): StructureSetup => {
  const { _getInitializationStrategy, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid, _cssCustomProperties } = getEnvironment();
  const { _padding: paddingNeeded, _content: contentNeeded } = _getInitializationStrategy();
  const targetIsElm = isHTMLElement(target);
  const osTargetObj: Partial<PreparedOSTargetObject> = targetIsElm
    ? ({} as Partial<PreparedOSTargetObject>)
    : {
        _host: (target as OSTargetObject).host,
        _target: (target as OSTargetObject).target,
        _viewport: (target as OSTargetObject).viewport,
        _padding: evaluateCreationFromStrategy((target as OSTargetObject).padding, paddingNeeded),
        _content: evaluateCreationFromStrategy((target as OSTargetObject).content, contentNeeded),
      };

  if (targetIsElm) {
    const viewport = createDiv(classNameViewport);
    const padding = paddingNeeded && createDiv(classNamePadding);
    const content = contentNeeded && createDiv(classNameContent);

    osTargetObj._target = target as OSTargetElement;
    osTargetObj._padding = padding;
    osTargetObj._viewport = viewport;
    osTargetObj._content = content;
  }

  let { _target, _padding, _viewport, _content } = osTargetObj;
  const destroyFns: (() => any)[] = [];
  const isTextarea = is(_target, 'textarea');
  const isBody = !isTextarea && is(_target, 'body');
  const _host = (isTextarea ? osTargetObj._host || createDiv() : _target) as HTMLElement;
  const getTargetContents = (contentSlot: HTMLElement) => (isTextarea ? (_target as HTMLTextAreaElement) : contents(contentSlot as HTMLElement));
  const isTextareaHostGenerated = isTextarea && _host !== osTargetObj._host;

  // only insert host for textarea after target if it was generated
  if (isTextareaHostGenerated) {
    insertAfter(_target, _host);

    push(destroyFns, () => {
      insertAfter(_host, _target);
      removeElements(_host);
    });
  }

  if (targetIsElm) {
    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, getTargetContents(_target!));
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);

    push(destroyFns, () => {
      appendChildren(_host, contents(contentSlot));
      removeElements(_padding || _viewport);
      removeClass(_host, classNameHost);
    });
  } else {
    const contentContainingElm = _content || _viewport || _padding || _host;
    const createPadding = isUndefined(_padding);
    const createViewport = isUndefined(_viewport);
    const createContent = isUndefined(_content);
    const targetContents = getTargetContents(contentContainingElm);

    _padding = osTargetObj._padding = createPadding ? createDiv() : _padding;
    _viewport = osTargetObj._viewport = createViewport ? createDiv() : _viewport;
    _content = osTargetObj._content = createContent ? createDiv() : _content;

    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);

    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, targetContents);

    push(destroyFns, () => {
      if (createContent) {
        unwrap(_content);
      }
      if (createViewport) {
        unwrap(_viewport);
      }
      if (createPadding) {
        unwrap(_padding);
      }
      removeClass(_host, classNameHost);
      removeClass(_padding, classNamePadding);
      removeClass(_viewport, classNameViewport);
      removeClass(_content, classNameContent);
    });
  }

  addClass(_host, classNameHost);
  addClass(_padding, classNamePadding);
  addClass(_viewport, classNameViewport);
  addClass(_content, classNameContent);

  const ownerDocument: HTMLDocument = _target!.ownerDocument;
  const bodyElm = ownerDocument.body as HTMLBodyElement;
  const wnd = ownerDocument.defaultView as Window;
  const ctx: OSTargetContext = {
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _htmlElm: parent(bodyElm) as HTMLHtmlElement,
    _bodyElm: bodyElm,
    _isTextarea: isTextarea,
    _isBody: isBody,
  };
  // @ts-ignore
  const obj: PreparedOSTargetObject = {
    ...osTargetObj,
    _host,
  };

  if (_nativeScrollbarStyling) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  } else if (!_cssCustomProperties && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y)) {
    const viewportArrangeElm = createUniqueViewportArrangeElement();

    insertBefore(_viewport, viewportArrangeElm);
    push(destroyFns, removeElements.bind(0, viewportArrangeElm));

    obj._viewportArrange = viewportArrangeElm;
  }

  return {
    _targetObj: obj,
    _targetCtx: ctx,
    _destroy: () => {
      runEach(destroyFns);
    },
  };
};
