import { isString } from 'support/utils/types';
import { each } from 'support/utils/array';
import { keys } from 'support/utils/object';

type ClassContainingElement = Node | Element | false | null | undefined;
type ClassName = string | false | null | undefined;

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
const classListAction = (
  elm: ClassContainingElement,
  className: ClassName,
  action: (elmClassList: DOMTokenList, clazz: string) => boolean | void
): boolean => {
  const classList = elm && (elm as Element).classList;
  let clazz: string;
  let i = 0;
  let result = false;

  if (classList && className && isString(className)) {
    const classes: Array<string> = className.match(rnothtmlwhite) || [];
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
export const hasClass = (elm: ClassContainingElement, className: ClassName): boolean =>
  classListAction(elm, className, (classList, clazz) => classList.contains(clazz));

/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export const removeClass = (elm: ClassContainingElement, className: ClassName): void => {
  classListAction(elm, className, (classList, clazz) => classList.remove(clazz));
};

/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 * @returns A function which removes the added class name(s).
 */
export const addClass = (elm: ClassContainingElement, className: ClassName): (() => void) => {
  classListAction(elm, className, (classList, clazz) => classList.add(clazz));
  return removeClass.bind(0, elm, className);
};

/**
 * Takes two className strings, compares them and returns the difference as array.
 * @param classNameA ClassName A.
 * @param classNameB ClassName B.
 */
export const diffClass = (classNameA: ClassName, classNameB: ClassName) => {
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
