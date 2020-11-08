function isEvent(obj: any): obj is Event {
  return obj instanceof Event || !!obj.target;
}

// eslint-disable-next-line
const noop = <T>(): T => {
  return {} as T;
};

const getSelectOptions = (selectElement: HTMLSelectElement) => Array.from(selectElement.options).map((option) => option.value);

export const generateSelectCallback = (targetElm: HTMLElement | null) => (event: Event | HTMLSelectElement | null) => {
  const target: HTMLSelectElement | null = isEvent(event) ? (event.target as HTMLSelectElement) : event;
  if (target) {
    const selectedOption = target.value;
    const selectOptions = getSelectOptions(target);

    if (targetElm) {
      selectOptions.forEach((clazz) => targetElm.classList.remove(clazz));
      targetElm.classList.add(selectedOption);
    }
  }
};

export const selectOption = (select: HTMLSelectElement | null, selectedOption: string | number): boolean => {
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
  } else if (typeof selectedOption === 'number' && options.length < selectedOption && selectedOption > -1) {
    select.selectedIndex = selectedOption;
  }

  let event;
  if (typeof Event === 'function') {
    event = new Event('change');
  } else {
    event = document.createEvent('Event');
    event.initEvent('change', true, true);
  }
  select.dispatchEvent(event);

  return true;
};

export const iterateSelect = async <T>(
  select: HTMLSelectElement | null,
  options?: {
    beforeEach?: () => T | Promise<T>;
    check?: (input: T) => void | Promise<void>;
    afterEach?: () => void | Promise<void>;
  }
) => {
  if (select) {
    const { beforeEach = noop, check = noop, afterEach = noop } = options || {};
    const selectOptions = getSelectOptions(select);
    const selectOptionsReversed = getSelectOptions(select).reverse();
    const iterateOptions = [...selectOptions, ...selectOptionsReversed];
    for (let i = 0; i < iterateOptions.length; i++) {
      const option = iterateOptions[i];
      // eslint-disable-next-line
      const beforeEachObj: T = await beforeEach();
      if (selectOption(select, option)) {
        // eslint-disable-next-line
        await check(beforeEachObj);
        // eslint-disable-next-line
        await afterEach();
      }
    }
  }
};
