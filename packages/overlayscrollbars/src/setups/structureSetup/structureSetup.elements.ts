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
} from '~/support';
import {
  dataAttributeHost,
  dataAttributeInitialize,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  dataAttributeViewport,
  dataValueViewportScrollbarHidden,
  dataAttributePadding,
  dataAttributeContent,
  dataValueHostHtmlBody,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import {
  staticInitializationElement as generalStaticInitializationElement,
  dynamicInitializationElement as generalDynamicInitializationElement,
  resolveInitialization as generalResolveInitialization,
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
  _windowElm: Window;
  _documentElm: Document;
  _targetIsElm: boolean;
  _viewportIsTarget: boolean;
  _viewportIsContent: boolean;
  _viewportHasClass: (viewportAttributeClassName: string) => boolean;
  _viewportAddRemoveClass: (viewportAttributeClassName: string, add?: boolean) => void;
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
  const isTextarea = is(targetElement, 'textarea');
  const ownerDocument = targetElement.ownerDocument;
  const docElement = ownerDocument.documentElement;
  const isBody = targetElement === ownerDocument.body;
  const docWnd = ownerDocument.defaultView as Window;
  const getFocusedElement = () => ownerDocument.activeElement;
  const focusElm = (customActiveElm: Element | null) => {
    if (customActiveElm && (customActiveElm as HTMLElement).focus) {
      (customActiveElm as HTMLElement).focus();
    }
  };
  const staticInitializationElement = bind(generalStaticInitializationElement, [targetElement]);
  const dynamicInitializationElement = bind(generalDynamicInitializationElement, [targetElement]);
  const resolveInitialization = bind(generalResolveInitialization, [targetElement]);
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
  // check the default contentElement
  // if truthy (so the element would be present in the DOM) the passed element is the final content element and the viewport element is generated
  // if falsy (so the element wouldn't be present in the DOM) the passed element is the final viewport element and the content element is omitted
  const viewportIsContent = !viewportIsTarget && possibleViewportElement === possibleContentElement;
  const defaultContentElementPresent =
    viewportIsContent && !!resolveInitialization(defaultContentInitialization);
  const viewportIsContentViewport = defaultContentElementPresent
    ? generateViewportElement()
    : possibleViewportElement;
  const viewportIsContentContent = defaultContentElementPresent
    ? possibleContentElement
    : generateContentElement();
  const nonBodyViewportElement = viewportIsContent
    ? viewportIsContentViewport
    : possibleViewportElement;
  const viewportElement = viewportIsTargetBody ? docElement : nonBodyViewportElement;
  const nonBodyHostElement = isTextarea
    ? staticInitializationElement(createNewDiv, defaultHostInitialization, hostInitialization)
    : (targetElement as HTMLElement);
  const hostElement = viewportIsTargetBody ? viewportElement : nonBodyHostElement;
  const contentElement = viewportIsContent ? viewportIsContentContent : possibleContentElement;
  const paddingElement =
    !viewportIsTarget &&
    dynamicInitializationElement(createNewDiv, defaultPaddingInitialization, paddingInitialization);
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
    _windowElm: docWnd,
    _documentElm: ownerDocument,
    _isTextarea: isTextarea,
    _isBody: isBody,
    _targetIsElm: targetIsElm,
    _viewportIsTarget: viewportIsTarget,
    _viewportIsContent: viewportIsContent,
    _viewportHasClass: (viewportAttributeClassName: string) =>
      hasAttrClass(
        viewportElement,
        viewportIsTarget ? dataAttributeHost : dataAttributeViewport,
        viewportAttributeClassName
      ),
    _viewportAddRemoveClass: (viewportAttributeClassName: string, add?: boolean) =>
      addRemoveAttrClass(
        viewportElement,
        viewportIsTarget ? dataAttributeHost : dataAttributeViewport,
        viewportAttributeClassName,
        add
      ),
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

    const undoInitWrapUndwrapFocus = prepareWrapUnwrapFocus(initActiveElm);
    setAttrs(_host, dataAttributeHost, viewportIsTarget ? 'viewport' : 'host');
    setAttrs(_padding, dataAttributePadding, '');
    setAttrs(_content, dataAttributeContent, '');

    if (!viewportIsTarget) {
      setAttrs(_viewport, dataAttributeViewport, '');
      isBody && addAttrClass(docElement, dataAttributeHost, dataValueHostHtmlBody);
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
        removeAttrs(_viewport, [
          dataAttributeHostOverflowX,
          dataAttributeHostOverflowY,
          dataAttributeViewport,
        ]);

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
    if (!viewportIsTarget && docWnd.top === docWnd && initActiveElm === targetElement) {
      const tabIndexStr = 'tabindex';
      const ogTabindex = getAttr(_viewport, tabIndexStr);

      setAttrs(_viewport, tabIndexStr, '-1');
      focusElm(_viewport);

      const revertViewportTabIndex = () =>
        ogTabindex
          ? setAttrs(_viewport, tabIndexStr, ogTabindex)
          : removeAttrs(_viewport, tabIndexStr);
      const off = addEventListener(ownerDocument, 'pointerdown keydown', () => {
        revertViewportTabIndex();
        off();
      });

      push(destroyFns, [revertViewportTabIndex, off]);
    } else {
      focusElm(initActiveElm);
    }

    undoInitWrapUndwrapFocus();

    // @ts-ignore
    targetContents = 0;

    return destroy;
  };

  return [evaluatedTargetObj, appendElements, destroy];
};
