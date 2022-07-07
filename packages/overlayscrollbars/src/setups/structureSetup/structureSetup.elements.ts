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
  hasClass,
  push,
  runEach,
  insertBefore,
  attr,
  isBoolean,
  isFunction,
  keys,
  removeAttr,
  attrClass,
  hasAttrClass,
  ResizeObserverConstructor,
} from 'support';
import {
  dataAttributeHost,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  classNamePadding,
  classNameViewport,
  classNameViewportArrange,
  classNameContent,
  classNameViewportScrollbarStyling,
} from 'classnames';
import {
  getEnvironment,
  StructureInitializationStrategyStaticElement,
  StructureInitializationStrategyDynamicElement,
} from 'environment';
import { OSTarget, OSTargetElement, StructureInitialization } from 'typings';

export type StructureSetupElements = [targetObj: StructureSetupElementsObj, destroy: () => void];

export interface StructureSetupElementsObj {
  _target: OSTargetElement;
  _host: HTMLElement;
  _viewport: HTMLElement;
  _padding: HTMLElement | false;
  _content: HTMLElement | false;
  _viewportArrange: HTMLStyleElement | false;
  // ctx ----
  _isTextarea: boolean;
  _isBody: boolean;
  _htmlElm: HTMLHtmlElement;
  _bodyElm: HTMLBodyElement;
  _windowElm: Window;
  _documentElm: Document;
  _targetIsElm: boolean;
  _viewportIsTarget: boolean;
  _viewportHasClass: (className: string, attributeClassName: string) => boolean;
  _viewportAddRemoveClass: (className: string, attributeClassName: string, add?: boolean) => void;
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
  initializationValue?: HTMLElement | undefined,
  strategy?: StructureInitializationStrategyStaticElement
): HTMLElement => {
  const result =
    initializationValue ||
    (isFunction(strategy) ? strategy(target) : (strategy as null | undefined));
  return result || createDiv();
};

const dynamicCreationFromStrategy = (
  target: OSTargetElement,
  initializationValue: HTMLElement | boolean | undefined,
  strategy: StructureInitializationStrategyDynamicElement
): HTMLElement | false => {
  const takeInitializationValue = isBoolean(initializationValue) || initializationValue;
  const result = takeInitializationValue
    ? (initializationValue as boolean | HTMLElement)
    : isFunction(strategy)
    ? strategy(target)
    : strategy;

  return result === true ? createDiv() : result;
};

const addDataAttrHost = (elm: HTMLElement, value?: string | false | null | undefined) => {
  attr(elm, dataAttributeHost, value || '');
  return removeAttr.bind(0, elm, dataAttributeHost);
};

export const createStructureSetupElements = (target: OSTarget): StructureSetupElements => {
  const { _getInitializationStrategy, _nativeScrollbarStyling } = getEnvironment();
  const {
    _host: hostInitializationStrategy,
    _viewport: viewportInitializationStrategy,
    _padding: paddingInitializationStrategy,
    _content: contentInitializationStrategy,
  } = _getInitializationStrategy();
  const targetIsElm = isHTMLElement(target);
  const targetStructureInitialization = target as StructureInitialization;
  const targetElement = targetIsElm
    ? (target as OSTargetElement)
    : targetStructureInitialization.target;
  const isTextarea = is(targetElement, 'textarea');
  const isBody = !isTextarea && is(targetElement, 'body');
  const ownerDocument = targetElement!.ownerDocument;
  const bodyElm = ownerDocument.body as HTMLBodyElement;
  const wnd = ownerDocument.defaultView as Window;
  const singleElmSupport = !!ResizeObserverConstructor && _nativeScrollbarStyling;
  const potentialViewportElement = staticCreationFromStrategy(
    targetElement,
    targetStructureInitialization.viewport,
    viewportInitializationStrategy
  );
  const potentiallySingleElm = potentialViewportElement === targetElement;
  const viewportIsTarget = singleElmSupport && potentiallySingleElm;
  const viewportElement =
    potentiallySingleElm && !viewportIsTarget
      ? staticCreationFromStrategy(targetElement)
      : potentialViewportElement;
  const evaluatedTargetObj: StructureSetupElementsObj = {
    _target: targetElement,
    _host: isTextarea
      ? staticCreationFromStrategy(
          targetElement,
          targetStructureInitialization.host,
          hostInitializationStrategy
        )
      : (targetElement as HTMLElement),
    _viewport: viewportElement,
    _padding: dynamicCreationFromStrategy(
      targetElement,
      targetStructureInitialization.padding,
      paddingInitializationStrategy
    ),
    _content: dynamicCreationFromStrategy(
      targetElement,
      targetStructureInitialization.content,
      contentInitializationStrategy
    ),
    _viewportArrange: !viewportIsTarget && createUniqueViewportArrangeElement(),
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _htmlElm: parent(bodyElm) as HTMLHtmlElement,
    _bodyElm: bodyElm,
    _isTextarea: isTextarea,
    _isBody: isBody,
    _targetIsElm: targetIsElm,
    _viewportIsTarget: viewportIsTarget,
    _viewportHasClass: (className: string, attributeClassName: string) =>
      viewportIsTarget
        ? hasAttrClass(viewportElement, dataAttributeHost, attributeClassName)
        : hasClass(viewportElement, className),
    _viewportAddRemoveClass: (className: string, attributeClassName: string, add?: boolean) =>
      viewportIsTarget
        ? attrClass(viewportElement, dataAttributeHost, attributeClassName, add)
        : (add ? addClass : removeClass)(viewportElement, className),
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
  const removeHostDataAttr = addDataAttrHost(_host, viewportIsTarget ? 'viewport' : 'host');
  const removePaddingClass = addClass(_padding, classNamePadding);
  const removeViewportClass = addClass(_viewport, !viewportIsTarget && classNameViewport);
  const removeContentClass = addClass(_content, classNameContent);

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
  appendChildren(_padding || _host, !viewportIsTarget && _viewport);
  appendChildren(_viewport, _content);

  push(destroyFns, () => {
    removeHostDataAttr();
    removeAttr(_viewport, dataAttributeHostOverflowX);
    removeAttr(_viewport, dataAttributeHostOverflowY);

    if (elementIsGenerated(_content)) {
      unwrap(_content);
    }
    if (elementIsGenerated(_viewport)) {
      unwrap(_viewport);
    }
    if (elementIsGenerated(_padding)) {
      unwrap(_padding);
    }
    removePaddingClass();
    removeViewportClass();
    removeContentClass();
  });

  if (_nativeScrollbarStyling && !viewportIsTarget) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  }
  if (_viewportArrange) {
    insertBefore(_viewport, _viewportArrange);
    push(destroyFns, removeElements.bind(0, _viewportArrange));
  }

  return [evaluatedTargetObj, runEach.bind(0, destroyFns)];
};
