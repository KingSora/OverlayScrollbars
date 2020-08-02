import { each } from 'core/utils/array';

const elementIsVisible = (elm: HTMLElement): boolean => !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);

export const find = (selector: string, elm?: Element | null): ReadonlyArray<Element> => {
  const arr: Array<Element> = [];

  each((elm || document).querySelectorAll(selector), (e: Element) => {
    arr.push(e);
  });

  return arr;
};

export const findFirst = (selector: string, elm?: Element | null): Element | null => (elm || document).querySelector(selector);

export const is = (elm: Element | null, selector: string): boolean => {
  if (elm) {
    if (selector === ':visible') {
      return elementIsVisible(elm as HTMLElement);
    }
    if (selector === ':hidden') {
      return !elementIsVisible(elm as HTMLElement);
    }
    if (elm.matches(selector)) {
      return true;
    }
  }
  return false;
};

export const children = (elm: Element | null, selector?: string): ReadonlyArray<Element> => {
  const childs: Array<Element> = [];

  each(elm && elm.children, (child: Element) => {
    if (selector) {
      if (child.matches(selector)) {
        childs.push(child);
      }
    } else {
      childs.push(child);
    }
  });

  return childs;
};

export const contents = (elm: Element | null): ReadonlyArray<ChildNode> => (elm ? Array.from<ChildNode>(elm.childNodes) : []);

export const parent = (elm: Node | null): Node | null => (elm ? elm.parentElement : null);
