import { vi, describe, test, beforeEach, expect } from 'vitest';
import type { StructureSetupElementsObj } from '../../../../src/setups/structureSetup/structureSetup.elements';
import type { Env } from '../../../../src/environment';
import type {
  Initialization,
  InitializationTarget,
  InitializationTargetObject,
} from '../../../../src/initialization';
import { isHTMLElement } from '../../../../src/support';
import { resolveInitialization } from '../../../../src/initialization';
import {
  dataAttributeHost,
  dataAttributeInitialize,
  dataAttributePadding,
  dataAttributeContent,
  dataAttributeViewport,
} from '../../../../src/classnames';
import { getEnvironment } from '../../../../src/environment';
import { createStructureSetupElements } from '../../../../src/setups/structureSetup/structureSetup.elements';
import { registerPluginModuleInstances, ScrollbarsHidingPlugin } from '../../../../src/plugins';
import { OverlayScrollbars } from '../../../../src/overlayscrollbars';

vi.mock(import('../../../../src/environment'), async (importActual) => {
  const actualModule = await importActual();
  return {
    ...actualModule,
    getEnvironment: vi.fn(actualModule.getEnvironment),
  };
});

registerPluginModuleInstances(ScrollbarsHidingPlugin, OverlayScrollbars);

interface StructureSetupElementsProxy {
  input: InitializationTarget;
  elements: StructureSetupElementsObj;
  destroy: () => void;
  canceled: () => void;
}

type TargetType = 'element' | 'body';
type StructureStaticInitializationElement = Initialization['elements']['viewport'];
type StructureDynamicInitializationElement = Initialization['elements']['content'];

