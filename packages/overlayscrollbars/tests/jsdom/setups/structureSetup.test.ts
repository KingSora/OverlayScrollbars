import { createStructureSetup, StructureSetup } from 'setups/structureSetup';

const textareaId = 'textarea';
const textareaHostId = 'host';
const elementId = 'target';
const dynamicContent = 'text<p>paragraph</p>';
const textareaContent = `<textarea id="${textareaId}">text</textarea>`;
const getSnapshot = () => document.body.innerHTML;
const getTarget = (textarea?: boolean) => document.getElementById(textarea ? textareaId : elementId)!;
const fillBody = (textarea?: boolean, customDOM?: (content: string, hostId: string) => string) => {
  document.body.innerHTML = `
    <nav></nav>
    ${
      customDOM
        ? customDOM(textarea ? textareaContent : dynamicContent, textarea ? textareaHostId : elementId)
        : textarea
        ? textareaContent
        : `<div id="${elementId}">${dynamicContent}</div>`
    }
    <footer></footer>
  `;
  return getSnapshot();
};
const clearBody = () => {
  document.body.innerHTML = '';
};

const getElements = (textarea?: boolean) => {
  const target = getTarget(textarea);
  const host = document.querySelector('.os-host')!;
  const padding = document.querySelector('.os-padding')!;
  const viewport = document.querySelector('.os-viewport')!;
  const content = document.querySelector('.os-content')!;

  return {
    target,
    host,
    padding,
    viewport,
    content,
  };
};

const assertCorrectDOMStructure = (textarea?: boolean) => {
  const { target, host, padding, viewport, content } = getElements(textarea);

  expect(host).toBeTruthy();
  expect(viewport).toBeTruthy();
  expect(viewport.parentElement).toBe(padding || host);

  if (content) {
    expect(content.parentElement).toBe(viewport);
  }
  if (padding) {
    expect(padding.parentElement).toBe(host);
  }

  expect(host.parentElement).toBe(document.body);
  expect(host.previousElementSibling).toBe(document.querySelector('nav'));
  expect(host.nextElementSibling).toBe(document.querySelector('footer'));

  const contentElm = content || viewport;
  if (textarea) {
    expect(target.parentElement).toBe(contentElm);
    expect(contentElm.innerHTML).toBe(textareaContent);
  } else {
    expect(target).toBe(host);
    expect(contentElm.innerHTML).toBe(dynamicContent);
  }
};

const assertCorrectSetup = (textarea: boolean, setup: StructureSetup) => {
  const { _targetObj, _targetCtx, _destroy } = setup;
  const { _target, _host, _padding, _viewport, _content } = _targetObj;
  const { target, host, padding, viewport, content } = getElements(textarea);
  const isTextarea = target.matches('textarea');
  const isBody = target.matches('body');

  expect(textarea).toBe(isTextarea);

  expect(_target).toBe(target);
  expect(_host).toBe(host);

  if (padding || _padding) {
    expect(_padding).toBe(padding);
  } else {
    expect(padding).toBeFalsy();
    expect(_padding).toBeFalsy();
  }

  if (viewport || _viewport) {
    expect(_viewport).toBe(viewport);
  } else {
    expect(viewport).toBeFalsy();
    expect(_viewport).toBeFalsy();
  }

  if (content || _content) {
    expect(_content).toBe(content);
  } else {
    expect(content).toBeFalsy();
    expect(_content).toBeFalsy();
  }

  const { _isTextarea, _isBody, _bodyElm, _htmlElm, _documentElm, _windowElm } = _targetCtx;

  expect(_isTextarea).toBe(isTextarea);
  expect(_isBody).toBe(isBody);
  expect(_windowElm).toBe(document.defaultView);
  expect(_documentElm).toBe(document);
  expect(_htmlElm).toBe(document.body.parentElement);
  expect(_bodyElm).toBe(document.body);

  expect(typeof _destroy).toBe('function');

  return setup;
};

const assertCorrectDestroy = (snapshot: string, setup: StructureSetup) => {
  const { _destroy } = setup;

  _destroy();

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

describe('structureSetup', () => {
  afterEach(() => clearBody());

  [false, true].forEach((isTextarea) => {
    describe(isTextarea ? 'textarea' : 'element', () => {
      describe('basic', () => {
        test('Element', () => {
          const snapshot = fillBody(isTextarea);
          const setup = assertCorrectSetup(isTextarea, createStructureSetup(getTarget(isTextarea)));
          assertCorrectDOMStructure(isTextarea);
          assertCorrectDestroy(snapshot, setup);
        });

        test('Object', () => {
          const snapshot = fillBody(isTextarea);
          const setup = assertCorrectSetup(isTextarea, createStructureSetup({ target: getTarget(isTextarea) }));
          assertCorrectDOMStructure(isTextarea);
          assertCorrectDestroy(snapshot, setup);
        });
      });

      describe('complex', () => {
        describe('single assigned', () => {
          test('padding', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                viewport: document.querySelector<HTMLElement>('#viewport')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="content">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });
        });

        describe('multiple assigned', () => {
          test('padding viewport content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding"><div id="viewport"><div id="content">${content}</div></div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('padding viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding"><div id="viewport">${content}</div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
                viewport: document.querySelector<HTMLElement>('#viewport')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('padding content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding"><div id="content">${content}</div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('viewport content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport"><div id="content">${content}</div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });
        });

        describe('single null', () => {
          test('padding', () => {
            const snapshot = fillBody(isTextarea);
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                target: getTarget(isTextarea),
                padding: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('content', () => {
            const snapshot = fillBody(isTextarea);
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                target: getTarget(isTextarea),
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });
        });

        describe('multiple null', () => {
          test('padding & content', () => {
            const snapshot = fillBody(isTextarea);
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                target: getTarget(isTextarea),
                padding: null,
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });
        });

        describe('mixed', () => {
          test('null: padding & content | assigned: viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: null,
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: padding | assigned: content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="content">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: null,
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: padding | assigned: viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: null,
                viewport: document.querySelector<HTMLElement>('#viewport')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: padding | assigned: viewport & content', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport"><div id="content">${content}</div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                padding: null,
                content: document.querySelector<HTMLElement>('#content')!,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: content | assigned: padding', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: content | assigned: viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="viewport">${content}</div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });

          test('null: content | assigned: padding & viewport', () => {
            const snapshot = fillBody(isTextarea, (content, hostId) => {
              return `<div id="${hostId}"><div id="padding"><div id="viewport">${content}</div></div></div>`;
            });
            const setup = assertCorrectSetup(
              isTextarea,
              createStructureSetup({
                host: document.querySelector<HTMLElement>('#host')!,
                target: getTarget(isTextarea),
                padding: document.querySelector<HTMLElement>('#padding')!,
                viewport: document.querySelector<HTMLElement>('#viewport')!,
                content: null,
              })
            );
            assertCorrectDOMStructure(isTextarea);
            assertCorrectDestroy(snapshot, setup);
          });
        });
      });
    });
  });
});
