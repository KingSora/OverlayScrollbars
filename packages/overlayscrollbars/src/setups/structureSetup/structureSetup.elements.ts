import {
  isHTMLElement,
  appendChildren,
  createDiv,
  is,
  contents,
  insertAfter,
  addClass,
  parent,
  indexOf,
  removeElements,
  removeClass,
  hasClass,
  push,
  runEachAndClear,
  insertBefore,
  attr,
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
  classNameContent,
  classNameViewportScrollbarStyling,
} from 'classnames';
import { getEnvironment } from 'environment';
import { getPlugins, scrollbarsHidingPluginName } from 'plugins';
import type { ScrollbarsHidingPluginInstance } from 'plugins/scrollbarsHidingPlugin';
import {
  staticInitializationElement as generalStaticInitializationElement,
  dynamicInitializationElement as generalDynamicInitializationElement,
} from 'initialization';
import type { InitializationTarget, InitializationTargetElement } from 'initialization';
import type {
  StructureDynamicInitializationElement,
  StructureInitialization,
  StructureStaticInitializationElement,
} from 'setups/structureSetup/structureSetup.initialization';

export type StructureSetupElements = [
  targetObj: StructureSetupElementsObj,
  appendElements: () => void,
  destroy: () => void
];

export interface StructureSetupElementsObj {
  _target: InitializationTargetElement;
  _host: HTMLElement;
  _viewport: HTMLElement;
  _padding: HTMLElement | false;
  _content: HTMLElement | false;
  _viewportArrange: HTMLStyleElement | false | null | undefined;
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

const createNewDiv = createDiv.bind(0, '');

const unwrap = (elm: HTMLElement | false | null | undefined) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

const addDataAttrHost = (elm: HTMLElement, value: string) => {
  attr(elm, dataAttributeHost, value);
  return removeAttr.bind(0, elm, dataAttributeHost);
};

export const createStructureSetupElements = (
  target: InitializationTarget
): StructureSetupElements => {
  const env = getEnvironment();
  const { _getInitializationStrategy, _nativeScrollbarsHiding } = env;
  const scrollbarsHidingPlugin = getPlugins()[scrollbarsHidingPluginName] as
    | ScrollbarsHidingPluginInstance
    | undefined;
  const createUniqueViewportArrangeElement =
    scrollbarsHidingPlugin && scrollbarsHidingPlugin._createUniqueViewportArrangeElement;
  const {
    _host: hostInitializationStrategy,
    _viewport: viewportInitializationStrategy,
    _padding: paddingInitializationStrategy,
    _content: contentInitializationStrategy,
  } = _getInitializationStrategy();
  const targetIsElm = isHTMLElement(target);
  const targetStructureInitialization = target as StructureInitialization;
  const targetElement = targetIsElm
    ? (target as InitializationTargetElement)
    : targetStructureInitialization.target;
  const isTextarea = is(targetElement, 'textarea');
  const isBody = !isTextarea && is(targetElement, 'body');
  const ownerDocument = targetElement!.ownerDocument;
  const bodyElm = ownerDocument.body as HTMLBodyElement;
  const wnd = ownerDocument.defaultView as Window;
  const singleElmSupport = !!ResizeObserverConstructor && !isTextarea && _nativeScrollbarsHiding;
  const staticInitializationElement =
    generalStaticInitializationElement<StructureStaticInitializationElement>.bind(0, [
      targetElement,
    ]);
  const dynamicInitializationElement =
    generalDynamicInitializationElement<StructureDynamicInitializationElement>.bind(0, [
      targetElement,
    ]);
  const viewportElement = [
    staticInitializationElement(
      createNewDiv,
      viewportInitializationStrategy,
      targetStructureInitialization.viewport
    ),
    staticInitializationElement(createNewDiv, viewportInitializationStrategy),
    staticInitializationElement(createNewDiv),
  ].filter((potentialViewport) =>
    !singleElmSupport ? potentialViewport !== targetElement : true
  )[0];
  const viewportIsTarget = viewportElement === targetElement;
  const evaluatedTargetObj: StructureSetupElementsObj = {
    _target: targetElement,
    _host: isTextarea
      ? staticInitializationElement(
          createNewDiv,
          hostInitializationStrategy,
          targetStructureInitialization.host
        )
      : (targetElement as HTMLElement),
    _viewport: viewportElement,
    _padding:
      !viewportIsTarget &&
      dynamicInitializationElement(
        createNewDiv,
        paddingInitializationStrategy,
        targetStructureInitialization.padding
      ),
    _content:
      !viewportIsTarget &&
      dynamicInitializationElement(
        createNewDiv,
        contentInitializationStrategy,
        targetStructureInitialization.content
      ),
    _viewportArrange:
      !viewportIsTarget &&
      !_nativeScrollbarsHiding &&
      createUniqueViewportArrangeElement &&
      createUniqueViewportArrangeElement(env),
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
  const appendElements = () => {
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

    if (_nativeScrollbarsHiding && !viewportIsTarget) {
      push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
    }
    if (_viewportArrange) {
      insertBefore(_viewport, _viewportArrange);
      push(destroyFns, removeElements.bind(0, _viewportArrange));
    }
  };

  return [evaluatedTargetObj, appendElements, runEachAndClear.bind(0, destroyFns)];
};
