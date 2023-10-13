import '~/index.scss';
import './index.scss';
import should from 'should';
import {
  generateSelectCallback,
  iterateSelect,
  timeout,
  setTestResult,
  waitForOrFailTest,
} from '@~local/browser-testing';
import {
  appendChildren,
  createDiv,
  removeElements,
  children,
  isArray,
  isNumber,
  liesBetween,
  addClass,
  removeClass,
  diffClass,
  addEventListener,
} from '~/support';
import { createDOMObserver } from '~/observers';

type DOMContentObserverResult = {
  contentChange: boolean;
  troughEvent: boolean;
};
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
const trargetContentElm: HTMLElement | null = document.querySelector('#target .content');
const targetElmContentElm: HTMLElement | null = document.querySelector('#content-host');
const contentElmAttrChange: HTMLElement | null = document.querySelector('#target .content-nest');
const contentBetweenElmAttrChange: HTMLElement | null = document.querySelector(
  '#content-host .padding-nest-item'
);
const contentHostElmAttrChange: HTMLElement | null =
  document.querySelector('#content-nest-item-host');

const targetElmsSlot = document.querySelector('#target .host-nest-item');
const targetContentElmsSlot = document.querySelector('#target .content .content-nest');
const targetContentBetweenElmsSlot = document.querySelector('#content-host');
const imgElmsSlot = document.querySelector('#target .content-nest');
const transitionElmsSlot = document.querySelector('#content-host .content');

const addRemoveTargetElms: HTMLButtonElement | null =
  document.querySelector('#addRemoveTargetElms');
const addRemoveTargetContentElms: HTMLButtonElement | null = document.querySelector(
  '#addRemoveTargetContentElms'
);
const addRemoveTargetContentBetweenElms: HTMLButtonElement | null = document.querySelector(
  '#addRemoveTargetContentBetweenElms'
);
const addRemoveImgElms: HTMLButtonElement | null = document.querySelector('#addRemoveImgElms');
const addRemoveTransitionElms: HTMLButtonElement | null = document.querySelector(
  '#addRemoveTransitionElms'
);
const ignoreTargetChange: HTMLButtonElement | null = document.querySelector('#ignoreTargetChange');
const setTargetAttr: HTMLSelectElement | null = document.querySelector('#setTargetAttr');
const setFilteredTargetAttr: HTMLSelectElement | null =
  document.querySelector('#setFilteredTargetAttr');
const setContentAttr: HTMLSelectElement | null = document.querySelector('#setContentAttr');
const setFilteredContentAttr: HTMLSelectElement | null =
  document.querySelector('#setFilteredContentAttr');
const setContentBetweenAttr: HTMLSelectElement | null =
  document.querySelector('#setContentBetweenAttr');
const setFilteredContentBetweenAttr: HTMLSelectElement | null = document.querySelector(
  '#setFilteredContentBetweenAttr'
);
const setContentHostElmAttr: HTMLSelectElement | null =
  document.querySelector('#setContentHostElmAttr');
const setFilteredContentHostElmAttr: HTMLSelectElement | null = document.querySelector(
  '#setFilteredContentHostElmAttr'
);
const summaryContent: HTMLElement | null = document.querySelector('#summary-content');
const summaryBetween: HTMLElement | null = document.querySelector('#summary-between');

const startBtn: HTMLButtonElement | null = document.querySelector('#start');

const hostSelector = '.host';
const ignorePrefix = 'ignore';
const attrs = ['id', 'class', 'style', 'open'];
const contentChange: Array<[string?, string?]> = [['img', 'load']];
const domTargetObserverObservations: DOMTargetObserverResult[] = [];
const domContentObserverObservations: DOMContentObserverResult[] = [];