const elementId = 'target';
const dynamicContentId = 'dynamicContent';
const dynamicContent = `text<p id="${dynamicContentId}">paragraph</p>`;
const getSnapshot = () => document.documentElement.outerHTML;
const getTarget = (targetType: TargetType) => {
  switch (targetType) {
    case 'element':
      return document.getElementById(elementId)!;
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
  const hostId = elementId;
  const customDomResult = customDOM && customDOM(dynamicContent, hostId);
  const normalDom = `<div id="${elementId}">${dynamicContent}</div>`;
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
  const htmlElement = document.documentElement;
  const bodyElement = document.body;

  const removeAllAttrs = (element: HTMLElement) => {
    Object.values(element.attributes).forEach(({ name }) => element.removeAttribute(name));
  };

  removeAllAttrs(htmlElement);
  removeAllAttrs(bodyElement);

  document.body.innerHTML = '';
};

const getElements = (targetType: TargetType) => {
  const target = getTarget(targetType);
  const host = document.querySelector(`[${dataAttributeHost}]:not([${dataAttributeHost}="body"])`)!;
  const padding = document.querySelector(`[${dataAttributePadding}]`)!;
  const viewport = document.querySelector(`[${dataAttributeViewport}]`)!;
  const content = document.querySelector(`[${dataAttributeContent}]`)!;
  const children = document.querySelector(`#${dynamicContentId}`);

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
  env: Env,
  elements: StructureSetupElementsObj
) => {
  const { target, host, padding, viewport, content, children } = getElements(targetType);
  const { _viewportIsTarget, _viewport, _content, _isBody } = elements;

  expect(children).toBeDefined();
  expect((_content || _viewport).contains(children)).toBe(true);

  if (_viewportIsTarget) {
    expect(host.hasAttribute(dataAttributeHost)).toBe(true);
    expect(host.hasAttribute(dataAttributeViewport)).toBe(true);

    if (_isBody) {
      expect(target.parentElement).toBe(host);
    } else {
      expect(target).toBe(host);
    }

    expect(host).toBeTruthy();
    expect(padding).toBeFalsy();
    expect(viewport).toBe(host);
    expect(content).toBeFalsy();
  } else {
    expect(host.hasAttribute(dataAttributeHost)).toBe(true);
    expect(host.hasAttribute(dataAttributeViewport)).toBe(false);

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
    expect(target).toBe(host);
    expect(contentElm.innerHTML).toContain(dynamicContent);
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
  environment: Env
): [StructureSetupElementsObj, () => void] => {
  const { input, elements, destroy } = setupElementsProxy;
  const {
    _target,
    _host,
    _padding,
    _viewport,
    _content,
    _viewportIsTarget,
    _originalScrollOffsetElement,
    _viewportHasClass,
    _viewportAddRemoveClass,
  } = elements;
  const { target, host, padding, viewport, content } = getElements(targetType);
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

  const { _isBody, _documentElm, _windowElm } = elements;
  expect(_isBody).toBe(isBody);
  expect(_windowElm()).toBe(document.defaultView);
  expect(_documentElm).toBe(document);

  expect(typeof destroy).toBe('function');

  const { _getDefaultInitialization } = environment;
  const { elements: defaultInitElements } = _getDefaultInitialization();
  const {
    host: defaultHostInitStrategy,
    padding: defaultPaddingInitStrategy,
    viewport: defaultViewportInitStrategy,
    content: defaultContentInitStrategy,
  } = defaultInitElements;
  const inputIsElement = isHTMLElement(input);
  const inputAsObj = input as InitializationTargetObject;
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

    if (resolvedInitialization === false) {
      expect(elm).toBeFalsy();
    }
    if (resolvedInitialization === undefined) {
      if (isStaticInitialization) {
        defaultInitialization = defaultInitialization as StructureStaticInitializationElement;
        if (_viewportIsTarget) {
          if (kind === 'host' || kind === 'viewport') {
            expect(elm).toBeTruthy();
          } else {
            expect(elm).toBeFalsy();
          }
        } else if (resolvedDefaultInitialization) {
          expect(resolvedDefaultInitialization).toBe(elm);
        }
      } else {
        defaultInitialization = defaultInitialization as StructureDynamicInitializationElement;
        const resultIsBoolean = typeof resolvedDefaultInitialization === 'boolean';
        if (_viewportIsTarget) {
          if (kind === 'host' || kind === 'viewport') {
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
  };

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

    // check for correct original scroll offset element
    if (isBody) {
      expect(_originalScrollOffsetElement).toBe(_documentElm.documentElement);
    } else {
      expect(_originalScrollOffsetElement).toBe(target);
    }
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

    // check for correct original scroll offset element
    if (isBody) {
      expect(_originalScrollOffsetElement).toBe(_documentElm.documentElement);
    } else if (_viewportIsTarget || !viewportInitialization) {
      expect(_originalScrollOffsetElement).toBe(target);
    } else {
      const resolvedViewport = resolveInitialization([target], viewportInitialization);

      if (
        isHTMLElement(resolvedViewport) &&
        (resolvedViewport.offsetHeight - resolvedViewport.scrollHeight > 0 ||
          resolvedViewport.offsetWidth - resolvedViewport.scrollWidth)
      ) {
        expect(_originalScrollOffsetElement).toBe(resolvedViewport);
      } else {
        expect(_originalScrollOffsetElement).toBe(target);
      }
    }
  }

  const attrName = 'attr';

  _viewportAddRemoveClass(attrName, true);
  expect(_viewportHasClass(attrName)).toBe(true);
  expect(_host.getAttribute(dataAttributeHost)!.includes(attrName)).toBe(false);
  expect(_viewport.getAttribute(dataAttributeViewport)!.includes(attrName)).toBe(true);

  _viewportAddRemoveClass(attrName);
  expect(_viewportHasClass(attrName)).toBe(false);
  expect(_host.getAttribute(dataAttributeHost)!.includes(attrName)).toBe(false);
  expect(_viewport.getAttribute(dataAttributeViewport)!.includes(attrName)).toBe(false);
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

const env: Env = getEnvironment();
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
        viewport: (target: HTMLElement) => target,
      },
    }),
  },
};

