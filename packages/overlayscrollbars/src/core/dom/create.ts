import { each } from 'core/utils/arrays';
import { contents } from 'core/dom/traversal';
import { removeElements } from 'core/dom/manipulation';

export const createDiv: () => HTMLDivElement = () => {
    return document.createElement('div');
}

export const createDOM: (html: string) => ReadonlyArray<Node> = (html) => {
    const elm = createDiv();
    elm.innerHTML = html.trim();

    return each(contents(elm), (elm) => removeElements(elm));
}