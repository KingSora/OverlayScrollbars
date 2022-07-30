import { each } from '../utils/array';
import { contents } from './traversal';
import { removeElements } from './manipulation';

/**
 * Creates a div DOM node.
 */
export const createDiv = (classNames?: string): HTMLDivElement => {
  const div = document.createElement('div');
  if (classNames) {
    div.setAttribute('class', classNames);
  }
  return div;
};

/**
 * Creates DOM nodes modeled after the passed html string and returns the root dom nodes as a array.
 * @param html The html string after which the DOM nodes shall be created.
 */
export const createDOM = (html: string): ReadonlyArray<Node> => {
  const createdDiv = createDiv();
  createdDiv.innerHTML = html.trim();

  return each(contents(createdDiv), (elm) => removeElements(elm));
};
