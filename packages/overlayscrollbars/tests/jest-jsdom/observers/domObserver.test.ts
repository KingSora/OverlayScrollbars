import { createDOMObserver } from '~/observers';

jest.useFakeTimers();

jest.mock('~/support/compatibility/apis', () => {
  const originalModule = jest.requireActual('~/support/compatibility/apis');
  const mockRAF = (arg: any) => setTimeout(arg, 0);
  return {
    ...originalModule,
    // @ts-ignore
    rAF: jest.fn().mockImplementation((...args) => mockRAF(...args)),
    // @ts-ignore
    cAF: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
    // @ts-ignore
    setT: jest.fn().mockImplementation((...args) => setTimeout(...args)),
    // @ts-ignore
    clearT: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
  };
});

describe('createDOMObserver', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });

  describe('target observer', () => {
    test('basic functionality', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, false, callback, {
        _attributes: ['style', 'class', 'id'],
        _styleChangingAttributes: ['id'],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      document.body.style.width = '100px';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith(['style'], false);

      document.body.classList.add('test');
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(['class'], false);

      document.body.id = 'test';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith(['id'], true);

      document.body.style.width = '';
      document.body.classList.remove('test');
      document.body.id = '';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenLastCalledWith(['style', 'class', 'id'], true);

      document.body.setAttribute('data-something', 'hi');
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);

      div.style.width = '100px';
      div.classList.add('test');
      div.id = 'test';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);

      div.append(document.createElement('div'));
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);

      div.remove();
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);
    });

    test('update', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const [destroy, update] = createDOMObserver(document.body, false, callback, {
        _attributes: ['style', 'class', 'id'],
        _styleChangingAttributes: ['data-stylechanged'],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      document.body.style.width = '100px';
      document.body.classList.add('test');
      document.body.id = 'test';
      document.body.classList.add('test2');
      const [changedAttrs, styleChanged] = update() as any;

      expect(changedAttrs).toEqual(['style', 'class', 'id']);
      expect(styleChanged).toEqual(false);

      document.body.setAttribute('data-stylechanged', 'true');
      document.body.id = '';

      const [changedAttrs2, styleChanged2] = update() as any;

      expect(changedAttrs2).toEqual(['data-stylechanged', 'id']);
      expect(styleChanged2).toEqual(true);

      document.body.removeAttribute('data-stylechanged');
      document.body.id = 'something';
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(1);
      const changed = update();
      expect(changed).toBeFalsy();
    });

    test('destroy', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, false, callback, {
        _attributes: ['style', 'class', 'id'],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      document.body.style.width = '100px';
      document.body.classList.add('test');
      document.body.id = 'test';
      document.body.classList.add('test2');
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith(['style', 'class', 'id'], false);

      destroy();

      document.body.style.width = '';
      document.body.classList.remove('test');
      document.body.id = '';
      document.body.setAttribute('data-something', 'hi');
      div.append(document.createElement('div'));
      div.remove();
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(update()).toBeFalsy();
      expect(destroy()).toBeUndefined();
    });
  });

  describe('content observer', () => {
    test('basic functionality', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, true, callback, {
        _attributes: ['style', 'class', 'id'],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      document.body.style.width = '100px';
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      document.body.classList.add('test');
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      document.body.id = 'test';
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      document.body.setAttribute('data-something', 'hi');
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      div.style.width = '100px';
      div.classList.add('test');
      div.id = 'test';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(false);

      div.append(document.createElement('div'));
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(false);

      document.body.append(document.createElement('div'));
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(false);

      div.remove();
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith(false);
    });

    test('ignoreContentChange', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const ignoreContentChange = jest.fn(() => true);
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, true, callback, {
        _attributes: ['style', 'class', 'id'],
        _ignoreContentChange: ignoreContentChange,
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();
      expect(ignoreContentChange).not.toHaveBeenCalled();

      div.style.width = '100px';
      await Promise.resolve();
      expect(ignoreContentChange).toHaveBeenCalledTimes(1);
      expect(callback).not.toHaveBeenCalled();

      div.classList.add('test');
      div.id = 'test';
      await Promise.resolve();
      expect(ignoreContentChange).toHaveBeenCalledTimes(3);
      expect(callback).not.toHaveBeenCalled();

      div.append(document.createElement('div'));
      await Promise.resolve();
      expect(ignoreContentChange).toHaveBeenCalledTimes(4);
      expect(callback).not.toHaveBeenCalled();

      document.body.append(document.createElement('div'));
      await Promise.resolve();
      expect(ignoreContentChange).toHaveBeenCalledTimes(5);
      expect(callback).not.toHaveBeenCalled();

      div.remove();
      await Promise.resolve();
      expect(ignoreContentChange).toHaveBeenCalledTimes(6);
      expect(callback).not.toHaveBeenCalled();
    });

    test('eventContentChange', async () => {
      document.body.innerHTML = '<div></div><p></p>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, true, callback, {
        _attributes: ['style', 'class', 'id'],
        _eventContentChange: [
          ['*', 'click'],
          ['*', 'keydown'],
          ['span', 'transitionend animationend'],
        ],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      const appendedDiv = document.createElement('div');
      appendedDiv.append(span);
      div.append(appendedDiv);
      div.append(paragraph);
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith(false);

      div.dispatchEvent(new Event('click'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(true);

      div.dispatchEvent(new Event('keydown'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith(true);

      paragraph.dispatchEvent(new Event('click'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenLastCalledWith(true);

      paragraph.dispatchEvent(new Event('keydown'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenLastCalledWith(true);

      // debounced to one update
      div.dispatchEvent(new Event('click'));
      div.dispatchEvent(new Event('keydown'));
      paragraph.dispatchEvent(new Event('click'));
      paragraph.dispatchEvent(new Event('keydown'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(6);
      expect(callback).toHaveBeenLastCalledWith(true);

      span.dispatchEvent(new Event('click'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(7);
      expect(callback).toHaveBeenLastCalledWith(true);

      span.dispatchEvent(new Event('transitionend'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(8);
      expect(callback).toHaveBeenLastCalledWith(true);

      span.dispatchEvent(new Event('animationend'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(9);
      expect(callback).toHaveBeenLastCalledWith(true);

      span.dispatchEvent(new Event('transitionend'));
      span.dispatchEvent(new Event('animationend'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(10);
      expect(callback).toHaveBeenLastCalledWith(true);

      appendedDiv.dispatchEvent(new Event('click'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(11);
      expect(callback).toHaveBeenLastCalledWith(true);

      // remove from target and trigger events from new location
      document.body.parentElement!.append(appendedDiv);
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(12);
      expect(callback).toHaveBeenLastCalledWith(false);

      span.dispatchEvent(new Event('transitionend'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(12);

      appendedDiv.dispatchEvent(new Event('click'));
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(12);
    });

    test('update', async () => {
      document.body.innerHTML = '<div></div>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, true, callback, {
        _attributes: ['style', 'class', 'id'],
        _eventContentChange: [
          ['*', 'click'],
          ['*', 'keydown'],
          ['span', 'transitionend animationend'],
        ],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      div.style.width = '100px';
      div.classList.add('test');
      div.id = 'test';

      const [contentChangedThroughEvent] = update() as any;
      expect(contentChangedThroughEvent).toBe(false);

      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      const appendedDiv = document.createElement('div');
      appendedDiv.append(span);
      div.append(appendedDiv);
      div.append(paragraph);

      const [contentChangedThroughEvent2] = update() as any;
      expect(contentChangedThroughEvent2).toBe(false);

      expect(callback).not.toHaveBeenCalled();

      div.dispatchEvent(new Event('click'));
      div.dispatchEvent(new Event('keydown'));

      expect(callback).not.toHaveBeenCalled();

      const change = update();
      expect(change).toBeFalsy();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('destroy', async () => {
      document.body.innerHTML = '<div></div><p></p>';
      const callback = jest.fn();
      const div = document.body.firstElementChild as HTMLElement;
      const [destroy, update] = createDOMObserver(document.body, true, callback, {
        _attributes: ['style', 'class', 'id'],
        _eventContentChange: [
          ['*', 'click'],
          ['*', 'keydown'],
          ['span', 'transitionend animationend'],
        ],
      });

      expect(destroy).toEqual(expect.any(Function));
      expect(update).toEqual(expect.any(Function));

      expect(callback).not.toHaveBeenCalled();

      div.style.width = '100px';
      div.classList.add('test');
      div.id = 'test';
      await Promise.resolve();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(false);

      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      const appendedDiv = document.createElement('div');
      appendedDiv.append(span);
      div.append(appendedDiv);
      div.append(paragraph);
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(false);

      destroy();

      div.dispatchEvent(new Event('click'));
      div.dispatchEvent(new Event('keydown'));
      paragraph.dispatchEvent(new Event('click'));
      paragraph.dispatchEvent(new Event('keydown'));
      span.dispatchEvent(new Event('click'));
      span.dispatchEvent(new Event('transitionend'));
      span.dispatchEvent(new Event('animationend'));
      appendedDiv.dispatchEvent(new Event('click'));
      document.body.parentElement!.append(appendedDiv);

      jest.runAllTimers();
      await Promise.resolve();

      expect(callback).toHaveBeenCalledTimes(2);

      span.dispatchEvent(new Event('transitionend'));
      appendedDiv.dispatchEvent(new Event('click'));
      div.style.width = '100px';
      div.classList.add('test');
      div.id = 'test';
      await Promise.resolve();
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(update()).toBeFalsy();
      expect(destroy()).toBeUndefined();
    });
  });
});
