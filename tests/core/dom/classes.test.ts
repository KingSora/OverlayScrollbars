import { addClass, removeClass, hasClass, conditionalClass } from 'core/dom/classes';

const testElm = document.body;
const removeAllClassNames = () => {
    while (testElm.classList.length > 0) {
        const classToRemove = testElm.classList.item(0);
        if (classToRemove) {
            testElm.classList.remove(classToRemove);
        }
    }
};
const hasClassName = (className: string) => {
    return testElm.classList.contains(className);
};

describe('dom class names', () => {
    afterEach(() => {
        removeAllClassNames();
    });

    test('add none', () => {
        addClass(testElm, '');
        // @ts-ignore
        addClass(testElm, null);
        // @ts-ignore
        addClass(testElm, 2);
        expect(testElm.classList.length).toBe(0);
    });

    test('add single', () => {
        addClass(testElm, 'test-class');
        expect(hasClassName('test-class')).toBe(true);
    });

    test('add multiple', () => {
        addClass(testElm, 'test-class test-class2');
        expect(hasClassName('test-class')).toBe(true);
        expect(hasClassName('test-class2')).toBe(true);
    });

    test('remove none', () => {
        addClass(testElm, 'test-class');
        removeClass(testElm, '');
        // @ts-ignore
        removeClass(testElm, null);
        // @ts-ignore
        removeClass(testElm, 2);
        expect(testElm.classList.length).toBe(1);
    });

    test('remove single', () => {
        addClass(testElm, 'test-class');
        expect(hasClassName('test-class')).toBe(true);
        removeClass(testElm, 'test-class');
        expect(hasClassName('test-class')).toBe(false);
    });

    test('remove multiple', () => {
        addClass(testElm, 'test-class test-class2');
        removeClass(testElm, 'test-class test-class2');
        expect(hasClassName('test-class')).toBe(false);
        expect(hasClassName('test-class2')).toBe(false);
    });

    test('has', () => {
        addClass(testElm, 'test-class');
        expect(hasClass(testElm, 'test-class')).toBe(true);
    });

    test('conditional single', () => {
        conditionalClass(testElm, 'test-class', true)
        expect(hasClass(testElm, 'test-class')).toBe(true);
        conditionalClass(testElm, 'test-class', false)
        expect(hasClass(testElm, 'test-class')).toBe(false);
    });

    test('conditional multiple', () => {
        conditionalClass(testElm, 'test-class test-class2', true)
        expect(hasClass(testElm, 'test-class')).toBe(true);
        expect(hasClass(testElm, 'test-class2')).toBe(true);
        conditionalClass(testElm, 'test-class test-class2', false)
        expect(hasClass(testElm, 'test-class')).toBe(false);
        expect(hasClass(testElm, 'test-class2')).toBe(false);
    });
});