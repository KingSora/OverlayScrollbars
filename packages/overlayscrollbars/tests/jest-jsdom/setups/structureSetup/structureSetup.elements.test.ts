import { hasClass, is, isFunction, isHTMLElement } from 'support';
import {
  dataAttributeHost,
  classNamePadding,
  classNameViewport,
  classNameContent,
} from 'classnames';
import { getEnvironment, InternalEnvironment } from 'environment';
import {
  createStructureSetupElements,
  StructureSetupElementsObj,
} from 'setups/structureSetup/structureSetup.elements';
import { addPlugin, scrollbarsHidingPlugin } from 'plugins';
import type {
  Initialization,
  InitializationTarget,
  InitializationTargetObject,
} from 'initialization';

jest.mock('environment', () => ({
  getEnvironment: jest.fn(),
}));

addPlugin(scrollbarsHidingPlugin);

interface StructureSetupElementsProxy {
  input: InitializationTarget;
  elements: StructureSetupElementsObj;
  destroy: () => void;
}

type TargetType = 'element' | 'textarea' | 'body';
type StructureStaticInitializationElement = Initialization['elements']['viewport'];
type StructureDynamicInitializationElement = Initialization['elements']['content'];

const textareaId = 'textarea';
const textareaHostId = 'host';
const elementId = 'target';
const dynamicContent = 'text<p>paragraph</p>';
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
  const customDomResult =
    customDOM &&
    customDOM(textarea ? textareaContent : dynamicContent, textarea ? textareaHostId : elementId);
  const normalDom = textarea ? textareaContent : `<div id="${elementId}">${dynamicContent}</div>`;
  document.body.innerHTML =
    targetType === 'body'
      ? dynamicContent
      : `
    <nav></nav>
    ${customDomResult || normalDom}
    <footer></footer>
  `;
  return getSnapshot();
};
const clearBody = () => {
  document.body.outerHTML = '';
};

const getElements = (targetType: TargetType) => {
  const target = getTarget(targetType);
  const host = document.querySelector(`[${dataAttributeHost}]`)!;
  const padding = document.querySelector(`.${classNamePadding}`)!;
  const viewport = document.querySelector(`.${classNameViewport}`)!;
  const content = document.querySelector(`.${classNameContent}`)!;

  return {
    target,
    host,
    padding,
    viewport,
    content,
  };
};

const assertCorrectDOMStructure = (targetType: TargetType, viewportIsTarget: boolean) => {
  const { target, host, padding, viewport, content } = getElements(targetType);

  if (viewportIsTarget) {
    expect(target).toBe(host);
    expect(host).toBeTruthy();
    expect(padding).toBeFalsy();
    expect(viewport).toBeFalsy();
    expect(content).toBeFalsy();
  } else {
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
      expect(contentElm.innerHTML).toBe(dynamicContent);
    }
  }
};

