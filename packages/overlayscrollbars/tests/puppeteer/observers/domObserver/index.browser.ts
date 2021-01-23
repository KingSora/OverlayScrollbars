import 'overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { generateSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import {
  appendChildren,
  createDiv,
  removeElements,
  children,
  isArray,
  isNumber,
  liesBetween,
  hasClass,
  addClass,
  removeClass,
  diffClass,
  on,
} from 'support';

import { createDOMObserver } from 'observers/domObserver';

interface DOMObserverResult {
  changedTargetAttrs: string[];
  styleChanged: boolean;
  contentChanged: boolean;
}
interface SeparateChangeThrough {
  added?: DOMObserverResult[];
  removed?: DOMObserverResult[];
}

const targetChangesCountSlot: HTMLElement | null = document.querySelector('#targetChanges');
const contentChangesCountSlot: HTMLElement | null = document.querySelector('#contentChanges');
const targetElm: HTMLElement | null = document.querySelector('#target');
const targetElmContentElm: HTMLElement | null = document.querySelector('#content-host');
const contentElmAttrChange: HTMLElement | null = document.querySelector('#target .content-nest');
const contentBetweenElmAttrChange: HTMLElement | null = document.querySelector('#content-host .padding-nest-item');
const contentHostElmAttrChange: HTMLElement | null = document.querySelector('#content-nest-item-host');

const targetElmsSlot = document.querySelector('#target .host-nest-item');
const targetContentElmsSlot = document.querySelector('#target .content .content-nest');
const targetContentBetweenElmsSlot = document.querySelector('#content-host');
const imgElmsSlot = document.querySelector('#target .content-nest');
const transitionElmsSlot = document.querySelector('#content-host .content');

const addRemoveTargetElms: HTMLButtonElement | null = document.querySelector('#addRemoveTargetElms');
const addRemoveTargetContentElms: HTMLButtonElement | null = document.querySelector('#addRemoveTargetContentElms');
const addRemoveTargetContentBetweenElms: HTMLButtonElement | null = document.querySelector('#addRemoveTargetContentBetweenElms');
const addRemoveImgElms: HTMLButtonElement | null = document.querySelector('#addRemoveImgElms');
const addRemoveTransitionElms: HTMLButtonElement | null = document.querySelector('#addRemoveTransitionElms');
const ignoreTargetChange: HTMLButtonElement | null = document.querySelector('#ignoreTargetChange');
const setTargetAttr: HTMLSelectElement | null = document.querySelector('#setTargetAttr');
const setFilteredTargetAttr: HTMLSelectElement | null = document.querySelector('#setFilteredTargetAttr');
const setContentAttr: HTMLSelectElement | null = document.querySelector('#setContentAttr');
const setFilteredContentAttr: HTMLSelectElement | null = document.querySelector('#setFilteredContentAttr');
const setContentBetweenAttr: HTMLSelectElement | null = document.querySelector('#setContentBetweenAttr');
const setFilteredContentBetweenAttr: HTMLSelectElement | null = document.querySelector('#setFilteredContentBetweenAttr');
const setContentHostElmAttr: HTMLSelectElement | null = document.querySelector('#setContentHostElmAttr');
const setFilteredContentHostElmAttr: HTMLSelectElement | null = document.querySelector('#setFilteredContentHostElmAttr');
const summaryContent: HTMLElement | null = document.querySelector('#summary-content');
const summaryBetween: HTMLElement | null = document.querySelector('#summary-between');

const startBtn: HTMLButtonElement | null = document.querySelector('#start');

const hostSelector = '.host';
const ignorePrefix = 'ignore';
const attrs = ['id', 'class', 'style', 'open'];
const contentChangeArr: Array<[string, string | ((elms: Node[]) => string)]> = [['img', 'load']];
const targetElmObservations: DOMObserverResult[] = [];
const targetElmContentElmObservations: DOMObserverResult[] = [];

