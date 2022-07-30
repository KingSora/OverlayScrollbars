function isEvent(obj) {
    return obj instanceof Event || !!obj.target;
}
// eslint-disable-next-line
const noop = () => {
    return {};
};
const getSelectOptions = (selectElement) => Array.from(selectElement.options).map((option) => option.value);
export const generateSelectCallback = (targetElms, callback) => (event) => {
    const target = isEvent(event)
        ? event.target
        : event;
    if (target) {
        const selectedOption = target.value;
        const selectOptions = getSelectOptions(target);
        const elmsArr = Array.isArray(targetElms) ? targetElms : [targetElms];
        elmsArr.forEach((elm) => {
            if (elm) {
                callback(elm, selectOptions, selectedOption);
            }
        });
    }
};
export const generateClassChangeSelectCallback = (targetElms) => generateSelectCallback(targetElms, (targetAffectedElm, possibleValues, selectedValue) => {
    possibleValues.forEach((clazz) => targetAffectedElm.classList.remove(clazz));
    targetAffectedElm.classList.add(selectedValue);
});
export const selectOption = (select, selectedOption) => {
    if (!select) {
        return false;
    }
    const options = getSelectOptions(select);
    const currValue = select.value;
    if (selectedOption === currValue) {
        return false;
    }
    if (typeof selectedOption === 'string' && options.includes(selectedOption)) {
        select.value = selectedOption;
    }
    else if (typeof selectedOption === 'number' &&
        options.length < selectedOption &&
        selectedOption > -1) {
        select.selectedIndex = selectedOption;
    }
    let event;
    if (typeof Event === 'function') {
        event = new Event('change');
    }
    else {
        event = document.createEvent('Event');
        event.initEvent('change', true, true);
    }
    select.dispatchEvent(event);
    return true;
};
export const iterateSelect = async (select, options) => {
    if (select) {
        const { beforeEach = noop, check = noop, afterEach = noop, filter } = options || {};
        const selectOptions = getSelectOptions(select);
        const selectOptionsReversed = getSelectOptions(select).reverse();
        const iterateOptions = [...selectOptions, ...selectOptionsReversed].filter(filter || (() => true));
        for (let i = 0; i < iterateOptions.length; i++) {
            const option = iterateOptions[i];
            // eslint-disable-next-line
            const beforeEachObj = await beforeEach();
            if (selectOption(select, option)) {
                // eslint-disable-next-line
                await check(beforeEachObj, option);
                // eslint-disable-next-line
                await afterEach();
            }
        }
    }
};
//# sourceMappingURL=Select.js.map