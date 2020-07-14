import { createDiv, contents, appendChildren, prependChildren, insertBefore, insertAfter, removeElements } from 'core/dom';
import { each, isArray, isHTMLElement } from 'core/utils';

const slotElm = document.body;
const fillSlotElm = () => {
    const content = [createDiv(), createDiv(), createDiv(), createDiv(), createDiv()];
    content.forEach((elm, i) => {
        elm.setAttribute('id', i.toString());
        slotElm.append(elm);
    });
};
const clearSlotElm = () => {
    contents(slotElm).forEach(elm => {
        elm.remove();
    });
};
const compareToNative = (target: Node, method: string, snapshot: Array<Node>, elms: Element | Node | Array<Element> | Array<Node>, compareIds: boolean = false) => {
    if (!compareIds) {
        if (!isArray(elms)) {
            elms = [elms];
        }
        elms.forEach(e => {
            if (isHTMLElement(e))
                e.remove();
        });
        target[method](...elms);
        expect(Array.from(slotElm.childNodes)).toEqual(snapshot);
    }
    else {
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
                    if (compareIds && target !== slotElm && isHTMLElement(target) && child.getAttribute('id') === target.getAttribute('id')) {
                        target = child;
                    }
                }
            })
        });

        target[method](...realElms);

        const mapIds = (elm: Node) => isHTMLElement(elm) ? elm.getAttribute('id') || '' : '';
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
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            appendChildren(slotElm, createdDiv);
            expect(createdDiv).toBe(childNodes[childNodes.length - 1]);
            expect(childNodes.length).toBe(length + 1);

            compareToNative(slotElm, 'append', Array.from(childNodes), createdDiv);
        });

        test('multiple created', () => {
            const createdDivs = [createDiv(), createDiv(), createDiv()];
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            appendChildren(slotElm, createdDivs);
            expect(createdDivs[0]).toBe(childNodes[childNodes.length - 3]);
            expect(createdDivs[1]).toBe(childNodes[childNodes.length - 2]);
            expect(createdDivs[2]).toBe(childNodes[childNodes.length - 1]);
            expect(childNodes.length).toBe(length + createdDivs.length);

            compareToNative(slotElm, 'append', Array.from(childNodes), createdDivs);
        });

        test('single existing', () => {
            const childNodes = slotElm.childNodes;
            const elm = childNodes[1];

            appendChildren(slotElm, elm);
            expect(elm).toBe(childNodes[childNodes.length - 1]);

            compareToNative(slotElm, 'append', Array.from(childNodes), elm, true);
        });

        test('multiple existing', () => {
            const childNodes = slotElm.childNodes;
            const elms = [childNodes[1], childNodes[0], childNodes[2]];

            appendChildren(slotElm, elms);
            expect(elms[0]).toBe(childNodes[childNodes.length - 3]);
            expect(elms[1]).toBe(childNodes[childNodes.length - 2]);
            expect(elms[2]).toBe(childNodes[childNodes.length - 1]);

            compareToNative(slotElm, 'append', Array.from(childNodes), elms, true);
        });

        test('none', () => {
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            appendChildren(slotElm, null);
            appendChildren(null, childNodes);

            expect(childNodes.length).toBe(length);
        });
    });

    describe('prependChildren', () => {
        test('single created', () => {
            const createdDiv = createDiv();
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            prependChildren(slotElm, createdDiv);
            expect(createdDiv).toBe(childNodes[0]);
            expect(childNodes.length).toBe(length + 1);

            compareToNative(slotElm, 'prepend', Array.from(childNodes), createdDiv);
        });

        test('multiple created', () => {
            const createdDivs = [createDiv(), createDiv(), createDiv()];
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            prependChildren(slotElm, createdDivs);
            expect(createdDivs[0]).toBe(childNodes[0]);
            expect(createdDivs[1]).toBe(childNodes[1]);
            expect(createdDivs[2]).toBe(childNodes[2]);
            expect(childNodes.length).toBe(length + createdDivs.length);

            compareToNative(slotElm, 'prepend', Array.from(childNodes), createdDivs);
        });

        test('single existing', () => {
            const childNodes = slotElm.childNodes;
            const elm = childNodes[1];

            prependChildren(slotElm, elm);
            expect(elm).toBe(childNodes[0]);

            compareToNative(slotElm, 'prepend', Array.from(childNodes), elm, true);
        });

        test('multiple existing', () => {
            const childNodes = slotElm.childNodes;
            const elms = [childNodes[1], childNodes[0], childNodes[2]];

            prependChildren(slotElm, elms);
            expect(elms[0]).toBe(childNodes[0]);
            expect(elms[1]).toBe(childNodes[1]);
            expect(elms[2]).toBe(childNodes[2]);

            compareToNative(slotElm, 'prepend', Array.from(childNodes), elms, true);
        });

        test('none', () => {
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            prependChildren(slotElm, null);
            prependChildren(null, childNodes);

            expect(childNodes.length).toBe(length);
        });
    });

    describe('insertBefore', () => {
        test('single created', () => {
            const createdDiv = createDiv();
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;
            const target = childNodes[1];

            insertBefore(target, createdDiv);
            expect(createdDiv).toBe(childNodes[1]);
            expect(childNodes.length).toBe(length + 1);

            compareToNative(target, 'before', Array.from(childNodes), createdDiv);
        });

        test('multiple created', () => {
            const createdDivs = [createDiv(), createDiv(), createDiv()];
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;
            const target = childNodes[1];

            insertBefore(target, createdDivs);
            expect(createdDivs[0]).toBe(childNodes[1]);
            expect(createdDivs[1]).toBe(childNodes[2]);
            expect(createdDivs[2]).toBe(childNodes[3]);
            expect(childNodes.length).toBe(length + createdDivs.length);

            compareToNative(target, 'before', Array.from(childNodes), createdDivs);
        });

        test('single existing', () => {
            const childNodes = slotElm.childNodes;
            const target = childNodes[1];
            const elm = childNodes[2];

            insertBefore(target, elm);
            expect(elm).toBe(childNodes[1]);

            compareToNative(target, 'before', Array.from(childNodes), elm, true);
        });

        test('multiple existing', () => {
            const childNodes = slotElm.childNodes;
            const target = childNodes[1];
            const elms = [childNodes[4], childNodes[1], childNodes[2]];

            insertBefore(target, elms);
            expect(elms[0]).toBe(childNodes[1]);
            expect(elms[1]).toBe(childNodes[2]);
            expect(elms[2]).toBe(childNodes[3]);

            compareToNative(target, 'before', Array.from(childNodes), elms, true);
        });

        test('none', () => {
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            insertBefore(slotElm, null);
            insertBefore(null, childNodes);

            expect(childNodes.length).toBe(length);
        });
    });

    describe('insertAfter', () => {
        test('single created', () => {
            const createdDiv = createDiv();
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;
            const target = childNodes[1];

            insertAfter(target, createdDiv);
            expect(createdDiv).toBe(childNodes[2]);
            expect(childNodes.length).toBe(length + 1);

            compareToNative(target, 'after', Array.from(childNodes), createdDiv);
        });

        test('multiple created', () => {
            const createdDivs = [createDiv(), createDiv(), createDiv()];
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;
            const target = childNodes[1];

            insertAfter(target, createdDivs);
            expect(createdDivs[0]).toBe(childNodes[2]);
            expect(createdDivs[1]).toBe(childNodes[3]);
            expect(createdDivs[2]).toBe(childNodes[4]);
            expect(childNodes.length).toBe(length + createdDivs.length);

            compareToNative(target, 'after', Array.from(childNodes), createdDivs);
        });

        test('single existing', () => {
            const childNodes = slotElm.childNodes;
            const target = childNodes[1];
            const elm = childNodes[0];

            insertAfter(target, elm);
            expect(elm).toBe(childNodes[1]);

            compareToNative(target, 'after', Array.from(childNodes), elm, true);
        });

        test('multiple existing', () => {
            const childNodes = slotElm.childNodes;
            const target = childNodes[1];
            const elms = [childNodes[4], childNodes[1], childNodes[2]];

            insertAfter(target, elms);
            expect(elms[0]).toBe(childNodes[1]);
            expect(elms[1]).toBe(childNodes[2]);
            expect(elms[2]).toBe(childNodes[3]);

            compareToNative(target, 'after', Array.from(childNodes), elms, true);
        });

        test('none', () => {
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;

            insertAfter(slotElm, null);
            insertAfter(null, childNodes);

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
            const childNodes = slotElm.childNodes;
            const length = childNodes.length;
            expect(length).not.toBe(0);
            removeElements(childNodes[0]);
            expect(childNodes.length).toBe(length - 1);
        });

        test('multiple existing', () => {
            const childNodes = slotElm.childNodes;
            expect(childNodes.length).not.toBe(0)
            removeElements(childNodes);
            expect(childNodes.length).toBe(0);
        });

        test('none', () => {
            // @ts-ignore
            removeElements(null);
        });
    });
});