createDOMObserver(
  document.querySelector('#target') as HTMLElement,
  (changedTargetAttrs: string[], styleChanged: boolean, contentChanged: boolean) => {
    targetElmObservations.push({ changedTargetAttrs, styleChanged, contentChanged });
    requestAnimationFrame(() => {
      if (targetChangesCountSlot) {
        targetChangesCountSlot.textContent = `${targetElmObservations.length}`;
      }
    });
  },
  {
    _styleChangingAttributes: attrs,
    _attributes: attrs.concat(['data-target']),
    _ignoreTargetAttrChange: (target, attrName, oldValue, newValue) => {
      if (attrName === 'class' && oldValue && newValue) {
        const diff = diffClass(oldValue, newValue);
        const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
        return ignore;
      }
      return false;
    },
  }
);
const { _updateEventContentChange } = createDOMObserver(
  document.querySelector('#target .content') as HTMLElement,
  (changedTargetAttrs: string[], styleChanged: boolean, contentChanged: boolean) => {
    targetElmContentElmObservations.push({ changedTargetAttrs, styleChanged, contentChanged });
    requestAnimationFrame(() => {
      if (contentChangesCountSlot) {
        contentChangesCountSlot.textContent = `${targetElmContentElmObservations.length}`;
      }
    });
  },
  {
    _observeContent: true,
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: contentChangeArr,
    _nestedTargetSelector: hostSelector,
    _ignoreContentChange: (mutation, isNestedTarget) => {
      const { target, attributeName } = mutation;
      return isNestedTarget ? false : attributeName ? liesBetween(target as Element, hostSelector, '.content') : false;
    },
    _ignoreTargetAttrChange: (target, attrName, oldValue, newValue) => {
      if (attrName === 'class' && oldValue && newValue) {
        const diff = diffClass(oldValue, newValue);
        const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
        return ignore;
      }
      return false;
    },
  }
);

const getTotalObservations = () => targetElmObservations.length + targetElmContentElmObservations.length;
const getLast = <T>(arr: T[], indexFromLast = 0): T => arr[arr.length - 1 - indexFromLast] || ({} as T);
const changedThrough = (observationLists?: Array<DOMObserverResult[]> | DOMObserverResult[]) => {
  interface Stat {
    total: number;
    lists: Array<[DOMObserverResult[], number]>;
  }
  const noObservationLists = observationLists === undefined;
  let before: Stat;
  let after: Stat;
  if (noObservationLists) {
    observationLists = [];
  }
  if (isArray(observationLists) && !isArray(observationLists[0])) {
    observationLists = [observationLists] as Array<DOMObserverResult[]>;
  }

  const getStats = (): Stat => {
    return {
      total: getTotalObservations(),
      lists: (observationLists as Array<DOMObserverResult[]>).map((list) => [list, list.length]),
    };
  };

  return {
    before: () => {
      before = getStats();
    },
    after: () => {
      after = getStats();
    },
    compare: (comparisonTableOrNumber: number | Map<DOMObserverResult[], number> = 0) => {
      let totalDiff = 0;
      if (isNumber(comparisonTableOrNumber) || noObservationLists) {
        before.lists.forEach((_, index) => {
          const [, beforeCount] = before.lists[index];
          const [, afterCount] = after.lists[index];

          totalDiff += afterCount - beforeCount;
          should(afterCount).equal(beforeCount + (noObservationLists ? 0 : (comparisonTableOrNumber as number)));
        });
      } else {
        before.lists.forEach((_, index) => {
          const [list, beforeCount] = before.lists[index];
          const [, afterCount] = after.lists[index];

          totalDiff += afterCount - beforeCount;
          should(afterCount).equal(beforeCount + (comparisonTableOrNumber.get(list) || 0));
        });
      }
      should(after.total).equal(before.total + totalDiff);
    },
  };
};
const attrChangeListener = (attrChangeTarget: HTMLElement | null) =>
  generateSelectCallback(attrChangeTarget, (target, possibleValues, selectedValue) => {
    const isClass = selectedValue === 'class';

    target.classList.remove('something');
    possibleValues.forEach((val) => val !== 'class' && target.removeAttribute(val));
    isClass && target.classList.add('something');
    !isClass && target.setAttribute(selectedValue, 'something');
  });