const [constructTargetDomObserver, updateTargetDomObserver] = createDOMObserver(
  document.querySelector('#target')!,
  false,
  (changedTargetAttrs: string[], styleChanged: boolean) => {
    should.ok(
      Array.isArray(changedTargetAttrs),
      'The changedTargetAttrs parameter in a target dom observer must be a array.'
    );
    should.equal(
      typeof styleChanged,
      'boolean',
      'The styleChanged parameter in a target dom observer must be a boolean.'
    );

    if (styleChanged && changedTargetAttrs.length === 0) {
      should.ok(
        false,
        'Style changing properties must always be inside the changedTargetAttrs array.'
      );
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
  }
);
const destroyTargetDomObserver = constructTargetDomObserver();

const createContentDomOserver = (
  eventContentChange: Array<[string?, string?] | null | undefined>
) =>
  createDOMObserver(
    trargetContentElm!,
    true,
    (contentChangedTroughEvent: boolean) => {
      should.equal(
        typeof contentChangedTroughEvent,
        'boolean',
        'The contentChanged parameter in a content dom observer must be a boolean.'
      );

      domContentObserverObservations.push({
        contentChange: true,
        troughEvent: contentChangedTroughEvent,
      });
      requestAnimationFrame(() => {
        if (contentChangesCountSlot) {
          contentChangesCountSlot.textContent = `${domContentObserverObservations.length}`;
        }
      });
    },
    {
      _attributes: attrs,
      _eventContentChange: eventContentChange,
      _nestedTargetSelector: hostSelector,
      _ignoreContentChange: (mutation, isNestedTarget) => {
        const { target, attributeName } = mutation;
        return isNestedTarget
          ? false
          : attributeName
          ? liesBetween(target as Element, hostSelector, '.content')
          : false;
      },
      _ignoreTargetChange: (_target, attrName, oldValue, newValue) => {
        if (attrName === 'class' && oldValue && newValue) {
          const diff = diffClass(oldValue, newValue);
          const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
          return ignore;
        }
        return false;
      },
    }
  );

let destroyContentDomObserver: (() => void) | undefined;
let updateContentDomObserver: (() => void) | undefined;

const createNewContentDomOserver = (
  eventContentChange: Array<[string?, string?] | null | undefined>
) => {
  destroyContentDomObserver && destroyContentDomObserver();
  const [construct, update] = createContentDomOserver(eventContentChange);
  destroyContentDomObserver = construct();
  updateContentDomObserver = update;
};

createNewContentDomOserver(contentChange);

const getTotalObservations = () =>
  domTargetObserverObservations.length + domContentObserverObservations.length;
const getLast = <T>(arr: T[], indexFromLast = 0): T =>
  arr[arr.length - 1 - indexFromLast] || ({} as T);
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

  const getStats = (): Stat => ({
    total: getTotalObservations(),
    lists: (observationLists as Array<ChangeThrough[]>).map((list) => [list, list.length]),
  });

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
const iterateAttrChange = async <
  ChangeThrough extends DOMContentObserverResult | DOMTargetObserverResult
>(
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
const addRemoveElementsTest = async (
  slot: Element | null,
  changeThrough?: DOMContentObserverResult[] | SeparateChangeThrough
) => {
  if (slot) {
    let addChangeThrough: DOMContentObserverResult[] | undefined = changeThrough as
      | DOMContentObserverResult[]
      | undefined;
    let removeChangeThrough: DOMContentObserverResult[] | undefined = changeThrough as
      | DOMContentObserverResult[]
      | undefined;
    if (changeThrough && !isArray(changeThrough)) {
      addChangeThrough = changeThrough.added;
      removeChangeThrough = changeThrough.removed;
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
          should.deepEqual(
            contentChanged,
            { contentChange: true, troughEvent: false },
            'Adding an content element must result in a content change.'
          );
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
            should.deepEqual(
              contentChanged,
              { contentChange: true, troughEvent: false },
              'Removing an content element must result in a content change.'
            );
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
const triggerSummaryElemet = async (
  summaryElm: HTMLElement | null,
  changeThrough?: DOMContentObserverResult[]
) => {
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
const addRemoveImgElmsFn = async (changeless = false) => {
  const add = async () => {
    const img = new Image(1, 1);
    img.src = 'www.something.com/something/sometest';
    setTimeout(() => {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    }, 250);

    const { before, after, compare } = changedThrough(domContentObserverObservations);
    const imgHolder = createDiv('img');
    appendChildren(imgHolder, img);

    before();
    appendChildren(imgElmsSlot, imgHolder);

    await timeout(250);

    await waitForOrFailTest(() => {
      after();
      compare(changeless ? 0 : 2);

      if (!changeless) {
        const previousContentChanged = getLast(domContentObserverObservations, 1);
        should.deepEqual(
          previousContentChanged,
          { contentChange: true, troughEvent: false },
          'Adding an content image must result in a content change.'
        );

        const lastContentChanged = getLast(domContentObserverObservations);
        should.deepEqual(
          lastContentChanged,
          { contentChange: true, troughEvent: true },
          'The images load event must result in a content change.'
        );
      }
    });
  };

  await add();
  await add();
  await add();

  // test event content change debounce
  const addMultiple = async () => {
    const { before, after, compare } = changedThrough(domContentObserverObservations);
    const genImage = () => {
      const img = new Image(1, 1);
      img.src = 'www.something.com/something/sometest';
      setTimeout(() => {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
      }, 250);

      const imgHolder = createDiv('img');
      appendChildren(imgHolder, img);

      return imgHolder;
    };

    await timeout(250);

    before();
    appendChildren(imgElmsSlot, [genImage(), genImage(), genImage()]);

    await timeout(250);

    await waitForOrFailTest(() => {
      after();
      compare(changeless ? 0 : 2);

      if (!changeless) {
        const previousContentChanged = getLast(domContentObserverObservations, 1);
        should.deepEqual(
          previousContentChanged,
          { contentChange: true, troughEvent: false },
          'Adding mutliple content images must result in a single content change. (debounced)'
        );

        const lastContentChanged = getLast(domContentObserverObservations);
        should.deepEqual(
          lastContentChanged,
          { contentChange: true, troughEvent: true },
          'Multiple images load events must result in a single cintent change. (debounced)'
        );
      }
    });
  };

  await addMultiple();

  // remove load event from image test
  const addChanged = async (
    newEventContentChange: Array<[string?, string?] | null | undefined>
  ) => {
    createNewContentDomOserver(newEventContentChange);

    const img = new Image(1, 1);
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    const { before, after, compare } = changedThrough(domContentObserverObservations);
    const imgHolder = createDiv('img');
    appendChildren(imgHolder, img);

    before();
    appendChildren(imgElmsSlot, imgHolder);

    await timeout(250);

    await waitForOrFailTest(() => {
      after();
      compare(1);
    });

    createNewContentDomOserver(contentChange);
  };

  if (!changeless) {
    await addChanged([
      ['img', 'something'],
      ['img', 'something2'],
      ['img', ''],
      ['img', undefined],
      ['', ''],
      [undefined, undefined],
      null,
      undefined,
    ]);
    await addChanged([]);
  }

  removeElements(document.querySelectorAll('.img'));

  await timeout(250);
};
const addRemoveTransitionElmsFn = async () => {
  const startTransition = async (elm: Element, expectTransitionEndContentChange: boolean) => {
    await timeout(50); // time for css to apply class a bit later to trigger transition

    const {
      before: beforeTransition,
      after: afterTransition,
      compare: compareTransition,
    } = changedThrough(domContentObserverObservations);
    beforeTransition();
    removeClass(elm, 'resetTransition'); // IE...
    addClass(elm, 'active');

    await new Promise((resolve) => {
      addEventListener(
        elm,
        'transitionend',
        async () => {
          await waitForOrFailTest(() => {
            afterTransition();
            compareTransition(expectTransitionEndContentChange ? 2 : 1); // 2 because 1: added class mutation and 2: transition end event

            const contentChanged = getLast(domContentObserverObservations);
            should.deepEqual(
              contentChanged,
              { contentChange: true, troughEvent: expectTransitionEndContentChange },
              'The transitionend event must trigger a event content change.'
            );
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
      should.deepEqual(
        contentChanged,
        { contentChange: true, troughEvent: false },
        'Adding an content element (transition) must result in a content change.'
      );
    });

    await startTransition(elm, expectTransitionEndContentChange && true);

    createNewContentDomOserver(contentChange);

    await startTransition(elm, expectTransitionEndContentChange && false);

    removeElements(elm);

    await timeout(250);
  };

  await add(false);

  createNewContentDomOserver(contentChange.concat([['.transition', 'transitionend']]));

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
    should.equal(
      styleChanged,
      true,
      'A style changing attribute on the target element for a DOMTargetObserver must set styleChanged to true.'
    );
  });
  await iterateAttrChange(setFilteredTargetAttr);
};
const iterateContentAttrChange = async () => {
  await iterateAttrChange(setContentAttr, domContentObserverObservations, (observation) => {
    const contentChanged = observation;
    should.deepEqual(
      contentChanged,
      { contentChange: true, troughEvent: false },
      'A attribute change inside the content must trigger a content change for a DOMContentObserver.'
    );
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
    should.deepEqual(
      contentChanged,
      { contentChange: true, troughEvent: false },
      'A attribute change for a nested target must trigger a content change for a DOMContentObserver.'
    );
  });
  await iterateAttrChange(setFilteredContentHostElmAttr);
};
const triggerContentSummaryChange = async () => {
  await triggerSummaryElemet(summaryContent, domContentObserverObservations);
};
const triggerBetweenSummaryChange = async () => {
  await triggerSummaryElemet(summaryBetween);
};

addRemoveTargetElms?.addEventListener('click', () => {
  addRemoveTargetElmsFn();
});
addRemoveTargetContentElms?.addEventListener('click', () => {
  addRemoveTargetContentElmsFn();
});
addRemoveTargetContentBetweenElms?.addEventListener('click', () => {
  addRemoveTargetContentBetweenElmsFn();
});
addRemoveImgElms?.addEventListener('click', () => {
  addRemoveImgElmsFn();
});
addRemoveTransitionElms?.addEventListener('click', () => {
  addRemoveTransitionElmsFn();
});
ignoreTargetChange?.addEventListener('click', () => {
  ignoreTargetChangeFn();
});
setTargetAttr?.addEventListener('change', attrChangeListener(targetElm));
setFilteredTargetAttr?.addEventListener('change', attrChangeListener(targetElm));
setContentAttr?.addEventListener('change', attrChangeListener(contentElmAttrChange));
setFilteredContentAttr?.addEventListener('change', attrChangeListener(contentElmAttrChange));
setContentBetweenAttr?.addEventListener('change', attrChangeListener(contentBetweenElmAttrChange));
setFilteredContentBetweenAttr?.addEventListener(
  'change',
  attrChangeListener(contentBetweenElmAttrChange)
);
setContentHostElmAttr?.addEventListener('change', attrChangeListener(contentHostElmAttrChange));
setFilteredContentHostElmAttr?.addEventListener(
  'change',
  attrChangeListener(contentHostElmAttrChange)
);

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

  updateTargetDomObserver();
  destroyTargetDomObserver();
  destroyTargetDomObserver();
  updateTargetDomObserver();

  updateContentDomObserver && updateContentDomObserver();
  destroyContentDomObserver && destroyContentDomObserver();
  updateContentDomObserver && updateContentDomObserver();

  await addRemoveImgElmsFn(true); // won't trigger changes after destroy

  setTestResult(true);
};

startBtn?.addEventListener('click', () => {
  start();
});

export { start };
