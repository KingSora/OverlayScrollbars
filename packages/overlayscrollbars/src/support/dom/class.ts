import { isString } from 'support/utils/types';
import { each } from 'support/utils/array';
import { keys } from 'support/utils/object';

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
const classListAction = (
  elm: Element | false | null | undefined,
  className: string,
  action: (elmClassList: DOMTokenList, clazz: string) => boolean | void
): boolean => {
  let clazz: string;
  let i = 0;
  let result = false;

  if (elm && isString(className)) {
    const classes: Array<string> = className.match(rnothtmlwhite) || [];
    result = classes.length > 0;
    while ((clazz = classes[i++])) {
      result = !!action(elm.classList, clazz) && result;
    }
  }
  return result;
};

/**
 * Check whether the given element has the given class name(s).
 * @param elm The element.
 * @param className The class name(s).
 */
export const hasClass = (elm: Element | false | null | undefined, className: string): boolean =>
  classListAction(elm, className, (classList, clazz) => classList.contains(clazz));

/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 */
export const addClass = (elm: Element | false | null | undefined, className: string): void => {
  classListAction(elm, className, (classList, clazz) => classList.add(clazz));
};

/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export const removeClass = (elm: Element | false | null | undefined, className: string): void => {
  classListAction(elm, className, (classList, clazz) => classList.remove(clazz));
};

/**
 * Takes two className strings, compares them and returns the difference as array.
 * @param classNameA ClassName A.
 * @param classNameB ClassName B.
 */
export const diffClass = (
  classNameA: string | null | undefined,
  classNameB: string | null | undefined
) => {
  const classNameASplit = classNameA && classNameA.split(' ');
  const classNameBSplit = classNameB && classNameB.split(' ');
  const tempObj = {};

  each(classNameASplit, (className) => {
    tempObj[className] = 1;
  });
  each(classNameBSplit, (className) => {
    if (tempObj[className]) {
      delete tempObj[className];
    } else {
      tempObj[className] = 1;
    }
  });

  return keys(tempObj);
};