const iterateAttrChange = async (
  select: HTMLSelectElement | null,
  changeThrough?: DOMObserverResult[],
  checkChange?: (observation: DOMObserverResult, selected: string) => any
) => {
  const { before, after, compare } = changedThrough(changeThrough);

  await iterateSelect<unknown>(select, {
    beforeEach() {
      before();
    },
    async check(_, selected) {
      await waitForOrFailTest(async () => {
        after();

        if (changeThrough) {
          compare(1);
          checkChange && checkChange(getLast(changeThrough), selected);
        } else {
          await timeout(250);
          compare(0);
        }
      });
    },
  });
};
const addRemoveElementsTest = async (slot: Element | null, changeThrough?: DOMObserverResult[] | SeparateChangeThrough) => {
  if (slot) {
    let addChangeThrough: DOMObserverResult[] | undefined = changeThrough as DOMObserverResult[] | undefined;
    let removeChangeThrough: DOMObserverResult[] | undefined = changeThrough as DOMObserverResult[] | undefined;
    if (changeThrough && !isArray(changeThrough)) {
      addChangeThrough = (changeThrough as SeparateChangeThrough).added;
      removeChangeThrough = (changeThrough as SeparateChangeThrough).removed;
    }

    const addElm = async () => {
      const { before, after, compare } = changedThrough(addChangeThrough);

      before();
      appendChildren(slot, createDiv('addedElm'));
      await timeout(250);
      after();

      await waitForOrFailTest(() => {
        compare(1);
      });

      if (addChangeThrough) {
        const { contentChanged, styleChanged, changedTargetAttrs } = getLast(addChangeThrough);
        await waitForOrFailTest(() => {
          should(contentChanged).equal(true);
          should(styleChanged).equal(false);
          should(changedTargetAttrs.length).equal(0);
        });
      }
    };

    const removeElm = async () => {
      const removeItem = children(slot, '.addedElm')[0];
      const { before, after, compare } = changedThrough(removeChangeThrough);

      if (removeItem) {
        before();
        removeElements(removeItem);
        await timeout(250);

        await waitForOrFailTest(() => {
          after();
          compare(1);

          if (removeChangeThrough) {
            const { changedTargetAttrs, styleChanged, contentChanged } = getLast(removeChangeThrough);
            should(changedTargetAttrs.length).equal(0);
            should(styleChanged).equal(false);
            should(contentChanged).equal(true);
          }
        });
      }
    };

    await addElm();
    await addElm();
    await addElm();

    await removeElm();
    await removeElm();
    await removeElm();
  }
};
const triggerSummaryElemet = async (summaryElm: HTMLElement | null, changeThrough?: DOMObserverResult[]) => {
  // onyl do if summary is working (IE. exception)
  if (summaryElm && (summaryElm.nextElementSibling as HTMLElement)?.offsetHeight === 0) {
    const click = async () => {
      const { before, after, compare } = changedThrough(changeThrough);

      before();
      summaryElm?.click();
      await timeout(250);
      after();

      await waitForOrFailTest(() => {
        compare(1);
      });
    };

    await click();
    await click();
  }
};

