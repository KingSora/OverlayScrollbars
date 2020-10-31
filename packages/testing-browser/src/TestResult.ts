const getTestResultElm = () => document.getElementById('testResult');

export const setTestResult = (result: boolean | null) => {
  const elm = getTestResultElm();
  if (elm) {
    if (typeof result === 'boolean') {
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
