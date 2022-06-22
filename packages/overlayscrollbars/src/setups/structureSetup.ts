import {
  isHTMLElement,
  appendChildren,
  is,
  createDiv,
  contents,
  insertAfter,
  addClass,
  parent,
  indexOf,
  removeElements,
  removeClass,
  push,
  runEach,
  insertBefore,
  attr,
  isBoolean,
  isFunction,
  keys,
} from 'support';
import {
  classNameHost,
  classNamePadding,
  classNameViewport,
  classNameViewportArrange,
  classNameContent,
  classNameViewportScrollbarStyling,
} from 'classnames';
import {
  getEnvironment,
  StructureInitializationStaticElement,
  StructureInitializationDynamicElement,
  StructureInitializationStrategy,
} from 'environment';
import { OSTarget, OSTargetElement, StructureInitialization } from 'typings';

export interface OSTargetContext {
  _isTextarea: boolean;
  _isBody: boolean;
  _htmlElm: HTMLHtmlElement;
  _bodyElm: HTMLBodyElement;
  _windowElm: Window;
  _documentElm: HTMLDocument;
  _targetIsElm: boolean;
}

export interface PreparedOSTargetObject {
  _target: OSTargetElement;
  _host: HTMLElement;
  _viewport: HTMLElement;
  _padding: HTMLElement | false;
  _content: HTMLElement | false;
  _viewportArrange: HTMLStyleElement | false;
}

export interface StructureSetup {
  _targetObj: PreparedOSTargetObject;
  _targetCtx: OSTargetContext;
  _destroy: () => void;
}

let contentArrangeCounter = 0;

const unwrap = (elm: HTMLElement | false | null | undefined) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