const addRemoveTargetElmsFn = async () => {
  await addRemoveElementsTest(targetElmsSlot);
};
const addRemoveTargetContentElmsFn = async () => {
  await addRemoveElementsTest(targetContentElmsSlot, targetElmContentElmObservations);
};
const addRemoveTargetContentBetweenElmsFn = async () => {
  await addRemoveElementsTest(targetContentBetweenElmsSlot, targetElmContentElmObservations);
};
const addRemoveImgElmsFn = async () => {
  const add = async () => {
    const img = new Image(1, 1);
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    const { before, after, compare } = changedThrough(targetElmContentElmObservations);
    const imgHolder = createDiv('img');
    appendChildren(imgHolder, img);

    before();
    appendChildren(imgElmsSlot, imgHolder);

    await waitForOrFailTest(() => {
      after();
      compare(2);

      const mutationObserverObservation = getLast(targetElmContentElmObservations, 1);
      should(mutationObserverObservation.contentChanged).equal(true);
      should(mutationObserverObservation.styleChanged).equal(false);
      should(mutationObserverObservation.changedTargetAttrs.length).equal(0);

      const eventObservation = getLast(targetElmContentElmObservations);
      should(eventObservation.contentChanged).equal(true);
      should(eventObservation.styleChanged).equal(false);
      should(eventObservation.changedTargetAttrs.length).equal(0);
    });
  };

  await add();
  await add();
  await add();

  // test event content change debounce
  const addMultiple = async () => {
    const { before, after, compare } = changedThrough(targetElmContentElmObservations);
    const addMultipleItem = () => {
      const img = new Image(1, 1);
      img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

      const imgHolder = createDiv('img');
      appendChildren(imgHolder, img);

      appendChildren(imgElmsSlot, imgHolder);
    };

    before();

    addMultipleItem();
    addMultipleItem();
    addMultipleItem();

    await waitForOrFailTest(() => {
      after();
      compare(2);

      const mutationObserverObservation = getLast(targetElmContentElmObservations, 1);
      should(mutationObserverObservation.contentChanged).equal(true);
      should(mutationObserverObservation.styleChanged).equal(false);
      should(mutationObserverObservation.changedTargetAttrs.length).equal(0);

      const eventObservation = getLast(targetElmContentElmObservations);
      should(eventObservation.contentChanged).equal(true);
      should(eventObservation.styleChanged).equal(false);
      should(eventObservation.changedTargetAttrs.length).equal(0);
    });
  };

  await addMultiple();

  removeElements(document.querySelectorAll('.img'));

  await timeout(250);
};
const addRemoveTransitionElmsFn = async () => {
  const startTransition = async (elm: Element, expectTransitionEndContentChange: boolean) => {
    await timeout(50); // time for css to apply class a bit later to trigger transition

    const { before: beforeTransition, after: afterTransition, compare: compareTransition } = changedThrough(targetElmContentElmObservations);
    beforeTransition();
    removeClass(elm, 'resetTransition'); // IE...
    addClass(elm, 'active');

    await new Promise((resolve) => {
      on(
        elm,
        'transitionend',
        async () => {
          await waitForOrFailTest(() => {
            afterTransition();
            compareTransition(expectTransitionEndContentChange ? 2 : 1); // 2 because 1: added class mutation and 2: transition end event

            const eventObservation = getLast(targetElmContentElmObservations);
            should(eventObservation.contentChanged).equal(true);
            should(eventObservation.styleChanged).equal(false);
            should(eventObservation.changedTargetAttrs.length).equal(0);
            resolve(1);
          });
        },
        { _once: true }
      );
    });

    removeClass(elm, 'active');
    addClass(elm, 'resetTransition'); // IE...
  };
  const add = async (expectTransitionEndContentChange: boolean) => {
    const elm = createDiv(`transition ${expectTransitionEndContentChange ? 'highlight' : ''}`);
    const { before, after, compare } = changedThrough(targetElmContentElmObservations);

    before();

    appendChildren(transitionElmsSlot, elm);

    await waitForOrFailTest(() => {
      after();
      compare(1);

      const eventObservation = getLast(targetElmContentElmObservations);
      should(eventObservation.contentChanged).equal(true);
      should(eventObservation.styleChanged).equal(false);
      should(eventObservation.changedTargetAttrs.length).equal(0);
    });

    await startTransition(elm, expectTransitionEndContentChange && true);
    _updateEventContentChange(contentChangeArr);
    await startTransition(elm, expectTransitionEndContentChange && false);

    removeElements(elm);

    await timeout(250);
  };

  await add(false);

  _updateEventContentChange(
    contentChangeArr.concat([
      [
        '.transition',
        (elms) => {
          elms.forEach((elm) => {
            should(hasClass(elm as Element, 'transition')).equal(true);
          });
          return 'transitionend';
        },
      ],
    ])
  );

  await add(true);
};
const ignoreTargetChangeFn = async () => {
  const check = async (target: Element | null, changeThrough: DOMObserverResult[]) => {
    const { before, after, compare } = changedThrough(changeThrough);
    before();

    target?.classList.add(`${ignorePrefix}-something`);
    await timeout(250);
    target?.classList.remove(`${ignorePrefix}-something`);
    await timeout(250);

    await waitForOrFailTest(() => {
      after();
      compare(0);
    });
  };

  await check(targetElm, targetElmObservations);
  await check(targetElmContentElm, targetElmContentElmObservations);
};
const iterateTargetAttrChange = async () => {
  await iterateAttrChange(setTargetAttr, targetElmObservations, (observation, selected) => {
    const { changedTargetAttrs, styleChanged, contentChanged } = observation;
    should(changedTargetAttrs.includes(selected)).equal(true);
    should(styleChanged).equal(true);
    should(contentChanged).equal(false);
  });
  await iterateAttrChange(setFilteredTargetAttr);
};
const iterateContentAttrChange = async () => {
  await iterateAttrChange(setContentAttr, targetElmContentElmObservations, (observation) => {
    const { changedTargetAttrs, styleChanged, contentChanged } = observation;
    should(changedTargetAttrs.length).equal(0);
    should(styleChanged).equal(false);
    should(contentChanged).equal(true);
  });
  await iterateAttrChange(setFilteredContentAttr);
};
const iterateContentBetweenAttrChange = async () => {
  await iterateAttrChange(setContentBetweenAttr);
  await iterateAttrChange(setFilteredContentBetweenAttr);
};
const iterateContentHostElmAttrChange = async () => {
  await iterateAttrChange(setContentHostElmAttr, targetElmContentElmObservations, (observation) => {
    const { changedTargetAttrs, styleChanged, contentChanged } = observation;
    should(changedTargetAttrs.length).equal(0);
    should(styleChanged).equal(false);
    should(contentChanged).equal(true);
  });
  await iterateAttrChange(setFilteredContentHostElmAttr);
};
const triggerContentSummaryChange = async () => {
  await triggerSummaryElemet(summaryContent, targetElmContentElmObservations);
};
const triggerBetweenSummaryChange = async () => {
  await triggerSummaryElemet(summaryBetween);
};

