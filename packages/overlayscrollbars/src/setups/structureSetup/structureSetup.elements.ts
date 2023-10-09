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
} from '~/support';
import {
  dataAttributeHost,
  dataAttributeInitialize,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  classNameScrollbarHidden,
  dataAttributeViewport,
  dataValueViewportScrollbarHidden,
  dataAttributePadding,
  dataAttributeContent,
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
  _viewportHasClass: (
    viewportAttributeClassName: string,
    hostAttributeClassName: string
  ) => boolean;
  _viewportAddRemoveClass: (
    viewportAttributeClassName: string,
    hostAttributeClassName: string,
    add?: boolean
  ) => void;
}

const tabIndexStr = 'tabindex';
const createNewDiv = createDiv.bind(0, '');

const unwrap = (elm: HTMLElement | false | null | undefined) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

export const createStructureSetupElements = (
  target: InitializationTarget
): StructureSetupElements => {
  const env = getEnvironment();
  const { _getDefaultInitialization, _nativeScrollbarsHiding } = env;
  const scrollbarsHidingPlugin = getStaticPluginModuleInstance<
    typeof scrollbarsHidingPluginName,
    typeof ScrollbarsHidingPlugin
  >(scrollbarsHidingPluginName);
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
  const wnd = ownerDocument.defaultView as Window;
  const staticInitializationElement = generalStaticInitializationElement.bind(0, [targetElement]);
  const dynamicInitializationElement = generalDynamicInitializationElement.bind(0, [targetElement]);
  const resolveInitialization = generalResolveInitialization.bind(0, [targetElement]);
  const generateViewportElement = staticInitializationElement.bind(
    0,
    createNewDiv,
    defaultViewportInitialization
  );
  const generateContentElement = dynamicInitializationElement.bind(
    0,
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
  const setViewportFocus = !viewportIsTarget && wnd.top === wnd && activeElm === targetElement;
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
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _isTextarea: isTextarea,
    _isBody: isBody,
    _targetIsElm: targetIsElm,
    _viewportIsTarget: viewportIsTarget,
    _viewportIsContent: viewportIsContent,
    _viewportHasClass: (viewportAttributeClassName: string, hostAttributeClassName: string) =>
      hasAttrClass(
        viewportElement,
        viewportIsTarget ? dataAttributeHost : dataAttributeViewport,
        viewportIsTarget ? hostAttributeClassName : viewportAttributeClassName
      ),
    _viewportAddRemoveClass: (
      viewportAttributeClassName: string,
      hostAttributeClassName: string,
      add?: boolean
    ) =>
      attrClass(
        viewportElement,
        viewportIsTarget ? dataAttributeHost : dataAttributeViewport,
        viewportIsTarget ? hostAttributeClassName : viewportAttributeClassName,
        add
      ),
  };
  const generatedElements = keys(evaluatedTargetObj).reduce((arr, key) => {
    const value = evaluatedTargetObj[key as keyof StructureSetupElementsObj];
    return push(arr, value && isHTMLElement(value) && !parent(value) ? value : false);
  }, [] as Array<HTMLElement | false>);
  const elementIsGenerated = (elm: HTMLElement | false) =>
    elm ? indexOf(generatedElements, elm) > -1 : null;
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
  const destroy = runEachAndClear.bind(0, destroyFns);
  const appendElements = () => {
    attr(_host, dataAttributeHost, viewportIsTarget ? 'viewport' : 'host');
    attr(_padding, dataAttributePadding, '');
    attr(_content, dataAttributeContent, '');

    if (!viewportIsTarget) {
      attr(_viewport, dataAttributeViewport, '');
    }

    const removeHtmlClass =
      isBody && !viewportIsTarget
        ? addClass(parent(targetElement), classNameScrollbarHidden)
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
      removeAttr(_padding, dataAttributePadding);
      removeAttr(_content, dataAttributeContent);
      removeAttr(_viewport, dataAttributeHostOverflowX);
      removeAttr(_viewport, dataAttributeHostOverflowY);
      removeAttr(_viewport, dataAttributeViewport);

      if (elementIsGenerated(_content)) {
        unwrap(_content);
      }
      if (elementIsGenerated(_viewport)) {
        unwrap(_viewport);
      }
      if (elementIsGenerated(_padding)) {
        unwrap(_padding);
      }
    });

    if (_nativeScrollbarsHiding && !viewportIsTarget) {
      attrClass(_viewport, dataAttributeViewport, dataValueViewportScrollbarHidden, true);
      push(destroyFns, removeAttr.bind(0, _viewport, dataAttributeViewport));
    }
    if (_viewportArrange) {
      insertBefore(_viewport, _viewportArrange);
      push(destroyFns, removeElements.bind(0, _viewportArrange));
    }
    if (setViewportFocus) {
      const ogTabindex = attr(_viewport, tabIndexStr);

      attr(_viewport, tabIndexStr, '-1');
      _viewport.focus();

      const revertViewportTabIndex = () =>
        ogTabindex ? attr(_viewport, tabIndexStr, ogTabindex) : removeAttr(_viewport, tabIndexStr);
      const off = on(ownerDocument, 'pointerdown keydown', () => {
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