const createUniqueViewportArrangeElement = (): HTMLStyleElement | false => {
  const { _nativeScrollbarStyling, _nativeScrollbarIsOverlaid, _cssCustomProperties } =
    getEnvironment();
  /* istanbul ignore next */
  const create =
    !_cssCustomProperties &&
    !_nativeScrollbarStyling &&
    (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const result = create ? document.createElement('style') : false;

  if (result) {
    attr(result, 'id', `${classNameViewportArrange}-${contentArrangeCounter}`);
    contentArrangeCounter++;
  }

  return result;
};

const staticCreationFromStrategy = (
  target: OSTargetElement,
  initializationValue: HTMLElement | undefined,
  strategy: StructureInitializationStaticElement,
  elementClass: string
): HTMLElement => {
  const result =
    initializationValue || (isFunction(strategy) ? strategy(target) : (strategy as null));
  return result || createDiv(elementClass);
};

const dynamicCreationFromStrategy = (
  target: OSTargetElement,
  initializationValue: HTMLElement | boolean | undefined,
  strategy: StructureInitializationDynamicElement,
  elementClass: string,
  defaultValue: boolean
): HTMLElement | false => {
  const takeInitializationValue = isBoolean(initializationValue) || initializationValue;
  const result = takeInitializationValue
    ? (initializationValue as boolean | HTMLElement)
    : isFunction(strategy)
    ? strategy(target)
    : strategy;

  if (result === null) {
    return defaultValue ? createDiv(elementClass) : false;
  }

  return result === true ? createDiv(elementClass) : result;
};

export const createStructureSetup = (
  target: OSTarget | StructureInitialization
): StructureSetup => {
  const { _getInitializationStrategy, _nativeScrollbarStyling } = getEnvironment();
  const {
    _host: hostInitializationStrategy,
    _viewport: viewportInitializationStrategy,
    _padding: paddingInitializationStrategy,
    _content: contentInitializationStrategy,
  } = _getInitializationStrategy() as StructureInitializationStrategy;
  const targetIsElm = isHTMLElement(target);
  const targetStructureInitialization = target as StructureInitialization;
  const targetElement = targetIsElm
    ? (target as OSTargetElement)
    : targetStructureInitialization.target;
  const isTextarea = is(targetElement, 'textarea');
  const isBody = !isTextarea && is(targetElement, 'body');
  const ownerDocument: HTMLDocument = targetElement!.ownerDocument;
  const bodyElm = ownerDocument.body as HTMLBodyElement;
  const wnd = ownerDocument.defaultView as Window;
  const evaluatedTargetObj: PreparedOSTargetObject = {
    _target: targetElement,
    _host: isTextarea
      ? staticCreationFromStrategy(
          targetElement,
          targetStructureInitialization.host,
          hostInitializationStrategy,
          classNameHost
        )
      : (targetElement as HTMLElement),
    _viewport: staticCreationFromStrategy(
      targetElement,
      targetStructureInitialization.viewport,
      viewportInitializationStrategy,
      classNameViewport
    ),
    _padding: dynamicCreationFromStrategy(
      targetElement,
      targetStructureInitialization.padding,
      paddingInitializationStrategy,
      classNamePadding,
      !_nativeScrollbarStyling // default value for padding
    ),
    _content: dynamicCreationFromStrategy(
      targetElement,
      targetStructureInitialization.content,
      contentInitializationStrategy,
      classNameContent,
      false // default value for content
    ),
    _viewportArrange: createUniqueViewportArrangeElement(),
  };
  const ctx: OSTargetContext = {
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _htmlElm: parent(bodyElm) as HTMLHtmlElement,
    _bodyElm: bodyElm,
    _isTextarea: isTextarea,
    _isBody: isBody,
    _targetIsElm: targetIsElm,
  };
  const generatedElements = keys(evaluatedTargetObj).reduce((arr, key: string) => {
    const value = evaluatedTargetObj[key];
    return push(arr, value && !parent(value) ? value : false);
  }, [] as HTMLElement[]);
  const elementIsGenerated = (elm: HTMLElement | false) =>
    elm ? indexOf(generatedElements, elm) > -1 : null;
  const { _target, _host, _padding, _viewport, _content, _viewportArrange } = evaluatedTargetObj;
  const destroyFns: (() => any)[] = [];
  const isTextareaHostGenerated = isTextarea && elementIsGenerated(_host);
  const targetContents = isTextarea
    ? _target
    : contents(
        [_content, _viewport, _padding, _host, _target].find(
          (elm) => elementIsGenerated(elm) === false
        )
      );
  const contentSlot = _content || _viewport;

  // only insert host for textarea after target if it was generated
  if (isTextareaHostGenerated) {
    insertAfter(_target, _host);

    push(destroyFns, () => {
      insertAfter(_host, _target);
      removeElements(_host);
    });
  }

  appendChildren(contentSlot, targetContents);
  appendChildren(_host, _padding);
  appendChildren(_padding || _host, _viewport);
  appendChildren(_viewport, _content);

  addClass(_host, classNameHost);
  addClass(_padding, classNamePadding);
  addClass(_viewport, classNameViewport);
  addClass(_content, classNameContent);

  push(destroyFns, () => {
    if (targetIsElm) {
      appendChildren(_host, contents(contentSlot));
      removeElements(_padding || _viewport);
      removeClass(_host, classNameHost);
    } else {
      if (elementIsGenerated(_content)) {
        unwrap(_content);
      }
      if (elementIsGenerated(_viewport)) {
        unwrap(_viewport);
      }
      if (elementIsGenerated(_padding)) {
        unwrap(_padding);
      }
      removeClass(_host, classNameHost);
      removeClass(_padding, classNamePadding);
      removeClass(_viewport, classNameViewport);
      removeClass(_content, classNameContent);
    }
  });

  if (_nativeScrollbarStyling) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  }
  if (_viewportArrange) {
    insertBefore(_viewport, _viewportArrange);
    push(destroyFns, removeElements.bind(0, _viewportArrange));
  }

  return {
    _targetObj: evaluatedTargetObj,
    _targetCtx: ctx,
    _destroy: () => {
      runEach(destroyFns);
    },
  };
};
