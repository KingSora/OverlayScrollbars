import { each } from 'core/utils/arrays';

const elementIsVisible: (elm: HTMLElement) => boolean = (elm) => {
    return !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
}

export const find: (selector: string, elm?: Element | null) => ReadonlyArray<Element> = (selector, elm?) => {
    const arr: Array<Element> = [];

    each((elm || document).querySelectorAll(selector), (e: Element) => {
        arr.push(e);
    });

    return arr;
}

export const findFirst: (selector: string, elm?: Element | null) => Element | null = (selector, elm?) => {
    return (elm || document).querySelector(selector);
}

export const is: (elm: Element | null, selector: string) => boolean = (elm, selector) => {
    if (elm) {
        if (selector === ':visible')
            return elementIsVisible(elm as HTMLElement);
        if (selector === ':hidden')
            return !elementIsVisible(elm as HTMLElement);
        if (elm.matches(selector))
            return true;
    }
    return false;
}

export const children: (elm: Element | null, selector?: string) => ReadonlyArray<Element> = (elm, selector?) => {
    const children: Array<Element> = [];

    each(elm && elm.children, (child: Element) => {
        if (selector) {
            if (child.matches(selector))
                children.push(child);
        }
        else
            children.push(child);
    });

    return children;
}

export const contents: (elm: Element | null) => ReadonlyArray<ChildNode> = (elm) => {
    return elm ? Array.from<ChildNode>(elm.childNodes) : [];
}

export const parent: (elm: Node | null) => Node | null = (elm) => elm ? elm.parentElement : null;