import { each } from 'support/utils/array';
import { contents } from 'support/dom/traversal';
import { removeElements } from 'support/dom/manipulation';

export const createDiv = (): HTMLDivElement => document.createElement('div');

export const createDOM = (html: string): ReadonlyArray<Node> => {
  const createdDiv = createDiv();
  createdDiv.innerHTML = html.trim();

  return each(contents(createdDiv), (elm) => removeElements(elm));
};