describe('structureSetup.elements', () => {
  beforeEach(async () => {
    clearBody();
    const actualModule = await vi.importActual<typeof import('../../../../src/environment')>(
      '../../../../src/environment'
    );
    vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(actualModule.getEnvironment);
  });

  [
    envDefault,
    envNativeScrollbarStyling,
    envInitStrategyMin,
    envInitStrategyMax,
    envInitStrategyAssigned,
    envInitStrategyViewportIsTarget,
  ].forEach((envWithName) => {
    const { env: currEnv, name } = envWithName;
    describe(`Environment: ${name}`, () => {
      beforeEach(() => {
        vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(() => currEnv);
      });

      (['element', 'body'] as TargetType[]).forEach((targetType) => {
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
                  viewport: document.querySelector<HTMLElement>('#viewportOrContent'),
                  content: document.querySelector<HTMLElement>('#viewportOrContent'),
                }),
              },
              {
                testName: 'function',
                getInitializationElements: () => ({
                  viewport: () => document.querySelector<HTMLElement>('#viewportOrContent'),
                  content: () => document.querySelector<HTMLElement>('#viewportOrContent'),
                }),
              },
              {
                testName: 'mixed',
                getInitializationElements: () => ({
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
                expect(elements._content).toBeFalsy();
                assertCorrectDOMStructure(targetType, currEnv, elements);
                assertCorrectDestroy(snapshot, destroy);
              });
            });
          });
        });
      });
    });
  });

  describe('focus & tabindex', () => {
    test('body focused', () => {
      const { elements } = createStructureSetupElementsProxy({
        target: document.body,
        elements: {
          viewport: false,
        },
        cancel: {
          body: false,
        },
      });
      expect(elements._target.getAttribute('tabindex')).toBe(null);
      expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
      expect(document.activeElement).toBe(elements._viewport);
    });

    test('body not focused', () => {
      document.body.innerHTML = '<button></button>';
      document.querySelector('button')!.focus();
      const originalFocus = document.activeElement;
      const { elements } = createStructureSetupElementsProxy({
        target: document.body,
        elements: {
          viewport: false,
        },
        cancel: {
          body: false,
        },
      });
      expect(elements._target.getAttribute('tabindex')).toBe(null);
      expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
      expect(document.activeElement).toBe(originalFocus);
    });

    test('body viewportIsTarget focused', () => {
      const { elements } = createStructureSetupElementsProxy({
        target: document.body,
        elements: {
          viewport: document.body,
        },
        cancel: {
          body: false,
        },
      });
      expect(elements._target.getAttribute('tabindex')).toBe(null);
      expect(elements._viewport.getAttribute('tabindex')).toBe(null);
      expect(document.activeElement).toBe(elements._target);
    });

    test('body viewportIsTarget not focused', () => {
      document.body.innerHTML = '<button></button>';
      document.querySelector('button')!.focus();
      const originalFocus = document.activeElement;
      const { elements } = createStructureSetupElementsProxy({
        target: document.body,
        elements: {
          viewport: document.body,
        },
        cancel: {
          body: false,
        },
      });
      expect(elements._target.getAttribute('tabindex')).toBe(null);
      expect(elements._viewport.getAttribute('tabindex')).toBe(null);
      expect(document.activeElement).toBe(originalFocus);
    });

    test('element focused', () => {
      document.body.innerHTML = '<div tabindex="123"></div>';
      const target = document.body.firstElementChild as HTMLElement;
      target.focus();

      const { elements } = createStructureSetupElementsProxy(target);
      expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
      expect(elements._host.getAttribute('tabindex')).toBe('123');
      // dont move the focus from previously focused target
      expect(document.activeElement).toBe(elements._target);
    });

    test('element not focused', () => {
      document.body.innerHTML = '<div></div>';
      const target = document.body.firstElementChild as HTMLElement;
      const originalFocus = document.activeElement;
      const { elements } = createStructureSetupElementsProxy(target);
      expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
      expect(elements._host.getAttribute('tabindex')).toBe(null);
      expect(document.activeElement).toBe(originalFocus);
    });

    test('element with explicit viewport focused', () => {
      document.body.innerHTML = '<div tabindex="123"><div tabindex="456"></div></div>';
      const target = document.body.firstElementChild as HTMLElement;
      const viewport = target.firstElementChild as HTMLElement;
      viewport.focus();

      const { elements } = createStructureSetupElementsProxy({
        target,
        elements: {
          viewport,
        },
      });
      expect(elements._viewport.getAttribute('tabindex')).toBe('456');
      expect(elements._host.getAttribute('tabindex')).toBe('123');
      expect(document.activeElement).toBe(elements._viewport);
    });

    test('element with explicit viewport not focused', () => {
      document.body.innerHTML = '<div><div></div></div>';
      const target = document.body.firstElementChild as HTMLElement;
      const viewport = target.firstElementChild as HTMLElement;
      const originalFocus = document.activeElement;
      const { elements } = createStructureSetupElementsProxy({
        target,
        elements: {
          viewport,
        },
      });
      expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
      expect(elements._host.getAttribute('tabindex')).toBe(null);
      expect(document.activeElement).toBe(originalFocus);
    });

    test('element viewportIsTarget focused', () => {
      document.body.innerHTML = '<div tabindex="123"></div>';
      const target = document.body.firstElementChild as HTMLElement;
      target.focus();

      const { elements } = createStructureSetupElementsProxy({
        target,
        elements: {
          viewport: target,
        },
      });
      expect(elements._viewport.getAttribute('tabindex')).toBe('123');
      expect(elements._host.getAttribute('tabindex')).toBe('123');
      expect(document.activeElement).toBe(elements._viewport);
    });

    test('element viewportIsTarget not focused', () => {
      document.body.innerHTML = '<div></div>';
      const target = document.body.firstElementChild as HTMLElement;
      const originalFocus = document.activeElement;

      const { elements } = createStructureSetupElementsProxy({
        target,
        elements: {
          viewport: target,
        },
      });
      expect(elements._viewport.getAttribute('tabindex')).toBe(null);
      expect(elements._host.getAttribute('tabindex')).toBe(null);
      expect(document.activeElement).toBe(originalFocus);
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
