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
  noop,
  on,
} from 'support';
import {
  dataAttributeHost,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  classNamePadding,
  classNameViewport,
  classNameContent,
  classNameViewportScrollbarHidden,
} from 'classnames';
import { getEnvironment } from 'environment';
import { getPlugins, scrollbarsHidingPluginName } from 'plugins';
import type { ScrollbarsHidingPluginInstance } from 'plugins/scrollbarsHidingPlugin';
import {
  staticInitializationElement as generalStaticInitializationElement,
  dynamicInitializationElement as generalDynamicInitializationElement,
} from 'initialization';
import type {
  Initialization,
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from 'initialization';

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
  _scrollOffsetElement: HTMLElement;
  _scrollEventElement: HTMLElement | Document;
  // ctx ----
  _isTextarea: boolean;
  _isBody: boolean;
  _windowElm: Window;
  _documentElm: Document;
  _targetIsElm: boolean;
  _viewportIsTarget: boolean;
  _viewportHasClass: (className: string, attributeClassName: string) => boolean;
  _viewportAddRemoveClass: (className: string, attributeClassName: string, add?: boolean) => void;
}

const tabIndexStr = 'tabindex';
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
  const { _getDefaultInitialization, _nativeScrollbarsHiding } = env;
  const scrollbarsHidingPlugin = getPlugins()[scrollbarsHidingPluginName] as
    | ScrollbarsHidingPluginInstance
    | undefined;
  const createUniqueViewportArrangeElement =
    scrollbarsHidingPlugin && scrollbarsHidingPlugin._createUniqueViewportArrangeElement;
  const { elements: defaultInitElements } = _getDefaultInitialization();
  const {
    host: defaultHostInitialization,
    viewport: defaultViewportInitialization,
    padding: defaultPaddingInitialization,
    content: defaultContentInitialization,
  } = defaultInitElements;
  const targetIsElm = isHTMLElement(target);
  const targetStructureInitialization = (targetIsElm ? {} : target) as InitializationTargetObject;
  const { elements: initElements } = targetStructureInitialization;
  const {
    host: hostInitialization,
    padding: paddingInitialization,
    viewport: viewportInitialization,
    content: contentInitialization,
  } = initElements || {};

  const targetElement = targetIsElm ? target : targetStructureInitialization.target;
  const isTextarea = is(targetElement, 'textarea');
  const ownerDocument = targetElement.ownerDocument;
  const isBody = targetElement === ownerDocument.body;
  const wnd = ownerDocument.defaultView as Window;
  const staticInitializationElement = generalStaticInitializationElement<
    Initialization['elements']['viewport']
  >.bind(0, [targetElement]);
  const dynamicInitializationElement = generalDynamicInitializationElement<
    Initialization['elements']['content']
  >.bind(0, [targetElement]);
  const viewportElement = staticInitializationElement(
    createNewDiv,
    defaultViewportInitialization,
    viewportInitialization
  );
  const viewportIsTarget = viewportElement === targetElement;
  const viewportIsTargetBody = viewportIsTarget && isBody;
  const activeElm = ownerDocument.activeElement;
  const setViewportFocus = !viewportIsTarget && wnd.top === wnd && activeElm === targetElement;
  const evaluatedTargetObj: StructureSetupElementsObj = {
    _target: targetElement,
    _host: isTextarea
      ? staticInitializationElement(createNewDiv, defaultHostInitialization, hostInitialization)
      : (targetElement as HTMLElement),
    _viewport: viewportElement,
    _padding:
      !viewportIsTarget &&
      dynamicInitializationElement(
        createNewDiv,
        defaultPaddingInitialization,
        paddingInitialization
      ),
    _content:
      !viewportIsTarget &&
      dynamicInitializationElement(
        createNewDiv,
        defaultContentInitialization,
        contentInitialization
      ),
    _viewportArrange:
      !viewportIsTarget &&
      !_nativeScrollbarsHiding &&
      createUniqueViewportArrangeElement &&
      createUniqueViewportArrangeElement(env),
    _scrollOffsetElement: viewportIsTargetBody ? ownerDocument.documentElement : viewportElement,
    _scrollEventElement: viewportIsTargetBody ? ownerDocument : viewportElement,
    _windowElm: wnd,
    _documentElm: ownerDocument,
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
  let targetContents = isTextarea
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
    const removeHtmlClass = isBody
      ? addClass(parent(targetElement), classNameViewportScrollbarHidden)
      : noop;

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
      removeHtmlClass();
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
      push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarHidden));
    }
    if (_viewportArrange) {
      insertBefore(_viewport, _viewportArrange);
      push(destroyFns, removeElements.bind(0, _viewportArrange));
    }
    if (setViewportFocus) {
      const ogTabindex = attr(_viewport, tabIndexStr);

      attr(_viewport, tabIndexStr, '-1');
      _viewport.focus();

      const off = on(ownerDocument, 'pointerdown keydown', () => {
        ogTabindex ? attr(_viewport, tabIndexStr, ogTabindex) : removeAttr(_viewport, tabIndexStr);
        off();
      });
    } else if (activeElm && (activeElm as HTMLElement).focus) {
      (activeElm as HTMLElement).focus();
    }

    // @ts-ignore
    targetContents = 0;
  };

  return [evaluatedTargetObj, appendElements, runEachAndClear.bind(0, destroyFns)];
};
