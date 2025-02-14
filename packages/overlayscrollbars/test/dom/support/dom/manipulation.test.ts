import { describe, test, beforeEach, afterEach, expect } from 'vitest';
import {
  createDiv,
  contents,
  appendChildren,
  removeElements,
  parent,
} from '../../../../src/support/dom';
import { each, isArray, isHTMLElement } from '../../../../src/support/utils';

const slotElm = document.body;
const fillSlotElm = () => {
  const content = [createDiv(), createDiv(), createDiv(), createDiv(), createDiv()];
  content.forEach((elm, i) => {
    elm.setAttribute('id', i.toString());
    slotElm.append(elm);
  });
};
const clearSlotElm = () => {
  contents(slotElm).forEach((elm) => {
    elm.remove();
  });
};
const compareToNative = (
  target: Node,
  method: string,
  snapshot: Array<Node>,
  elms: Element | Node | Array<Element> | Array<Node>,
  compareIds = false
) => {
  if (!compareIds) {
    if (!isArray(elms)) {
      elms = [elms];
    }
    elms.forEach((e) => {
      if (isHTMLElement(e)) {
        e.remove();
      }
    });
    (target as any)[method](...elms);
    expect(Array.from(slotElm.childNodes)).toEqual(snapshot);
  } else {
    clearSlotElm();
    fillSlotElm();

    if (!isArray(elms)) {
      elms = [elms];
    }

    const realElms: Array<Element> = [];
    elms.forEach((elm) => {
      slotElm.childNodes.forEach((child) => {
        if (isHTMLElement(child)) {
          if (isHTMLElement(elm) && child.getAttribute('id') === elm.getAttribute('id')) {
            realElms.push(child);
          }
          if (
            compareIds &&
            target !== slotElm &&
            isHTMLElement(target) &&
            child.getAttribute('id') === target.getAttribute('id')
          ) {
            target = child;
          }
        }
      });
    });

    (target as any)[method](...realElms);

    const mapIds = (elm: Node) => (isHTMLElement(elm) ? elm.getAttribute('id') || '' : '');
    const snapshotIdArr: Array<string> = snapshot.map(mapIds);
    const elmsIdArr: Array<string> = Array.from(slotElm.childNodes).map(mapIds);

    expect(JSON.stringify(elmsIdArr)).toEqual(JSON.stringify(snapshotIdArr));
  }
};

describe('dom manipulation', () => {
  beforeEach(() => fillSlotElm());
  afterEach(() => clearSlotElm());

  describe('appendChildren', () => {
    test('single created', () => {
      const createdDiv = createDiv();
      const { childNodes } = slotElm;
      const { length } = childNodes;

      const remove = appendChildren(slotElm, createdDiv);
      expect(typeof remove).toBe('function');
      expect(createdDiv).toBe(childNodes[childNodes.length - 1]);
      expect(childNodes.length).toBe(length + 1);

      compareToNative(slotElm, 'append', Array.from(childNodes), createdDiv);

      expect(parent(createdDiv)).not.toBe(null);
      remove();
      expect(parent(createdDiv)).toBe(null);
    });

    test('multiple created', () => {
      const createdDivs = [createDiv(), createDiv(), createDiv()];
      const { childNodes } = slotElm;
      const { length } = childNodes;

      const remove = appendChildren(slotElm, createdDivs);
      expect(typeof remove).toBe('function');
      expect(createdDivs[0]).toBe(childNodes[childNodes.length - 3]);
      expect(createdDivs[1]).toBe(childNodes[childNodes.length - 2]);
      expect(createdDivs[2]).toBe(childNodes[childNodes.length - 1]);
      expect(childNodes.length).toBe(length + createdDivs.length);

      compareToNative(slotElm, 'append', Array.from(childNodes), createdDivs);

      expect(parent(createdDivs[0])).not.toBe(null);
      expect(parent(createdDivs[1])).not.toBe(null);
      expect(parent(createdDivs[2])).not.toBe(null);
      remove();
      expect(parent(createdDivs[0])).toBe(null);
      expect(parent(createdDivs[1])).toBe(null);
      expect(parent(createdDivs[2])).toBe(null);
    });

    test('single existing', () => {
      const { childNodes } = slotElm;
      const elm = childNodes[1];

      const remove = appendChildren(slotElm, elm);
      expect(typeof remove).toBe('function');
      expect(elm).toBe(childNodes[childNodes.length - 1]);

      compareToNative(slotElm, 'append', Array.from(childNodes), elm, true);

      remove();
      expect(parent(elm)).toBe(null);
    });

    test('multiple existing', () => {
      const { childNodes } = slotElm;
      const elms = [childNodes[1], childNodes[0], childNodes[2]];

      const remove = appendChildren(slotElm, elms);
      expect(typeof remove).toBe('function');
      expect(elms[0]).toBe(childNodes[childNodes.length - 3]);
      expect(elms[1]).toBe(childNodes[childNodes.length - 2]);
      expect(elms[2]).toBe(childNodes[childNodes.length - 1]);

      compareToNative(slotElm, 'append', Array.from(childNodes), elms, true);

      remove();
      expect(parent(elms[0])).toBe(null);
      expect(parent(elms[1])).toBe(null);
      expect(parent(elms[2])).toBe(null);
    });

    test('none', () => {
      const { childNodes } = slotElm;
      const { length } = childNodes;

      const removeA = appendChildren(slotElm, null);
      const removeB = appendChildren(null, childNodes);

      expect(typeof removeA).toBe('function');
      expect(typeof removeB).toBe('function');

      removeA();
      removeB();

      expect(childNodes.length).toBe(length);
    });
  });

  describe('removeElm', () => {
    test('single created', () => {
      const createdDiv = createDiv();
      expect(createdDiv.parentElement).toBeNull();
      removeElements(createdDiv);
    });

    test('multiple created', () => {
      const createdDivs: Array<HTMLElement> = [createDiv(), createDiv(), createDiv(), createDiv()];
      each(createdDivs, (createdDiv: HTMLElement) => {
        expect(createdDiv.parentElement).toBeNull();
      });
      removeElements(createdDivs);
    });

    test('single existing', () => {
      const { childNodes } = slotElm;
      const { length } = childNodes;
      expect(length).not.toBe(0);
      removeElements(childNodes[0]);
      expect(childNodes.length).toBe(length - 1);
    });

    test('multiple existing', () => {
      const { childNodes } = slotElm;
      expect(childNodes.length).not.toBe(0);
      removeElements(childNodes);
      expect(childNodes.length).toBe(0);
    });

    test('none', () => {
      // @ts-ignore
      removeElements(null);
    });
  });
});
