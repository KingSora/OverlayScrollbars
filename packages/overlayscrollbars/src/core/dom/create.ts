import { each } from 'core/utils/array';
import { contents } from 'core/dom/traversal';
import { removeElements } from 'core/dom/manipulation';

export const createDiv = (): HTMLDivElement => document.createElement('div');

export const createDOM = (html: string): ReadonlyArray<Node> => {
  const createdDiv = createDiv();
  createdDiv.innerHTML = html.trim();

  return each(contents(createdDiv), (elm) => removeElements(elm));
};
