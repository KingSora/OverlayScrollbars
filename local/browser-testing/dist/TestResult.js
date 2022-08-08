import { waitFor } from '@testing-library/dom';
const getTestResultElm = () => document.getElementById('testResult');
export const setTestResult = (result) => {
    const elm = getTestResultElm();
    if (elm) {
        if (typeof result === 'boolean') {
            if (result) {
                if (elm.getAttribute('class') === 'failed') {
                    return;
                }
            }
            elm.setAttribute('class', result ? 'passed' : 'failed');
        }
        else {
            elm.removeAttribute('class');
        }
    }
};
export const testPassed = () => {
    const elm = getTestResultElm();
    return elm ? elm.getAttribute('class') === 'passed' : false;
};
export const waitForOrFailTest = (callback, options) => waitFor(callback, {
    ...options,
    onTimeout(error) {
        setTestResult(false);
        return error;
    },
});
//# sourceMappingURL=testResult.js.map