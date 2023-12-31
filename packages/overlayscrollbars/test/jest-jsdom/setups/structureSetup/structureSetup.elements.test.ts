import { is, isHTMLElement } from '~/support';
import { resolveInitialization } from '~/initialization';
import {
  dataAttributeHost,
  dataAttributeInitialize,
  dataAttributePadding,
  dataAttributeContent,
  dataAttributeViewport,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import { createStructureSetupElements } from '~/setups/structureSetup/structureSetup.elements';
import { registerPluginModuleInstances, ScrollbarsHidingPlugin } from '~/plugins';
import { OverlayScrollbars } from '~/overlayscrollbars';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { InternalEnvironment } from '~/environment';
import type {
  Initialization,
  InitializationTarget,
  InitializationTargetObject,
} from '~/initialization';

jest.mock('~/environment', () => ({
  getEnvironment: jest.fn(),
}));

registerPluginModuleInstances(ScrollbarsHidingPlugin, OverlayScrollbars);

interface StructureSetupElementsProxy {
  input: InitializationTarget;
  elements: StructureSetupElementsObj;
  destroy: () => void;
  canceled: () => void;
}

type TargetType = 'element' | 'textarea' | 'body';
type StructureStaticInitializationElement = Initialization['elements']['viewport'];
type StructureDynamicInitializationElement = Initialization['elements']['content'];

const textareaId = 'textarea';
const textareaHostId = 'host';
const elementId = 'target';
const dynamicContentId = 'dynamicContent';
const dynamicContent = `text<p id="${dynamicContentId}">paragraph</p>`;
const textareaContent = `<textarea id="${textareaId}">text</textarea>`;
const getSnapshot = () => document.documentElement.outerHTML;
const getTarget = (targetType: TargetType) => {
  switch (targetType) {
    case 'element':
      return document.getElementById(elementId)!;
    case 'textarea':
      return document.getElementById(textareaId)!;
    case 'body':
      return document.body;
    default:
      throw new Error('Invalid Target');
  }
};

const fillBody = (
  targetType: TargetType,
  customDOM?: (content: string, hostId: string) => string
) => {
  const textarea = targetType === 'textarea';
  const hostId = textarea ? textareaHostId : elementId;
  const customDomResult =
    customDOM && customDOM(textarea ? textareaContent : dynamicContent, hostId);
  const normalDom = textarea ? textareaContent : `<div id="${elementId}">${dynamicContent}</div>`;
  document.body.innerHTML = `
    <nav></nav>
    ${customDomResult || normalDom}
    <footer></footer>
  `;

  // unwrap host if target is body
  if (targetType === 'body') {
    const target = document.querySelector(`#${hostId}`);
    if (target) {
      const { parentElement } = target;
      parentElement!.append(...target.childNodes);
      target.remove();
    }
  }

  return getSnapshot();
};
const clearBody = () => {
  document.body.innerHTML = '';
};

const getElements = (targetType: TargetType) => {
  const target = getTarget(targetType);
  const host = document.querySelector(`[${dataAttributeHost}]`)!;
  const padding = document.querySelector(`[${dataAttributePadding}]`)!;
  const viewport = document.querySelector(`[${dataAttributeViewport}]`)!;
  const content = document.querySelector(`[${dataAttributeContent}]`)!;
  const children =
    targetType === 'textarea'
      ? document.querySelector(`#${textareaId}`)
      : document.querySelector(`#${dynamicContentId}`);

  return {
    target,
    host,
    padding,
    viewport,
    content,
    children,
  };
};

const assertCorrectDOMStructure = (
  targetType: TargetType,
  env: InternalEnvironment,
  elements: StructureSetupElementsObj
) => {
  const { target, host, padding, viewport, content, children } = getElements(targetType);
  const { _getDefaultInitialization } = env;
  const { _viewportIsTarget, _viewportIsContent, _viewport, _content, _isBody } = elements;

  expect(children).toBeDefined();
  expect((_content || _viewport).contains(children)).toBe(true);

  if (_viewportIsTarget) {
    expect(host.getAttribute(dataAttributeHost)).toBe('viewport');
    expect(_viewportIsContent).toBe(false);

    if (_isBody) {
      expect(target.parentElement).toBe(host);
    } else {
      expect(target).toBe(host);
    }

    expect(host).toBeTruthy();
    expect(padding).toBeFalsy();
    expect(viewport).toBeFalsy();
    expect(content).toBeFalsy();
  } else {
    expect(host.getAttribute(dataAttributeHost)).toBe('host');

    expect(host).toBeTruthy();
    expect(viewport).toBeTruthy();
    expect(viewport.parentElement).toBe(padding || host);

    if (content) {
      expect(content.parentElement).toBe(viewport);
    }
    if (padding) {
      expect(padding.parentElement).toBe(host);
    }

    if (targetType !== 'body') {
      expect(host.parentElement).toBe(document.body);
      expect(host.previousElementSibling).toBe(document.querySelector('nav'));
      expect(host.nextElementSibling).toBe(document.querySelector('footer'));
    }

    const contentElm = content || viewport;
    if (targetType === 'textarea') {
      expect(target.parentElement).toBe(contentElm);
      expect(contentElm.innerHTML).toBe(textareaContent);
    } else {
      expect(target).toBe(host);
      expect(contentElm.innerHTML).toContain(dynamicContent);
    }
  }

  if (_viewportIsContent) {
    const { _target } = elements;
    const { elements: defaultInitElements } = _getDefaultInitialization();
    const { content: defaultContentInit } = defaultInitElements;
    const resolvedDefaultContentInit = resolveInitialization([_target], defaultContentInit);

    if (resolvedDefaultContentInit) {
      expect(children!.parentElement).toBe(_content || _viewport);
    } else {
      expect(children!.parentElement).toBe(_viewport);
    }
  }
};

const createStructureSetupElementsProxy = (
  target: InitializationTarget,
  { tabindex = false } = {}
): StructureSetupElementsProxy => {
  const [elements, appendElements, canceled] = createStructureSetupElements(target);
  // simulate tabindex inheritance from host via mutation observer
  if (tabindex) {
    elements._viewport.setAttribute('tabindex', elements._target.getAttribute('tabindex')!);
  }

  const destroy = appendElements();

  return {
    input: target,
    elements,
    destroy,
    canceled,
  };
};

const assertCorrectSetupElements = (
  targetType: TargetType,
  setupElementsProxy: StructureSetupElementsProxy,
  environment: InternalEnvironment
): [StructureSetupElementsObj, () => void] => {
  const { input, elements, destroy } = setupElementsProxy;
  const {
    _target,
    _host,
    _padding,
    _viewport,
    _content,
    _viewportIsTarget,
    _viewportIsContent,
    _viewportHasClass,
    _viewportAddRemoveClass,
  } = elements;
  const { target, host, padding, viewport, content } = getElements(targetType);
  const isTextarea = target.matches('textarea');
  const isBody = target.matches('body');

  if (targetType !== 'element') {
    expect(target.matches(targetType)).toBe(true);
  }

  expect(_target).toBe(target);
  expect(_host).toBe(host);

  if (_viewportIsTarget) {
    expect(padding).toBeFalsy();
    expect(_padding).toBeFalsy();
  } else if (padding || _padding) {
    expect(_padding).toBe(padding);
  } else {
    expect(padding).toBeFalsy();
    expect(_padding).toBeFalsy();
  }

  if (_viewportIsTarget) {
    if (isBody) {
      expect(_viewport).toBe(_target.parentElement);
    } else {
      expect(_viewport).toBe(_target);
    }
  } else if (viewport || _viewport) {
    expect(_viewport).toBe(viewport);
  } else {
    expect(viewport).toBeFalsy();
    expect(_viewport).toBeFalsy();
  }

  if (_viewportIsTarget) {
    expect(content).toBeFalsy();
    expect(_content).toBeFalsy();
  } else if (content || _content) {
    expect(_content).toBe(content);
  } else {
    expect(content).toBeFalsy();
    expect(_content).toBeFalsy();
  }

  const { _isTextarea, _isBody, _documentElm, _windowElm } = elements;

  expect(_isTextarea).toBe(isTextarea);
  expect(_isBody).toBe(isBody);
  expect(_windowElm).toBe(document.defaultView);
  expect(_documentElm).toBe(document);

  expect(typeof destroy).toBe('function');

  const { _nativeScrollbarsHiding, _cssCustomProperties, _getDefaultInitialization } = environment;
  const { elements: defaultInitElements } = _getDefaultInitialization();
  const {
    host: defaultHostInitStrategy,
    padding: defaultPaddingInitStrategy,
    viewport: defaultViewportInitStrategy,
    content: defaultContentInitStrategy,
  } = defaultInitElements;
  const inputIsElement = isHTMLElement(input);
  const inputAsObj = input as InitializationTargetObject;
  const styleElm = document.querySelector('style');
  const checkStrategyDependendElements = (
    elm: Element | null,
    initialization:
      | StructureStaticInitializationElement
      | StructureDynamicInitializationElement
      | undefined,
    isStaticInitialization: boolean,
    defaultInitialization:
      | StructureStaticInitializationElement
      | StructureDynamicInitializationElement,
    kind: 'padding' | 'viewport' | 'content' | 'host'
  ) => {
    const resolvedInitialization = resolveInitialization([target], initialization);
    const resolvedDefaultInitialization = resolveInitialization([target], defaultInitialization);
    if (resolvedInitialization) {
      if (!_viewportIsTarget && !_viewportIsContent) {
        expect(elm).toBeTruthy();
      }
      if (_viewportIsContent) {
        if (kind === 'content') {
          if (resolvedDefaultInitialization) {
            expect(elm).toBeTruthy();
          } else {
            expect(elm).toBeFalsy();
          }
        } else {
          expect(elm).toBeTruthy();
        }
      }
    } else {
      if (resolvedInitialization === false) {
        expect(elm).toBeFalsy();
      }
      if (resolvedInitialization === undefined) {
        if (isStaticInitialization) {
          defaultInitialization = defaultInitialization as StructureStaticInitializationElement;
          if (_viewportIsTarget) {
            if (kind === 'host') {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resolvedDefaultInitialization && !isTextarea) {
            expect(resolvedDefaultInitialization).toBe(elm);
          } else {
            expect(elm).toBeTruthy();
          }
        } else {
          defaultInitialization = defaultInitialization as StructureDynamicInitializationElement;
          const resultIsBoolean = typeof resolvedDefaultInitialization === 'boolean';
          if (_viewportIsTarget) {
            if (kind === 'host') {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resultIsBoolean) {
            if (resolvedDefaultInitialization) {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resolvedDefaultInitialization) {
            expect(elm).toBe(resolvedDefaultInitialization);
          }
        }
      }
    }
  };

  if (_nativeScrollbarsHiding || _cssCustomProperties || _viewportIsTarget) {
    expect(styleElm).toBeFalsy();
  } else {
    expect(styleElm).toBeTruthy();
  }

  if (_viewportIsContent) {
    const { content: defaultContentInit } = defaultInitElements;
    const resolvedDefaultContentInit = resolveInitialization([_target], defaultContentInit);

    if (resolvedDefaultContentInit) {
      expect(_content).toBeTruthy();
    } else {
      expect(_content).toBeFalsy();
    }
  }

  if (inputIsElement) {
    checkStrategyDependendElements(
      padding,
      undefined,
      false,
      defaultPaddingInitStrategy,
      'padding'
    );
    checkStrategyDependendElements(
      content,
      undefined,
      false,
      defaultContentInitStrategy,
      'content'
    );
    checkStrategyDependendElements(
      viewport,
      undefined,
      true,
      defaultViewportInitStrategy,
      'viewport'
    );
    checkStrategyDependendElements(host, undefined, true, defaultHostInitStrategy, 'host');
  } else {
    const { elements: inputElements } = inputAsObj;
    const {
      host: hostInitialization,
      padding: paddingInitialization,
      viewport: viewportInitialization,
      content: contentInitialization,
    } = inputElements || {};
    checkStrategyDependendElements(
      padding,
      paddingInitialization,
      false,
      defaultPaddingInitStrategy,
      'padding'
    );
    checkStrategyDependendElements(
      content,
      contentInitialization,
      false,
      defaultContentInitStrategy,
      'content'
    );
    checkStrategyDependendElements(
      viewport,
      viewportInitialization,
      true,
      defaultViewportInitStrategy,
      'viewport'
    );
    checkStrategyDependendElements(host, hostInitialization, true, defaultHostInitStrategy, 'host');
  }

  const attrName = 'attr';

  _viewportAddRemoveClass(attrName, true);
  if (_viewportIsTarget) {
    expect(_viewportHasClass(attrName)).toBe(true);
    expect(_host.getAttribute(dataAttributeHost)!.indexOf(attrName) >= 0).toBe(true);
  } else {
    expect(_viewportHasClass(attrName)).toBe(true);
  }
  _viewportAddRemoveClass(attrName);
  if (_viewportIsTarget) {
    expect(_host.getAttribute(dataAttributeHost)!.indexOf(attrName) >= 0).toBe(false);
    expect(_viewportHasClass(attrName)).toBe(false);
  } else {
    expect(_viewportHasClass(attrName)).toBe(false);
  }

  return [elements, destroy];
};

const assertCorrectDestroy = (snapshot: string, destroy: () => void) => {
  destroy();

  // remove empty class attr
  const elms = document.querySelectorAll('*');
  Array.from(elms).forEach((elm) => {
    const classAttr = elm.getAttribute('class');
    if (classAttr === '') {
      elm.removeAttribute('class');
    }
  });

  expect(getSnapshot()).toBe(snapshot);
};

const env: InternalEnvironment = jest.requireActual('~/environment').getEnvironment();
const envDefault = {
  name: 'default',
  env,
};
const envNativeScrollbarStyling = {
  name: 'native scrollbar styling',
  env: {
    ...env,
    _nativeScrollbarsHiding: true,
  },
};
const envCssCustomProperties = {
  name: 'custom css properties',
  env: {
    ...env,
    _cssCustomProperties: true,
  },
};
const envInitStrategyMin = {
  name: 'initialization strategy min',
  env: {
    ...env,
    _getDefaultInitialization: () => ({
      ...env._staticDefaultInitialization,
      elements: {
        ...env._staticDefaultInitialization.elements,
        host: null,
        viewport: () => null,
        content: () => false,
        padding: false,
      },
    }),
  },
};
const envInitStrategyMax = {
  name: 'initialization strategy max',
  env: {
    ...env,
    _getDefaultInitialization: () => ({
      ...env._staticDefaultInitialization,
      elements: {
        ...env._staticDefaultInitialization.elements,
        host: null,
        viewport: null,
        content: true,
        padding: () => true,
      },
    }),
  },
};
const envInitStrategyAssigned = {
  name: 'initialization strategy assigned',
  env: {
    ...env,
    _getDefaultInitialization: () => ({
      ...env._staticDefaultInitialization,
      elements: {
        ...env._staticDefaultInitialization.elements,
        host: () => document.querySelector('#host1') as HTMLElement,
        viewport: (target: HTMLElement) => target.querySelector('#viewport') as HTMLElement,
        content: (target: HTMLElement) => target.querySelector<HTMLElement>('#content'),
        padding: (target: HTMLElement) => target.querySelector<HTMLElement>('#padding'),
      },
    }),
  },
};
const envInitStrategyViewportIsTarget = {
  name: 'initialization strategy viewport is target',
  env: {
    ...env,
    _nativeScrollbarsHiding: true,
    _getDefaultInitialization: () => ({
      ...env._staticDefaultInitialization,
      elements: {
        ...env._staticDefaultInitialization.elements,
        viewport: (target: HTMLElement) => !is(target, 'textarea') && target,
      },
    }),
  },
};

describe('structureSetup.elements', () => {
  afterEach(() => clearBody());

  beforeEach(() => {
    (getEnvironment as jest.Mock).mockImplementation(() =>
      jest.requireActual('~/environment').getEnvironment()
    );
  });

  [
    envDefault,
    envNativeScrollbarStyling,
    envCssCustomProperties,
    envInitStrategyMin,
    envInitStrategyMax,
    envInitStrategyAssigned,
    envInitStrategyViewportIsTarget,
  ].forEach((envWithName) => {
    const { env: currEnv, name } = envWithName;
    describe(`Environment: ${name}`, () => {
      beforeEach(() => {
        (getEnvironment as jest.Mock).mockImplementation(() => currEnv);
      });

      (['element', 'textarea', 'body'] as TargetType[]).forEach((targetType) => {
        describe(targetType, () => {
          describe('basic', () => {
            test('Element', () => {
              const snapshot = fillBody(targetType);
              const [elements, destroy] = assertCorrectSetupElements(
                targetType,
                createStructureSetupElementsProxy(getTarget(targetType)),
                currEnv
              );
              assertCorrectDOMStructure(targetType, currEnv, elements);
              assertCorrectDestroy(snapshot, destroy);
            });

            test('Object', () => {
              const snapshot = fillBody(targetType);
              const [elements, destroy] = assertCorrectSetupElements(
                targetType,
                createStructureSetupElementsProxy({ target: getTarget(targetType) }),
                currEnv
              );
              assertCorrectDOMStructure(targetType, currEnv, elements);
              assertCorrectDestroy(snapshot, destroy);
            });
          });

          describe('complex', () => {
            describe('single assigned', () => {
              test('padding', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="content">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('multiple assigned', () => {
              test('padding viewport content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding"><div id="viewport"><div id="content">${content}</div></div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('padding viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding"><div id="viewport">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('padding content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding"><div id="content">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('viewport content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport"><div id="content">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('single false', () => {
              test('padding', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      padding: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('content', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      content: () => false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('single true', () => {
              test('padding', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      padding: () => true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('content', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('multiple false', () => {
              test('padding & content', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      padding: false,
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('multiple true', () => {
              test('padding & content', () => {
                const snapshot = fillBody(targetType);
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      padding: true,
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });

            describe('mixed', () => {
              test('false: padding & content | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: padding & content | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: true,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: content | false: padding | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: () => false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: padding | false: content | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: true,
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: padding | assigned: content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="content">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: false,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: padding | assigned: content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="content">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: true,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: padding | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: () => false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: padding | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: true,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: padding | assigned: viewport & content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport"><div id="content">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      padding: false,
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: padding | assigned: viewport & content', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport"><div id="content">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      padding: true,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: content | assigned: padding', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: content | assigned: padding', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: content | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: content | assigned: viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewport">${content}</div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('false: content | assigned: padding & viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding"><div id="viewport">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });

              test('true: content | assigned: padding & viewport', () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="padding"><div id="viewport">${content}</div></div></div>`
                );
                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: {
                      host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });
          });

          describe('viewport is content', () => {
            [
              {
                testName: 'HTMLElement',
                getInitializationElements: () => ({
                  host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                  viewport: document.querySelector<HTMLElement>('#viewportOrContent'),
                  content: document.querySelector<HTMLElement>('#viewportOrContent'),
                }),
              },
              {
                testName: 'function',
                getInitializationElements: () => ({
                  host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                  viewport: () => document.querySelector<HTMLElement>('#viewportOrContent'),
                  content: () => document.querySelector<HTMLElement>('#viewportOrContent'),
                }),
              },
              {
                testName: 'mixed',
                getInitializationElements: () => ({
                  host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                  viewport: document.querySelector<HTMLElement>('#viewportOrContent'),
                  content: () => document.querySelector<HTMLElement>('#viewportOrContent'),
                }),
              },
            ].forEach(({ testName, getInitializationElements }) => {
              test(testName, () => {
                const snapshot = fillBody(
                  targetType,
                  (content, hostId) =>
                    `<div id="${hostId}"><div id="viewportOrContent">${content}</div></div>`
                );

                const [elements, destroy] = assertCorrectSetupElements(
                  targetType,
                  createStructureSetupElementsProxy({
                    target: getTarget(targetType),
                    elements: getInitializationElements(),
                  }),
                  currEnv
                );
                if (!elements._viewportIsTarget) {
                  expect(elements._viewportIsContent).toBe(true);
                }
                if (elements._viewportIsContent) {
                  expect(getElements(targetType).children!.parentElement).toBe(
                    document.querySelector(`#viewportOrContent`)
                  );
                  const defaultContentFn = currEnv._getDefaultInitialization().elements.content;
                  const defaultContentElm =
                    typeof defaultContentFn === 'function'
                      ? defaultContentFn(getTarget(targetType))
                      : defaultContentFn;

                  if (defaultContentElm) {
                    expect(elements._content).toBeTruthy();
                  } else {
                    expect(elements._content).toBeFalsy();
                  }
                }
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });
          });

          // textarea can't ever be the viewport
          if (targetType !== 'textarea') {
            describe('viewport is target', () => {
              [
                {
                  testName: 'HTMLElement',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: target,
                  }),
                },
                {
                  testName: 'function',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: () => target,
                  }),
                },
                {
                  testName: 'mixed',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: target,
                  }),
                },
              ].forEach(({ testName, getInitializationElements }) => {
                test(testName, () => {
                  const snapshot = fillBody(
                    targetType,
                    (content, hostId) => `<div id="${hostId}">${content}</div>`
                  );

                  const [elements, destroy] = assertCorrectSetupElements(
                    targetType,
                    createStructureSetupElementsProxy({
                      target: getTarget(targetType),
                      elements: getInitializationElements(getTarget(targetType)),
                    }),
                    currEnv
                  );
                  expect(elements._viewportIsTarget).toBe(true);
                  expect(elements._host).toBe(
                    elements._isBody ? elements._target.parentElement : elements._target
                  );
                  expect(elements._padding).toBeFalsy();
                  expect(elements._viewport).toBe(
                    elements._isBody ? elements._target.parentElement : elements._target
                  );
                  expect(elements._content).toBeFalsy();

                  assertCorrectDOMStructure(targetType, currEnv, elements);
                  assertCorrectDestroy(snapshot, destroy);
                });
              });
            });

            describe('viewport is target is content', () => {
              [
                {
                  testName: 'HTMLElement',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: target,
                    content: target,
                  }),
                },
                {
                  testName: 'function',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: () => document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: () => target,
                    content: () => target,
                  }),
                },
                {
                  testName: 'mixed',
                  getInitializationElements: (target: HTMLElement) => ({
                    host: document.querySelector<HTMLElement>(`#${textareaHostId}`),
                    viewport: () => target,
                    content: target,
                  }),
                },
              ].forEach(({ testName, getInitializationElements }) => {
                test(testName, () => {
                  const snapshot = fillBody(
                    targetType,
                    (content, hostId) =>
                      `<div id="${hostId}"><div id="viewportIsTargetIsContent">${content}</div></div>`
                  );

                  const [elements, destroy] = assertCorrectSetupElements(
                    targetType,
                    createStructureSetupElementsProxy({
                      target: getTarget(targetType),
                      elements: getInitializationElements(getTarget(targetType)),
                    }),
                    currEnv
                  );
                  expect(elements._viewportIsContent).toBe(false);
                  expect(elements._viewportIsTarget).toBe(true);
                  expect(elements._host).toBe(
                    elements._isBody ? elements._target.parentElement : elements._target
                  );
                  expect(elements._padding).toBeFalsy();
                  expect(elements._viewport).toBe(
                    elements._isBody ? elements._target.parentElement : elements._target
                  );
                  expect(elements._content).toBeFalsy();

                  assertCorrectDOMStructure(targetType, currEnv, elements);
                  assertCorrectDestroy(snapshot, destroy);
                });
              });
            });
          }
        });
      });
    });
  });

  describe('focus', () => {
    describe('shift tabindex to viewport', () => {
      test('with pointerdown on body', () => {
        const { elements } = createStructureSetupElementsProxy(document.body);
        expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(elements._viewport);

        elements._documentElm.dispatchEvent(new Event('pointerdown'));

        expect(elements._viewport.getAttribute('tabindex')).toBe(null);
      });

      test('with keydown on element', () => {
        document.body.innerHTML = '<div tabindex="123"></div>';
        const target = document.body.firstElementChild as HTMLElement;
        target.focus();

        const { elements } = createStructureSetupElementsProxy(target, { tabindex: true });
        expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(elements._viewport);

        elements._documentElm.dispatchEvent(new Event('keydown'));

        expect(elements._viewport.getAttribute('tabindex')).toBe('123');
      });
    });

    test('shift tabindex back to original activeElement', () => {
      document.body.innerHTML = '<input type="text" value="hi"></input>';
      const input = document.querySelector('input') as HTMLInputElement;
      const target = document.body;

      input.focus();
      const preInitFocus = document.activeElement;

      const { elements } = createStructureSetupElementsProxy(target);

      expect(preInitFocus).toBe(document.activeElement);

      elements._documentElm.dispatchEvent(new Event('pointerdown'));
      elements._documentElm.dispatchEvent(new Event('keydown'));

      expect(preInitFocus).toBe(document.activeElement);
    });
  });

  describe('data-overlayscrollbars-initialize attribute', () => {
    test('already set data-overlayscrollbars-initialize attribute is removed', () => {
      const target = document.body;
      target.setAttribute(dataAttributeInitialize, '');

      const { destroy } = createStructureSetupElementsProxy(target);
      destroy();

      expect(document.body.getAttribute(dataAttributeInitialize)).toBe(null);
    });

    test('already set data-overlayscrollbars-initialize attribute is removed even if initialization gets canceled', () => {
      const target = document.body;
      target.setAttribute(dataAttributeInitialize, '');

      const { canceled } = createStructureSetupElementsProxy(target);
      canceled();

      expect(document.body.getAttribute(dataAttributeInitialize)).toBe(null);
    });

    test('already set data-overlayscrollbars-initialize attribute on html element is removed if target is body', () => {
      document.documentElement.setAttribute(dataAttributeInitialize, '');

      const { destroy } = createStructureSetupElementsProxy(document.body);
      destroy();

      expect(document.documentElement.getAttribute(dataAttributeInitialize)).toBe(null);
    });
  });
});
