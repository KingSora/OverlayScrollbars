import { isString, isNumber, isUndefined } from 'core/utils/types';

type cssStyleObj = { [key: string]: string | number };

const cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
};

const setCSSVal: (elm: HTMLElement, prop: string, val: string | number) => void = (elm, prop, val) => {
    try {
        if (elm.style[prop] !== undefined) {
            elm.style[prop] = parseCSSVal(prop, val);
        }
    } catch (e) { }
}

const parseCSSVal: (prop: string, val: string | number) => string | number = (prop, val) => {
    return !cssNumber[prop.toLowerCase()] && isNumber(val) ? val + 'px' : val;
}

export function style(elm: HTMLElement, styles: string | cssStyleObj): string;
export function style(elm: HTMLElement, styles: string | cssStyleObj, val: string | number): void;
export function style(elm: HTMLElement, styles: string | cssStyleObj, val?: string | number): string | void {
    const getCptStyle: Function = window.getComputedStyle;

    if (isString(styles)) {
        if (isUndefined(val)) {
            const cptStyle: CSSStyleDeclaration = getCptStyle(elm, null);

            //https://bugzilla.mozilla.org/show_bug.cgi?id=548397 can be null sometimes if iframe with display: none (firefox only!)
            return cptStyle != null ? cptStyle.getPropertyValue(styles) : elm.style[styles];
        }
        else {
            setCSSVal(elm, styles, val);
        }
    }
    else {
        for (const key in styles)
            setCSSVal(elm, key, styles[key]);
    }
}

export const hide: (elm: HTMLElement) => void = (elm) => {
    elm.style.display = 'none';
}

export const show: (elm: HTMLElement) => void = (elm) => {
    elm.style.display = 'block';
}

