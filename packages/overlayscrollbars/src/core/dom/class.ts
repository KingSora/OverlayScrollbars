import { isString } from 'core/utils/types';

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

/**
 * Check whether the given element has the given class name.
 * @param elm The element.
 * @param className The class name.
 */
export const hasClass: (elm: Element, className: string) => boolean = (elm, className) => elm.classList.contains(className);

/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 */
export const addClass: (elm: Element, className: string) => void = (elm, className) => {
  let clazz: string;
  let i = 0;

  if (isString(className)) {
    const classes: Array<string> = className.match(rnothtmlwhite) || [];
    while ((clazz = classes[i++])) {
      elm.classList.add(clazz);
    }
  }
};

/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export const removeClass: (elm: Element, className: string) => void = (elm, className) => {
  let clazz: string;
  let i = 0;

  if (isString(className)) {
    const classes: Array<string> = className.match(rnothtmlwhite) || [];
    while ((clazz = classes[i++])) {
      elm.classList.remove(clazz);
    }
  }
};

/**
 * Adds or removes the given class name(s) from the given element depending on the given condition.
 * Condition true means add class name(s), false means remove class name(s).
 * @param elm The element.
 * @param className The class name(s) which shall be added or removed. (separated by spaces)
 */
export const conditionalClass: (elm: Element, className: string, condition: boolean) => void = (elm, className, condition) => {
  if (condition) {
    addClass(elm, className);
  } else {
    removeClass(elm, className);
  }
};
