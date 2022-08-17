import { waitFor, waitForOptions } from '@testing-library/dom';

const getTestResultElm = () => document.getElementById('testResult');

export const setTestResult = (result: boolean | null) => {
  const elm = getTestResultElm();
  if (elm) {
    if (typeof result === 'boolean') {
      if (result) {
        if (elm.getAttribute('class') === 'failed') {
          return;
        }
      }
      elm.setAttribute('class', result ? 'passed' : 'failed');
    } else {
      elm.removeAttribute('class');
    }
  }
};

export const testPassed = (): boolean => {
  const elm = getTestResultElm();
  return elm ? elm.getAttribute('class') === 'passed' : false;
};

export const waitForOrFailTest = <T>(callback: () => T | Promise<T>, options?: waitForOptions) =>
  waitFor(callback, {
    ...options,
    onTimeout(error: Error): Error {
      setTestResult(false);
      return error;
    },
  });
