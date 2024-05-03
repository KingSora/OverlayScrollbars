import {
  isHTMLElement,
  appendChildren,
  createDiv,
  is,
  contents,
  insertAfter,
  parent,
  removeElements,
  push,
  runEachAndClear,
  removeAttrs,
  hasAttrClass,
  addEventListener,
  bind,
  inArray,
  addAttrClass,
  addRemoveAttrClass,
  setAttrs,
  getAttr,
  noop,
  stopPropagation,
  isBodyElement,
  getFocusedElement,
  wnd,
} from '~/support';
import {
  dataAttributeHost,
  dataAttributeInitialize,
  dataAttributeViewport,
  dataValueViewportScrollbarHidden,
  dataAttributePadding,
  dataAttributeContent,
  dataAttributeHtmlBody,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import {
  staticInitializationElement as generalStaticInitializationElement,
  dynamicInitializationElement as generalDynamicInitializationElement,
} from '~/initialization';
import type {
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from '~/initialization';

export type StructureSetupElements = [
  elements: StructureSetupElementsObj,
  appendElements: () => () => void,
  canceled: () => void
];

export interface StructureSetupElementsObj {
  _target: InitializationTargetElement;
  _host: HTMLElement;
  _viewport: HTMLElement;
  _padding: HTMLElement | false;
  _content: HTMLElement | false;
  _scrollOffsetElement: HTMLElement;
  _scrollEventElement: HTMLElement | Document;
  _originalScrollOffsetElement: HTMLElement;
  // ctx ----
  _isTextarea: boolean;
  _isBody: boolean;
  _documentElm: Document;
  _targetIsElm: boolean;
  _viewportIsTarget: boolean;
  _windowElm: () => Window;
  _viewportHasClass: (viewportAttributeClassName: string) => boolean;
  _viewportAddRemoveClass: (viewportAttributeClassName: string, add?: boolean) => () => void;
}

export const createStructureSetupElements = (
  target: InitializationTarget
): StructureSetupElements => {
  const env = getEnvironment();
  const { _getDefaultInitialization, _nativeScrollbarsHiding } = env;
  const { elements: defaultInitElements } = _getDefaultInitialization();
  const {
    host: defaultHostInitialization,
    padding: defaultPaddingInitialization,
    viewport: defaultViewportInitialization,
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
  const isBody = isBodyElement(targetElement);
  const isTextarea = is(targetElement, 'textarea');
  const ownerDocument = targetElement.ownerDocument;
  const docElement = ownerDocument.documentElement;
  const getDocumentWindow = () => ownerDocument.defaultView || wnd;
  const focusElm = (customActiveElm: Element | null) => {
    if (customActiveElm && (customActiveElm as HTMLElement).focus) {
      (customActiveElm as HTMLElement).focus({ preventScroll: true });
    }
  };
  const staticInitializationElement = bind(generalStaticInitializationElement, [targetElement]);
  const dynamicInitializationElement = bind(generalDynamicInitializationElement, [targetElement]);
  const createNewDiv = bind(createDiv, '');
  const generateViewportElement = bind(
    staticInitializationElement,
    createNewDiv,
    defaultViewportInitialization
  );
  const generateContentElement = bind(
    dynamicInitializationElement,
    createNewDiv,
    defaultContentInitialization
  );
  const possibleViewportElement = generateViewportElement(viewportInitialization);
  const viewportIsTarget = possibleViewportElement === targetElement;
  const viewportIsTargetBody = viewportIsTarget && isBody;
  const possibleContentElement = !viewportIsTarget && generateContentElement(contentInitialization);
  // edge case if passed viewportElement is contentElement:
  // viewport element has higher priority and content element will not be generated
  // will act the same way as initialization: `{ elements: { viewport, content: false } }`
  const viewportIsContent = !viewportIsTarget && possibleViewportElement === possibleContentElement;
  const viewportElement = viewportIsTargetBody ? docElement : possibleViewportElement;
  const nonBodyHostElement = isTextarea
    ? staticInitializationElement(createNewDiv, defaultHostInitialization, hostInitialization)
    : (targetElement as HTMLElement);
  const hostElement = viewportIsTargetBody ? viewportElement : nonBodyHostElement;
  const paddingElement =
    !viewportIsTarget &&
    dynamicInitializationElement(createNewDiv, defaultPaddingInitialization, paddingInitialization);
  const contentElement = !viewportIsContent && possibleContentElement;
  const generatedElements = [contentElement, viewportElement, paddingElement, hostElement].map(
    (elm) => isHTMLElement(elm) && !parent(elm) && elm
  );
  const elementIsGenerated = (elm: HTMLElement | false) => elm && inArray(generatedElements, elm);
  const originalNonBodyScrollOffsetElement = elementIsGenerated(viewportElement)
    ? targetElement
    : viewportElement;

  const evaluatedTargetObj: StructureSetupElementsObj = {
    _target: targetElement,
    _host: hostElement,
    _viewport: viewportElement,
    _padding: paddingElement,
    _content: contentElement,
    _scrollOffsetElement: viewportIsTargetBody ? docElement : viewportElement,
    _scrollEventElement: viewportIsTargetBody ? ownerDocument : viewportElement,
    _originalScrollOffsetElement: isBody ? docElement : originalNonBodyScrollOffsetElement,
    _documentElm: ownerDocument,
    _isTextarea: isTextarea,
    _isBody: isBody,
    _targetIsElm: targetIsElm,
    _viewportIsTarget: viewportIsTarget,
    _windowElm: getDocumentWindow,
    _viewportHasClass: (viewportAttributeClassName: string) =>
      hasAttrClass(viewportElement, dataAttributeViewport, viewportAttributeClassName),
    _viewportAddRemoveClass: (viewportAttributeClassName: string, add?: boolean) =>
      addRemoveAttrClass(viewportElement, dataAttributeViewport, viewportAttributeClassName, add),
  };
  const { _target, _host, _padding, _viewport, _content } = evaluatedTargetObj;
  const destroyFns: (() => any)[] = [
    () => {
      // always remove dataAttributeHost & dataAttributeInitialize from host and from <html> element if target is body
      removeAttrs(_host, [dataAttributeHost, dataAttributeInitialize]);
      removeAttrs(_target, dataAttributeInitialize);
      if (isBody) {
        removeAttrs(docElement, [dataAttributeInitialize, dataAttributeHost]);
      }
    },
  ];
  const isTextareaHostGenerated = isTextarea && elementIsGenerated(_host);
  let targetContents = isTextarea
    ? _target
    : contents(
        [_content, _viewport, _padding, _host, _target].find(
          (elm) => elm && !elementIsGenerated(elm)
        )
      );
  const contentSlot = viewportIsTargetBody ? _target : _content || _viewport;
  const destroy = bind(runEachAndClear, destroyFns);
  const appendElements = () => {
    const docWnd = getDocumentWindow();
    const initActiveElm = getFocusedElement();
    const unwrap = (elm: HTMLElement | false | null | undefined) => {
      appendChildren(parent(elm), contents(elm));
      removeElements(elm);
    };
    // wrapping / unwrapping will cause the focused element to blur, this should prevent those events to surface
    const prepareWrapUnwrapFocus = (activeElement?: Element | null) =>
      activeElement
        ? addEventListener(
            activeElement,
            'focusin focusout focus blur',
            (event) => {
              stopPropagation(event);
              event.stopImmediatePropagation();
            },
            {
              _capture: true,
              _passive: false,
            }
          )
        : noop;
    const tabIndexStr = 'tabindex';
    const ogTabindex = getAttr(_viewport, tabIndexStr);
    const undoInitWrapUndwrapFocus = prepareWrapUnwrapFocus(initActiveElm);
    setAttrs(_host, dataAttributeHost, '');
    setAttrs(_padding, dataAttributePadding, '');
    setAttrs(_viewport, dataAttributeViewport, '');
    setAttrs(_content, dataAttributeContent, '');

    if (!viewportIsTarget) {
      setAttrs(_viewport, tabIndexStr, ogTabindex || '-1');
      isBody && setAttrs(docElement, dataAttributeHtmlBody, '');
    }

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

    push(destroyFns, [
      undoInitWrapUndwrapFocus,
      () => {
        const destroyActiveElm = getFocusedElement();
        const undoDestroyWrapUndwrapFocus = prepareWrapUnwrapFocus(destroyActiveElm);
        removeAttrs(_padding, dataAttributePadding);
        removeAttrs(_content, dataAttributeContent);
        removeAttrs(_viewport, dataAttributeViewport);
        isBody && removeAttrs(docElement, dataAttributeHtmlBody);
        ogTabindex
          ? setAttrs(_viewport, tabIndexStr, ogTabindex)
          : removeAttrs(_viewport, tabIndexStr);

        elementIsGenerated(_content) && unwrap(_content);
        elementIsGenerated(_viewport) && unwrap(_viewport);
        elementIsGenerated(_padding) && unwrap(_padding);
        focusElm(destroyActiveElm);
        undoDestroyWrapUndwrapFocus();
      },
    ]);

    if (_nativeScrollbarsHiding && !viewportIsTarget) {
      addAttrClass(_viewport, dataAttributeViewport, dataValueViewportScrollbarHidden);
      push(destroyFns, bind(removeAttrs, _viewport, dataAttributeViewport));
    }

    // focus viewport if previously focused element was target, otherwise focus previously focused element
    focusElm(
      !viewportIsTarget && initActiveElm === targetElement && docWnd.top === docWnd
        ? _viewport
        : initActiveElm
    );
    undoInitWrapUndwrapFocus();

    // @ts-ignore
    targetContents = 0;

    return destroy;
  };

  return [evaluatedTargetObj, appendElements, destroy];
};
