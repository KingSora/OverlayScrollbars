import { each } from '../utils/array';
import { setAttrs } from './attribute';
import { contents } from './traversal';
import { removeElements } from './manipulation';
import { getTrustedTypePolicy } from '../../trustedTypePolicy';

/**
 * Creates a div DOM node.
 */
export const createDiv = (classNames?: string): HTMLDivElement => {
  const div = document.createElement('div');
  setAttrs(div, 'class', classNames);
  return div;
};

/**
 * Creates DOM nodes modeled after the passed html string and returns the root dom nodes as a array.
 * @param html The html string after which the DOM nodes shall be created.
 */
export const createDOM = (html: string): ReadonlyArray<Node> => {
  const createdDiv = createDiv();
  const trustedTypesPolicy = getTrustedTypePolicy();
  const trimmedHtml = html.trim();
  createdDiv.innerHTML = trustedTypesPolicy
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (trustedTypesPolicy as any).createHTML(trimmedHtml)
    : trimmedHtml;

  return each(contents(createdDiv), (elm) => removeElements(elm));
};
