import { isString } from '../utils/types';
import { each } from '../utils/array';
import { keys } from '../utils/object';
const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
const classListAction = (elm, className, action) => {
    const classList = elm && elm.classList;
    let clazz;
    let i = 0;
    let result = false;
    if (classList && className && isString(className)) {
        const classes = className.match(rnothtmlwhite) || [];
        result = classes.length > 0;
        while ((clazz = classes[i++])) {
            result = !!action(classList, clazz) && result;
        }
    }
    return result;
};
/**
 * Check whether the given element has the given class name(s).
 * @param elm The element.
 * @param className The class name(s).
 */
export const hasClass = (elm, className) => classListAction(elm, className, (classList, clazz) => classList.contains(clazz));
/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export const removeClass = (elm, className) => {
    classListAction(elm, className, (classList, clazz) => classList.remove(clazz));
};
/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 * @returns A function which removes the added class name(s).
 */
export const addClass = (elm, className) => {
    classListAction(elm, className, (classList, clazz) => classList.add(clazz));
    return removeClass.bind(0, elm, className);
};
/**
 * Takes two className strings, compares them and returns the difference as array.
 * @param classNameA ClassName A.
 * @param classNameB ClassName B.
 */
export const diffClass = (classNameA, classNameB) => {
    const classNameASplit = classNameA && classNameA.split(' ');
    const classNameBSplit = classNameB && classNameB.split(' ');
    const tempObj = {};
    each(classNameASplit, (className) => {
        tempObj[className] = 1;
    });
    each(classNameBSplit, (className) => {
        if (tempObj[className]) {
            delete tempObj[className];
        }
        else {
            tempObj[className] = 1;
        }
    });
    return keys(tempObj);
};
//# sourceMappingURL=class.js.map