import { describe, test, beforeEach, expect } from 'vitest';
import { each } from '../../../../src/support/utils';
import { createDiv, createDOM } from '../../../../src/support/dom/create';

const slotElm = document.body;
const testHTML =
  '<div id="parent" class="parent-class"><div id="child" class="child-class"></div></div><p>2</p><input type="text" value="3"></input>';

describe('dom create', () => {
  beforeEach(() => {
    slotElm.innerHTML = '';
  });

  describe('createDiv', () => {
    test('correct element tag', () => {
      const createdDiv = createDiv();
      expect(createdDiv.tagName.toLowerCase()).toBe('div');
    });

    test('no class names', () => {
      const createdDiv = createDiv();
      expect(createdDiv.classList.length).toBe(0);
    });

    test('no style', () => {
      const createdDiv = createDiv();
      expect(createdDiv.style.length).toBe(0);
    });

    test('not in document', () => {
      const createdDiv = createDiv();
      expect(createdDiv.parentElement).toBe(null);
    });

    test('with class names', () => {
      const createdDiv = createDiv('a b c');
      expect(createdDiv.classList.length).toBe(3);
    });
  });

  describe('createDOM', () => {
    test('correct elements length', () => {
      const dom = createDOM(testHTML);
      expect(dom.length).toBe(3);
    });

    test('elements arent child of any element', () => {
      const dom = createDOM(testHTML);
      each(dom, (elm) => {
        expect(elm.parentElement).toBe(null);
      });
    });

    test('elements are created correctly', () => {
      const dom = createDOM(testHTML);
      each(dom, (elm) => {
        slotElm.append(elm);
      });
      const parentElm = slotElm.querySelector('#parent');
      const childElm = slotElm.querySelector('#child');
      const pElm = slotElm.querySelector('p');
      const inputElm = slotElm.querySelector('input');

      expect(parentElm).toBeDefined();
      expect(childElm).toBeDefined();
      expect(pElm).toBeDefined();
      expect(inputElm).toBeDefined();

      expect(parentElm?.parentElement).toBe(slotElm);
      expect(pElm?.parentElement).toBe(slotElm);
      expect(inputElm?.parentElement).toBe(slotElm);
      expect(childElm?.parentElement).toBe(parentElm);

      expect(parentElm?.classList.contains('parent-class')).toBeTruthy();
      expect(childElm?.classList.contains('child-class')).toBeTruthy();
      expect(pElm?.textContent).toBe('2');
      expect(inputElm?.value).toBe('3');
      expect(inputElm?.getAttribute('type')).toBe('text');
    });
  });
});
