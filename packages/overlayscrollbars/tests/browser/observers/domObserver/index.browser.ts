import 'styles/overlayscrollbars.scss';
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

type DOMContentObserverResult = boolean;
type DOMTargetObserverResult = {
  changedTargetAttrs: string[];
  styleChanged: boolean;
};
interface SeparateChangeThrough {
  added?: DOMContentObserverResult[];
  removed?: DOMContentObserverResult[];
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
const domTargetObserverObservations: DOMTargetObserverResult[] = [];
const domContentObserverObservations: DOMContentObserverResult[] = [];

const targetDomObserver = createDOMObserver(
  document.querySelector('#target')!,
  false,
  (changedTargetAttrs: string[], styleChanged: boolean) => {
    should.ok(Array.isArray(changedTargetAttrs), 'The changedTargetAttrs parameter in a target dom observer must be a array.');
    should.equal(typeof styleChanged, 'boolean', 'The styleChanged parameter in a target dom observer must be a boolean.');

    if (styleChanged && changedTargetAttrs.length === 0) {
      should.ok(false, 'Style changing properties must always be inside the changedTargetAttrs array.');
    }

    domTargetObserverObservations.push({ changedTargetAttrs, styleChanged });
    requestAnimationFrame(() => {
      if (targetChangesCountSlot) {
        targetChangesCountSlot.textContent = `${domTargetObserverObservations.length}`;
      }
    });
  },
  {
    _styleChangingAttributes: attrs,
    _attributes: attrs.concat(['data-target']),
    _ignoreTargetChange: (target, attrName, oldValue, newValue) => {
      if (attrName === 'class' && oldValue && newValue) {
        const diff = diffClass(oldValue, newValue);
        const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
        return ignore;
      }
      return false;
    },
    // @ts-ignore
    _ignoreContentChange: () => {
      // if param: isContentObserver = false, this function should never be called.
      should.ok(false, 'A target dom observer must not call the _ignoreContentChange method.');
      return true;
    },
    // @ts-ignore
    _ignoreNestedTargetChange: () => {
      // if param: isContentObserver = false, this function should never be called.
      should.ok(false, 'A target dom observer must not call the _ignoreNestedTargetChange method.');
      return true;
    },
  }
);

const contentDomObserver = createDOMObserver(
  document.querySelector('#target .content')!,
  true,
  (contentChanged: boolean) => {
    should.equal(typeof contentChanged, 'boolean', 'The contentChanged parameter in a content dom observer must be a boolean.');

    domContentObserverObservations.push(contentChanged);
    requestAnimationFrame(() => {
      if (contentChangesCountSlot) {
        contentChangesCountSlot.textContent = `${domContentObserverObservations.length}`;
      }
    });
  },
  {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: contentChangeArr,
    _nestedTargetSelector: hostSelector,
    _ignoreContentChange: (mutation, isNestedTarget) => {
      const { target, attributeName } = mutation;
      return isNestedTarget ? false : attributeName ? liesBetween(target as Element, hostSelector, '.content') : false;
    },
    _ignoreNestedTargetChange: (target, attrName, oldValue, newValue) => {
      if (attrName === 'class' && oldValue && newValue) {
        const diff = diffClass(oldValue, newValue);
        const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
        return ignore;
      }
      return false;
    },
    // @ts-ignore
    _ignoreTargetChange: () => {
      // if param: isContentObserver = true, this function should never be called.
      should.ok(false, 'A content dom observer must not call the _ignoreTargetChange method.');
      return true;
    },
  }
);

const getTotalObservations = () => domTargetObserverObservations.length + domContentObserverObservations.length;
const getLast = <T>(arr: T[], indexFromLast = 0): T => arr[arr.length - 1 - indexFromLast] || ({} as T);
const changedThrough = <ChangeThrough extends DOMContentObserverResult | DOMTargetObserverResult>(
  observationLists?: Array<ChangeThrough[]> | ChangeThrough[]
) => {
  interface Stat {
    total: number;
    lists: Array<[ChangeThrough[], number]>;
  }
  const noObservationLists = observationLists === undefined;
  let before: Stat;
  let after: Stat;
  if (noObservationLists) {
    observationLists = [];
  }
  if (isArray(observationLists) && !isArray(observationLists[0])) {
    observationLists = [observationLists] as Array<ChangeThrough[]>;
  }

  const getStats = (): Stat => {
    return {
      total: getTotalObservations(),
      lists: (observationLists as Array<ChangeThrough[]>).map((list) => [list, list.length]),
    };
  };

  return {
    before: () => {
      before = getStats();
    },
    after: () => {
      after = getStats();
    },
    compare: (comparisonTableOrNumber: number | Map<ChangeThrough[], number> = 0) => {
      let totalDiff = 0;
      if (isNumber(comparisonTableOrNumber) || noObservationLists) {
        before.lists.forEach((_, index) => {
          const [, beforeCount] = before.lists[index];
          const [, afterCount] = after.lists[index];

          totalDiff += afterCount - beforeCount;
          should.equal(
            afterCount,
            beforeCount + (noObservationLists ? 0 : (comparisonTableOrNumber as number)),
            'Before and after changes for a certain observer are correct. (number)'
          );
        });
      } else {
        before.lists.forEach((_, index) => {
          const [list, beforeCount] = before.lists[index];
          const [, afterCount] = after.lists[index];

          totalDiff += afterCount - beforeCount;
          should.equal(
            afterCount,
            beforeCount + (comparisonTableOrNumber.get(list) || 0),
            'Before and after changes for a certain observer are correct. (Map)'
          );
        });
      }
      should.equal(after.total, before.total + totalDiff, 'Total changes are correct.');
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
const iterateAttrChange = async <ChangeThrough extends DOMContentObserverResult | DOMTargetObserverResult>(
  select: HTMLSelectElement | null,
  changeThrough?: ChangeThrough[],
  checkChange?: (observation: ChangeThrough, selected: string) => any
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
const addRemoveElementsTest = async (slot: Element | null, changeThrough?: DOMContentObserverResult[] | SeparateChangeThrough) => {
  if (slot) {
    let addChangeThrough: DOMContentObserverResult[] | undefined = changeThrough as DOMContentObserverResult[] | undefined;
    let removeChangeThrough: DOMContentObserverResult[] | undefined = changeThrough as DOMContentObserverResult[] | undefined;
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
        const contentChanged = getLast(addChangeThrough);
        await waitForOrFailTest(() => {
          should.equal(contentChanged, true, 'Adding an content element must result in a content change.');
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
            const contentChanged = getLast(removeChangeThrough);
            should.equal(contentChanged, true, 'Removing an content element must result in a content change.');
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
const triggerSummaryElemet = async (summaryElm: HTMLElement | null, changeThrough?: DOMContentObserverResult[]) => {
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
  await addRemoveElementsTest(targetContentElmsSlot, domContentObserverObservations);
};
const addRemoveTargetContentBetweenElmsFn = async () => {
  await addRemoveElementsTest(targetContentBetweenElmsSlot, domContentObserverObservations);
};
const addRemoveImgElmsFn = async () => {
  const add = async () => {
    const img = new Image(1, 1);
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    const { before, after, compare } = changedThrough(domContentObserverObservations);
    const imgHolder = createDiv('img');
    appendChildren(imgHolder, img);

    before();
    appendChildren(imgElmsSlot, imgHolder);

    await waitForOrFailTest(() => {
      after();
      compare(2);

      const previousContentChanged = getLast(domContentObserverObservations, 1);
      should.equal(previousContentChanged, true, 'Adding an content image must result in a content change.');

      const lastContentChanged = getLast(domContentObserverObservations);
      should.equal(lastContentChanged, true, 'The images load event must result in a content change.');
    });
  };

  await add();
  await add();
  await add();

  // test event content change debounce
  const addMultiple = async () => {
    const { before, after, compare } = changedThrough(domContentObserverObservations);
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

      const previousContentChanged = getLast(domContentObserverObservations, 1);
      should.equal(previousContentChanged, true, 'Adding mutliple content images must result in a single content change. (debounced)');

      const lastContentChanged = getLast(domContentObserverObservations);
      should.equal(lastContentChanged, true, 'Multiple images load events must result in a single cintent change. (debounced)');
    });
  };

  await addMultiple();

  removeElements(document.querySelectorAll('.img'));

  await timeout(250);
};
const addRemoveTransitionElmsFn = async () => {
  const startTransition = async (elm: Element, expectTransitionEndContentChange: boolean) => {
    await timeout(50); // time for css to apply class a bit later to trigger transition

    const { before: beforeTransition, after: afterTransition, compare: compareTransition } = changedThrough(domContentObserverObservations);
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

            const contentChanged = getLast(domContentObserverObservations);
            should.equal(contentChanged, true, 'The transitionend event must trigger a event content change.');
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
    const { before, after, compare } = changedThrough(domContentObserverObservations);

    before();

    appendChildren(transitionElmsSlot, elm);

    await waitForOrFailTest(() => {
      after();
      compare(1);

      const contentChanged = getLast(domContentObserverObservations);
      should.equal(contentChanged, true, 'Adding an content element (transition) must result in a content change.');
    });

    await startTransition(elm, expectTransitionEndContentChange && true);
    contentDomObserver._updateEventContentChange(contentChangeArr);
    await startTransition(elm, expectTransitionEndContentChange && false);

    removeElements(elm);

    await timeout(250);
  };

  await add(false);

  contentDomObserver._updateEventContentChange(
    contentChangeArr.concat([
      [
        '.transition',
        (elms) => {
          elms.forEach((elm) => {
            should.equal(hasClass(elm as Element, 'transition'), true, 'Every checked element must match the correpsonding selector.'); // in this case "".transition"
          });
          return 'transitionend';
        },
      ],
    ])
  );

  await add(true);
};
const ignoreTargetChangeFn = async () => {
  const check = async <ChangeThrough extends DOMContentObserverResult | DOMTargetObserverResult>(
    target: Element | null,
    changeThrough: ChangeThrough[]
  ) => {
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

  await check(targetElm, domTargetObserverObservations);
  await check(targetElmContentElm, domContentObserverObservations);
};
const iterateTargetAttrChange = async () => {
  await iterateAttrChange(setTargetAttr, domTargetObserverObservations, (observation, selected) => {
    const { changedTargetAttrs, styleChanged } = observation;
    should.equal(
      changedTargetAttrs.includes(selected),
      true,
      'A attribute change on the target element for a DOMTargetObserver must be inside the changedTargetAttrs array.'
    );
    should.equal(styleChanged, true, 'A style changing attribute on the target element for a DOMTargetObserver must set styleChanged to true.');
  });
  await iterateAttrChange(setFilteredTargetAttr);
};
const iterateContentAttrChange = async () => {
  await iterateAttrChange(setContentAttr, domContentObserverObservations, (observation) => {
    const contentChanged = observation;
    should.equal(contentChanged, true, 'A attribute change inside the content must trigger a content change for a DOMContentObserver.');
  });
  await iterateAttrChange(setFilteredContentAttr);
};
const iterateContentBetweenAttrChange = async () => {
  await iterateAttrChange(setContentBetweenAttr);
  await iterateAttrChange(setFilteredContentBetweenAttr);
};
const iterateContentHostElmAttrChange = async () => {
  await iterateAttrChange(setContentHostElmAttr, domContentObserverObservations, (observation) => {
    const contentChanged = observation;
    should.equal(contentChanged, true, 'A attribute change for a nested target must trigger a content change for a DOMContentObserver.');
  });
  await iterateAttrChange(setFilteredContentHostElmAttr);
};
const triggerContentSummaryChange = async () => {
  await triggerSummaryElemet(summaryContent, domContentObserverObservations);
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

  targetDomObserver._update();
  targetDomObserver._destroy();
  targetDomObserver._update();

  contentDomObserver._updateEventContentChange([]);
  contentDomObserver._update();
  contentDomObserver._destroy();
  contentDomObserver._updateEventContentChange([]);
  contentDomObserver._update();
};

startBtn?.addEventListener('click', start);

export { start };