addRemoveTargetElms?.addEventListener('click', addRemoveTargetElmsFn);
addRemoveTargetContentElms?.addEventListener('click', addRemoveTargetContentElmsFn);
addRemoveTargetContentBetweenElms?.addEventListener('click', addRemoveTargetContentBetweenElmsFn);
addRemoveImgElms?.addEventListener('click', addRemoveImgElmsFn);
addRemoveTransitionElms?.addEventListener('click', addRemoveTransitionElmsFn);
ignoreTargetChange?.addEventListener('click', ignoreTargetChangeFn);
setTargetAttr?.addEventListener('change', attrChangeListener(targetElm));
setFilteredTargetAttr?.addEventListener('change', attrChangeListener(targetElm));
setContentAttr?.addEventListener('change', attrChangeListener(contentElmAttrChange));
setFilteredContentAttr?.addEventListener('change', attrChangeListener(contentElmAttrChange));
setContentBetweenAttr?.addEventListener('change', attrChangeListener(contentBetweenElmAttrChange));
setFilteredContentBetweenAttr?.addEventListener('change', attrChangeListener(contentBetweenElmAttrChange));
setContentHostElmAttr?.addEventListener('change', attrChangeListener(contentHostElmAttrChange));
setFilteredContentHostElmAttr?.addEventListener('change', attrChangeListener(contentHostElmAttrChange));

const start = async () => {
  setTestResult(null);

  await addRemoveTargetElmsFn();
  await addRemoveTargetContentElmsFn();
  await addRemoveTargetContentBetweenElmsFn();

  await iterateTargetAttrChange();
  await iterateContentAttrChange();

  await addRemoveTransitionElmsFn();

  await iterateContentBetweenAttrChange();
  await iterateContentHostElmAttrChange();

  await triggerContentSummaryChange();
  await triggerBetweenSummaryChange();

  await addRemoveImgElmsFn();

  setTestResult(true);
};

startBtn?.addEventListener('click', start);

export { start };
