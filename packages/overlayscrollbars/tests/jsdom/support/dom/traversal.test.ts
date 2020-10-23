import { find, findFirst, is, children, contents, parent, createDiv } from 'support/dom';

const slotElm = document.body;
const testHTML = '<div id="parent" class="div-class"><div id="child" class="div-class"></div></div><p>2</p><input type="text" value="3"></input>abc';

describe('dom traversal', () => {
  beforeEach(() => {
    slotElm.innerHTML = testHTML;
  });
  afterEach(() => {
    slotElm.innerHTML = '';
  });

  describe('find', () => {
    test('by class', () => {
      const divClass = find('.div-class');

      expect(divClass.length).toBe(2);
      expect(divClass[1].parentElement).toBe(divClass[0]);
    });

    test('by id', () => {
      const parentId = find('#parent');

      expect(parentId.length).toBe(1);
      expect(parentId[0]).toBe(document.querySelector('#parent'));
    });

    test('all', () => {
      const all = find('*');
      const allNative = document.querySelectorAll('*');

      expect(all.length).toBe(allNative.length);
      expect(Array.from(all)).toEqual(Array.from(allNative));
    });

    test('all with defined parent', () => {
      const all = find('*', document.querySelector('#parent'));
      const allNative = document.querySelector('#parent')?.querySelectorAll('*');

      expect(all.length).toBe(allNative?.length);
      expect(Array.from(all)).toEqual(Array.from(allNative!));
    });

    test('all with null parent', () => {
      const all = find('*', null);
      const allNative = document.querySelectorAll('*');

      expect(all.length).toBe(allNative.length);
      expect(Array.from(all)).toEqual(Array.from(allNative));
    });

    test('non-existent', () => {
      const nonExistent = find('#non-existent');

      expect(nonExistent.length).toBe(0);
    });
  });

  describe('findFirst', () => {
    test('by class', () => {
      const divClass = findFirst('.div-class');

      expect(divClass).toBe(document.querySelector('.div-class'));
    });

    test('by id', () => {
      const parentId = findFirst('#parent');

      expect(parentId).toBe(document.querySelector('#parent'));
    });

    test('all', () => {
      const all = findFirst('*');
      const allNative = document.querySelector('*');

      expect(all).toBe(allNative);
    });

    test('all with defined parent', () => {
      const all = findFirst('*', document.querySelector('#parent'));
      const allNative = document.querySelector('#parent')?.querySelector('*');

      expect(all).toBe(allNative);
    });

    test('all with null parent', () => {
      const all = findFirst('*', null);
      const allNative = document.querySelector('*');

      expect(all).toBe(allNative);
    });

    test('non-existent', () => {
      const nonExistent = findFirst('#non-existent');

      expect(nonExistent).toBe(null);
    });
  });

  describe('is', () => {
    test('tag', () => {
      expect(is(findFirst('input'), 'input')).toBe(true);
      expect(is(findFirst('body'), 'body')).toBe(true);
      expect(is(findFirst('div'), 'div')).toBe(true);

      expect(is(findFirst('input'), 'body')).toBe(false);
      expect(is(findFirst('body'), 'input')).toBe(false);
      expect(is(findFirst('div'), 'head')).toBe(false);
    });

    test('id', () => {
      expect(is(findFirst('#parent'), '#parent')).toBe(true);
      expect(is(findFirst('#child'), '#parent')).toBe(false);
    });

    test('class', () => {
      expect(is(findFirst('.div-class'), '.div-class')).toBe(true);
      expect(is(findFirst('.div-class'), '.other-class')).toBe(false);
    });

    test('created', () => {
      const div = createDiv();
      expect(div.parentNode).toBeNull();

      expect(is(div, 'div')).toBe(true);

      expect(is(div, 'body')).toBe(false);
      expect(is(div, 'input')).toBe(false);
      expect(is(div, 'head')).toBe(false);

      expect(is(div, '#parent')).toBe(false);
      expect(is(div, '#parent')).toBe(false);

      expect(is(div, '.div-class')).toBe(false);
      expect(is(div, '.other-class')).toBe(false);
    });

    test('none', () => {
      expect(is(null, 'body')).toBe(false);
      expect(is(null, 'input')).toBe(false);
      expect(is(null, 'head')).toBe(false);

      expect(is(null, '#parent')).toBe(false);
      expect(is(null, '#parent')).toBe(false);

      expect(is(null, '.div-class')).toBe(false);
      expect(is(null, '.other-class')).toBe(false);
    });
  });

  describe('children', () => {
    test('available element', () => {
      const childs = children(document.body);

      expect(childs.length).toBe(document.body.children.length);
      expect(childs).toEqual(Array.from(document.body.children));
    });

    test('unavailable element', () => {
      const childs = children(null);

      expect(childs.length).toEqual(0);
    });

    test('with selector', () => {
      const childs = children(document.body, 'input');

      expect(childs.length).toBe(1);
      expect(childs[0]).toBe(findFirst('input'));
    });
  });

  describe('contents', () => {
    test('available element', () => {
      const childs = contents(document.body);

      expect(childs.length).toBe(document.body.childNodes.length);
      expect(childs).toEqual(Array.from(document.body.childNodes));
    });

    test('unavailable element', () => {
      const childs = contents(null);

      expect(childs.length).toEqual(0);
    });
  });

  describe('parent', () => {
    test('available element', () => {
      const p = parent(document.body);

      expect(p).toBe(document.body.parentElement);
    });

    test('unavailable element', () => {
      const p = parent(null);

      expect(p).toBeNull();
    });
  });
});