const createStructureSetupElementsProxy = (
  target: InitializationTarget
): StructureSetupElementsProxy => {
  const [elements, appendElements, destroy] = createStructureSetupElements(target);
  appendElements();
  return {
    input: target,
    elements,
    destroy,
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
    expect(_viewport).toBe(_target);
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
    host: hostInitStrategy,
    viewport: viewportInitStrategy,
    padding: paddingInitStrategy,
    content: contentInitStrategy,
  } = defaultInitElements;
  const inputIsElement = isHTMLElement(input);
  const inputAsObj = input as InitializationTargetObject;
  const styleElm = document.querySelector('style');
  const checkStrategyDependendElements = (
    elm: Element | null,
    inputStrategy:
      | StructureStaticInitializationElement
      | StructureDynamicInitializationElement
      | undefined,
    isStaticStrategy: boolean,
    strategy: StructureStaticInitializationElement | StructureDynamicInitializationElement,
    kind: 'padding' | 'viewport' | 'content' | 'host'
  ) => {
    const resolvedInputStrategy = isFunction(inputStrategy) ? inputStrategy(target) : inputStrategy;
    if (resolvedInputStrategy) {
      if (!_viewportIsTarget) {
        expect(elm).toBeTruthy();
      }
    } else {
      if (resolvedInputStrategy === false) {
        expect(elm).toBeFalsy();
      }
      if (resolvedInputStrategy === undefined) {
        if (isStaticStrategy) {
          strategy = strategy as StructureStaticInitializationElement;
          const resultingStrategy = typeof strategy === 'function' ? strategy(target) : strategy;
          if (_viewportIsTarget) {
            if (kind === 'host') {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resultingStrategy && !isTextarea) {
            expect(resultingStrategy).toBe(elm);
          } else {
            expect(elm).toBeTruthy();
          }
        } else {
          strategy = strategy as StructureDynamicInitializationElement;
          const resultingStrategy = typeof strategy === 'function' ? strategy(target) : strategy;
          const resultIsBoolean = typeof resultingStrategy === 'boolean';
          if (_viewportIsTarget) {
            if (kind === 'host') {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resultIsBoolean) {
            if (resultingStrategy) {
              expect(elm).toBeTruthy();
            } else {
              expect(elm).toBeFalsy();
            }
          } else if (resultingStrategy) {
            expect(elm).toBe(resultingStrategy);
          }
        }
      }
    }
  };

  if (_nativeScrollbarsHiding || _cssCustomProperties) {
    expect(styleElm).toBeFalsy();
  } else {
    expect(styleElm).toBeTruthy();
  }

  if (inputIsElement) {
    checkStrategyDependendElements(padding, undefined, false, paddingInitStrategy, 'padding');
    checkStrategyDependendElements(content, undefined, false, contentInitStrategy, 'content');
    checkStrategyDependendElements(viewport, undefined, true, viewportInitStrategy, 'viewport');
    checkStrategyDependendElements(host, undefined, true, hostInitStrategy, 'host');
  } else {
    const { elements: inputElements } = inputAsObj;
    const {
      padding: inputPadding,
      content: inputContent,
      viewport: inputViewport,
      host: inputHost,
    } = inputElements || {};
    checkStrategyDependendElements(padding, inputPadding, false, paddingInitStrategy, 'padding');
    checkStrategyDependendElements(content, inputContent, false, contentInitStrategy, 'content');
    checkStrategyDependendElements(viewport, inputViewport, true, viewportInitStrategy, 'viewport');
    checkStrategyDependendElements(host, inputHost, true, hostInitStrategy, 'host');
  }

  const className = 'clazz';
  const attrName = 'attr';

  _viewportAddRemoveClass(className, attrName, true);
  if (_viewportIsTarget) {
    expect(_host.getAttribute(dataAttributeHost)!.indexOf(attrName) >= 0).toBe(true);
    expect(_viewportHasClass('', attrName)).toBe(true);
  } else {
    expect(hasClass(_viewport, className)).toBe(true);
    expect(_viewportHasClass(className, '')).toBe(true);
  }
  _viewportAddRemoveClass(className, attrName);
  if (_viewportIsTarget) {
    expect(_host.getAttribute(dataAttributeHost)!.indexOf(attrName) >= 0).toBe(false);
    expect(_viewportHasClass('', attrName)).toBe(false);
  } else {
    expect(hasClass(_viewport, className)).toBe(false);
    expect(_viewportHasClass(className, '')).toBe(false);
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

  expect(snapshot).toBe(getSnapshot());
};

const env: InternalEnvironment = jest.requireActual('environment').getEnvironment();
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
      jest.requireActual('environment').getEnvironment()
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
              assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
              assertCorrectDestroy(snapshot, destroy);
            });

            test('Object', () => {
              const snapshot = fillBody(targetType);
              const [elements, destroy] = assertCorrectSetupElements(
                targetType,
                createStructureSetupElementsProxy({ target: getTarget(targetType) }),
                currEnv
              );
              assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: () => document.querySelector<HTMLElement>('#host'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: () => document.querySelector<HTMLElement>('#host'),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: true,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: () => false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: true,
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: false,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: true,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: () => false,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: true,
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      padding: false,
                      content: () => document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      padding: true,
                      content: document.querySelector<HTMLElement>('#content'),
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: () => document.querySelector<HTMLElement>('#host'),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: document.querySelector<HTMLElement>('#host'),
                      padding: () => document.querySelector<HTMLElement>('#padding'),
                      viewport: document.querySelector<HTMLElement>('#viewport'),
                      content: () => false,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
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
                      host: () => document.querySelector<HTMLElement>('#host'),
                      padding: document.querySelector<HTMLElement>('#padding'),
                      viewport: () => document.querySelector<HTMLElement>('#viewport'),
                      content: true,
                    },
                  }),
                  currEnv
                );
                assertCorrectDOMStructure(targetType, elements._viewportIsTarget);
                assertCorrectDestroy(snapshot, destroy);
              });
            });
          });
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

        const { elements } = createStructureSetupElementsProxy(target);
        expect(elements._viewport.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(elements._viewport);

        elements._documentElm.dispatchEvent(new Event('keydown'));

        expect(elements._viewport.getAttribute('tabindex')).toBe(null);
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
});
