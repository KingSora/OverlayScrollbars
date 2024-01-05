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
  insertBefore,
  attr,
  keys,
  removeAttr,
  hasAttrClass,
  addEventListener,
  bind,
  inArray,
  addAttrClass,
  addRemoveAttrClass,
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
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '~/plugins';
import {
  staticInitializationElement as generalStaticInitializationElement,
  dynamicInitializationElement as generalDynamicInitializationElement,
  resolveInitialization as generalResolveInitialization,
} from '~/initialization';
import type { ScrollbarsHidingPlugin } from '~/plugins';
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
  _viewportIsContent: boolean;
  _viewportHasClass: (viewportAttributeClassName: string) => boolean;
  _viewportAddRemoveClass: (viewportAttributeClassName: string, add?: boolean) => void;
}

export const createStructureSetupElements = (
  target: InitializationTarget
): StructureSetupElements => {
  const env = getEnvironment();
  const { _getDefaultInitialization, _nativeScrollbarsHiding } = env;
  const scrollbarsHidingPlugin = getStaticPluginModuleInstance<typeof ScrollbarsHidingPlugin>(
    scrollbarsHidingPluginName
  );
  const createUniqueViewportArrangeElement =
    scrollbarsHidingPlugin && scrollbarsHidingPlugin._createUniqueViewportArrangeElement;
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
  const viewportIsContent =
    !viewportIsTarget &&
    isHTMLElement(possibleViewportElement) &&
    possibleViewportElement === possibleContentElement;
  const defaultContentElementPresent =
    viewportIsContent && !!resolveInitialization(defaultContentInitialization);
  const viewportIstContentViewport = defaultContentElementPresent
    ? generateViewportElement()
    : possibleViewportElement;
  const viewportIsContentContent = defaultContentElementPresent
    ? possibleContentElement
    : generateContentElement();
  const nonBodyViewportElement = viewportIsContent
    ? viewportIstContentViewport
    : possibleViewportElement;
  const viewportElement = viewportIsTargetBody ? docElement : nonBodyViewportElement;
  const nonBodyHostElement = isTextarea
    ? staticInitializationElement(createNewDiv, defaultHostInitialization, hostInitialization)
    : (targetElement as HTMLElement);
  const hostElement = viewportIsTargetBody ? viewportElement : nonBodyHostElement;
  const contentElement = viewportIsContent ? viewportIsContentContent : possibleContentElement;
  const activeElm = ownerDocument.activeElement;
  const setViewportFocus =
    !viewportIsTarget && docWnd.top === docWnd && activeElm === targetElement;

  const evaluatedTargetObj: StructureSetupElementsObj = {
    _target: targetElement,
    _host: hostElement,
    _viewport: viewportElement,
    _padding:
      !viewportIsTarget &&
      dynamicInitializationElement(
        createNewDiv,
        defaultPaddingInitialization,
        paddingInitialization
      ),
    _content: contentElement,
    _viewportArrange:
      !viewportIsTarget &&
      !_nativeScrollbarsHiding &&
      createUniqueViewportArrangeElement &&
      createUniqueViewportArrangeElement(env),
    _scrollOffsetElement: viewportIsTargetBody ? docElement : viewportElement,
    _scrollEventElement: viewportIsTargetBody ? ownerDocument : viewportElement,
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
  const generatedElements = keys(evaluatedTargetObj).reduce((arr, key) => {
    const value = evaluatedTargetObj[key as keyof StructureSetupElementsObj];
    return push(arr, value && isHTMLElement(value) && !parent(value) ? value : false);
  }, [] as Array<HTMLElement | false>);
  const elementIsGenerated = (elm: HTMLElement | false) =>
    elm ? inArray(generatedElements, elm) : null;
  const { _target, _host, _padding, _viewport, _content, _viewportArrange } = evaluatedTargetObj;
  const destroyFns: (() => any)[] = [
    () => {
      // always remove dataAttributeHost & dataAttributeInitialize from host and from <html> element if target is body
      removeAttr(_host, dataAttributeHost);
      removeAttr(_host, dataAttributeInitialize);
      removeAttr(_target, dataAttributeInitialize);
      if (isBody) {
        removeAttr(docElement, dataAttributeHost);
        removeAttr(docElement, dataAttributeInitialize);
      }
    },
  ];
  const isTextareaHostGenerated = isTextarea && elementIsGenerated(_host);
  let targetContents = isTextarea
    ? _target
    : contents(
        [_content, _viewport, _padding, _host, _target].find(
          (elm) => elementIsGenerated(elm) === false
        )
      );
  const contentSlot = viewportIsTargetBody ? _target : _content || _viewport;
  const destroy = bind(runEachAndClear, destroyFns);
  const appendElements = () => {
    attr(_host, dataAttributeHost, viewportIsTarget ? 'viewport' : 'host');
    attr(_padding, dataAttributePadding, '');
    attr(_content, dataAttributeContent, '');

    if (!viewportIsTarget) {
      attr(_viewport, dataAttributeViewport, '');
      isBody && addAttrClass(docElement, dataAttributeHost, dataValueHostHtmlBody);
    }

    const unwrap = (elm: HTMLElement | false | null | undefined) => {
      appendChildren(parent(elm), contents(elm));
      removeElements(elm);
    };

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
      removeAttr(_padding, dataAttributePadding);
      removeAttr(_content, dataAttributeContent);
      removeAttr(_viewport, dataAttributeHostOverflowX);
      removeAttr(_viewport, dataAttributeHostOverflowY);
      removeAttr(_viewport, dataAttributeViewport);

      elementIsGenerated(_content) && unwrap(_content);
      elementIsGenerated(_viewport) && unwrap(_viewport);
      elementIsGenerated(_padding) && unwrap(_padding);
    });

    if (_nativeScrollbarsHiding && !viewportIsTarget) {
      addAttrClass(_viewport, dataAttributeViewport, dataValueViewportScrollbarHidden);
      push(destroyFns, bind(removeAttr, _viewport, dataAttributeViewport));
    }
    if (_viewportArrange) {
      insertBefore(_viewport, _viewportArrange);
      push(destroyFns, bind(removeElements, _viewportArrange));
    }
    if (setViewportFocus) {
      const tabIndexStr = 'tabindex';
      const ogTabindex = attr(_viewport, tabIndexStr);

      attr(_viewport, tabIndexStr, '-1');
      _viewport.focus();

      const revertViewportTabIndex = () =>
        ogTabindex ? attr(_viewport, tabIndexStr, ogTabindex) : removeAttr(_viewport, tabIndexStr);
      const off = addEventListener(ownerDocument, 'pointerdown keydown', () => {
        revertViewportTabIndex();
        off();
      });

      push(destroyFns, [revertViewportTabIndex, off]);
    } else if (activeElm && (activeElm as HTMLElement).focus) {
      (activeElm as HTMLElement).focus();
    }

    // @ts-ignore
    targetContents = 0;

    return destroy;
  };

  return [evaluatedTargetObj, appendElements, destroy];
};
