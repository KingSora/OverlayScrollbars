import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { resize, setTestResult, timeout } from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ClickScrollPlugin, SizeObserverPlugin } from '~/plugins';
import {
  addEventListener,
  animateNumber,
  getElementScroll,
  getScrollCoordinatesPercent,
  getScrollCoordinatesPosition,
  getStyles,
  hasClass,
} from '~/support';
import should from 'should';
import type { InstancePlugin } from '~/plugins';
import type { ScrollbarsClickScrollBehaviorOptions } from '~/options';
import type { CloneableScrollbarElements } from '~/overlayscrollbars';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
/*
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}
*/

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false, body: false },
});
const noScrollbarHiding = hasClass(document.body, 'nsh');
const animatedClickScroll = hasClass(document.body, 'acs');
const scrollPointsPlugin: InstancePlugin = {
  ['scrollPoints']: {
    instance(osInstance) {
      const { scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
      const scrollPointHorizontalStart = document.createElement('div');
      const scrollPointHorizontalEnd = document.createElement('div');
      const scrollPointVerticalStart = document.createElement('div');
      const scrollPointVerticalEnd = document.createElement('div');

      scrollPointHorizontalStart.classList.add('scrollPoint', 'start');
      scrollPointHorizontalEnd.classList.add('scrollPoint', 'end');

      scrollPointVerticalStart.classList.add('scrollPoint', 'start');
      scrollPointVerticalEnd.classList.add('scrollPoint', 'end');

      scrollbarHorizontal.track.append(scrollPointHorizontalStart);
      scrollbarHorizontal.track.append(scrollPointHorizontalEnd);

      scrollbarVertical.track.append(scrollPointVerticalStart);
      scrollbarVertical.track.append(scrollPointVerticalEnd);
    },
  },
};

OverlayScrollbars.plugin([ClickScrollPlugin, scrollPointsPlugin]);

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

const createClickScrollOptions = (
  osInstance: OverlayScrollbars,
  isHorizontal: boolean
): Partial<ScrollbarsClickScrollBehaviorOptions> => {
  try {
    should.ok(typeof isHorizontal === 'boolean', `Click Scroll isHorizontal is a boolean.`);
  } catch (e: any) {
    console.error(e.message, {
      expected: e.expected,
      actual: e.actual,
      operator: e.operator,
    });

    throw e;
  }
  return {
    clickScrollDistance: 0,
  };
};
const startButton: HTMLElement | null = document.querySelector('#start');
const directionRTLButton: HTMLElement | null = document.querySelector('#directionRTL');
const flexReverseButton: HTMLElement | null = document.querySelector('#flexReverse');
const toggleContentButton: HTMLElement | null = document.querySelector('#toggleContent');
const stageResizer: HTMLElement | null = document.querySelector('#stageResizer');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
const targetC: HTMLElement | null = document.querySelector('#targetC');
const targetD: HTMLElement | null = document.querySelector('#targetD');
let directionRTL = false;
let flexReverse = false;
const clickErrors: Error[] = [];
const scrollInstance = (osInstance: OverlayScrollbars, percent = 0.5) => {
  const { scrollCoordinates } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  const { x, y } = getScrollCoordinatesPosition(
    {
      _start: scrollCoordinates.start,
      _end: scrollCoordinates.end,
    },
    {
      x: percent,
      y: percent,
    }
  );

  scrollOffsetElement.scrollTo({
    behavior: 'instant',
    left: x,
    top: y,
  });
};

resize(stageResizer!);

// @ts-ignore
const osInstanceBody = (window.osBody = OverlayScrollbars(document.body, {
  scrollbars: {
    clickScroll: animatedClickScroll
      ? (isHorizontal) => {
          const clickScrollOpts = createClickScrollOptions(osInstanceBody, isHorizontal);
          return clickScrollOpts;
        }
      : true,
  },
}));

// @ts-ignore
const osInstanceA = (window.osA = OverlayScrollbars(targetA!, {
  scrollbars: {
    clickScroll: animatedClickScroll
      ? (isHorizontal) => {
          const clickScrollOpts = createClickScrollOptions(osInstanceA, isHorizontal);
          return clickScrollOpts;
        }
      : true,
  },
}));
// @ts-ignore
const osInstanceB = (window.osB = OverlayScrollbars(targetB!, {
  scrollbars: {
    clickScroll: animatedClickScroll
      ? (isHorizontal) => {
          const clickScrollOpts = createClickScrollOptions(osInstanceB, isHorizontal);
          return clickScrollOpts;
        }
      : true,
  },
}));
// @ts-ignore
const osInstanceC = (window.osC = OverlayScrollbars(
  {
    target: targetC!,
    elements: {
      viewport: targetC!,
    },
  },
  {
    scrollbars: {
      clickScroll: animatedClickScroll
        ? (isHorizontal) => {
            const clickScrollOpts = createClickScrollOptions(osInstanceC, isHorizontal);
            return clickScrollOpts;
          }
        : true,
    },
  }
));
// @ts-ignore
const osInstanceD = (window.osD = OverlayScrollbars(
  {
    target: targetD!,
    elements: {
      viewport: targetD!,
    },
  },
  {
    scrollbars: {
      clickScroll: animatedClickScroll
        ? (isHorizontal) => {
            const clickScrollOpts = createClickScrollOptions(osInstanceD, isHorizontal);
            return clickScrollOpts;
          }
        : true,
    },
  }
));

const hideContent = () => {
  document.querySelectorAll('.content').forEach((elm) => {
    elm.classList.add('noContent');
  });
};

const showContent = () => {
  document.querySelectorAll('.content').forEach((elm) => {
    elm.classList.remove('noContent');
  });
};

const toggleContent = () => {
  const hasContent = !document.querySelectorAll('.noContent').length;
  if (hasContent) {
    hideContent();
  } else {
    showContent();
  }
};

const scrollInstances = async () => {
  scrollInstance(osInstanceBody);
  scrollInstance(osInstanceA);
  scrollInstance(osInstanceB);
  scrollInstance(osInstanceC);
  scrollInstance(osInstanceD);

  await timeout(100);

  // dont check body as overflow is too small for accurate values
  [osInstanceBody, osInstanceA, osInstanceB, osInstanceC, osInstanceD].forEach((osInstance) => {
    const { scrollOffsetElement } = osInstance.elements();
    const { scrollCoordinates } = osInstance.state();
    const { x, y } = getScrollCoordinatesPercent(
      {
        _start: scrollCoordinates.start,
        _end: scrollCoordinates.end,
      },
      getElementScroll(scrollOffsetElement)
    );
    const { target } = osInstance.elements();
    const isBody = target === document.body;
    const hostId = isBody ? 'body' : target.getAttribute('id')!;
    const tollerance = noScrollbarHiding ? 1 : isBody ? 0.1 : 0.001;

    // body has to small overflow for accurate measuring...
    if (!isBody) {
      should.ok(
        Math.abs(0.5 - x) < tollerance,
        `ScrollX didnt result in correct scroll coordinates. ${x} "${hostId}"`
      );
      should.ok(
        Math.abs(0.5 - y) < tollerance,
        `ScrollY didnt result in correct scroll coordinates. ${y} "${hostId}"`
      );
    }
  });
};

const updateInstances = () => {
  osInstanceBody.update();
  osInstanceA.update();
  osInstanceB.update();
  osInstanceC.update();
  osInstanceD.update();
};

const resizeStageResizer = async () => {
  stageResizer!.removeAttribute('style');
  const rect = stageResizer!.getBoundingClientRect();

  const measureScrollbar = (scrollbarElements: CloneableScrollbarElements) => {
    const { scrollbar } = scrollbarElements;
    const transformStyle = getStyles(scrollbar, 'transform');
    should.ok(transformStyle !== 'none', 'Scrollbar has no transform');
  };
  const measureHandle = (scrollbarElements: CloneableScrollbarElements) => {
    const { handle } = scrollbarElements;
    const transformStyle = getStyles(handle, 'transform');
    should.ok(transformStyle !== 'none', 'Handle has no transform');
  };
  const measureInstanceScrollbars = (osInstance: OverlayScrollbars) => {
    const { scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
    measureScrollbar(scrollbarHorizontal);
    measureScrollbar(scrollbarVertical);
  };
  const measureInstanceScrollHandles = (osInstance: OverlayScrollbars) => {
    const { scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
    measureHandle(scrollbarHorizontal);
    measureHandle(scrollbarVertical);
  };
  const measureInstances = (onError: (error: unknown) => void) => {
    try {
      measureInstanceScrollHandles(osInstanceA);
      measureInstanceScrollHandles(osInstanceB);
      measureInstanceScrollHandles(osInstanceC);
      measureInstanceScrollHandles(osInstanceD);

      // only viewportIsTarget instances
      measureInstanceScrollbars(osInstanceC);
      measureInstanceScrollbars(osInstanceD);
    } catch (error: unknown) {
      onError(error);
    }
  };

  const createMeasurePromise = (property: 'width' | 'height') => {
    let promiseError: unknown;
    const promise = new Promise<void>((resolve, reject) => {
      const intervalId = setInterval(() =>
        measureInstances((error) => {
          promiseError = error;
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          abortAnimation(true);
        })
      );
      const abortAnimation = animateNumber(
        rect[property],
        rect[property] / 3,
        600,
        (progress, _, completed) => {
          stageResizer!.style[property] = `${progress}px`;
          if (completed) {
            clearInterval(intervalId);

            if (promiseError) {
              reject(promiseError);
              return;
            }

            resolve();
          }
        }
      );
    });
    return promise;
  };

  try {
    if (noScrollbarHiding) {
      return;
    }
    await Promise.all([createMeasurePromise('width'), createMeasurePromise('height')]);
  } catch (error: unknown) {
    setTestResult(false);
    throw error;
  }
};

const assertScrollbarDirection = async (osInstance: OverlayScrollbars, directionIsRTL: boolean) => {
  if (noScrollbarHiding) {
    return;
  }

  const { directionRTL: instanceDirectionRTL } = osInstance.state();
  const { scrollbarHorizontal, scrollbarVertical, target, host } = osInstance.elements();
  const isBody = target === document.body;
  const hostId = isBody ? 'body' : target.getAttribute('id');
  const hostBcr = isBody ? { left: 0, right: window.innerWidth } : host.getBoundingClientRect();
  const scrollbarHorizontalBcr = scrollbarHorizontal.scrollbar.getBoundingClientRect();
  const scrollbarVerticalBcr = scrollbarVertical.scrollbar.getBoundingClientRect();
  const plusMinusSame = (a: number, b: number) => {
    const result = Math.abs(a - b);
    return result <= 1;
  };

  should.equal(
    instanceDirectionRTL,
    directionIsRTL,
    `Instance direction RTL doesn't match passed direction RTL. (Host: "${hostId}")`
  );

  if (directionIsRTL && !isBody) {
    should.ok(
      plusMinusSame(hostBcr.left, scrollbarVerticalBcr.left),
      `Vertical scrollbar is not on the right side. (RTL) (Host: "${hostId}")`
    );
    should.ok(
      plusMinusSame(scrollbarHorizontalBcr.left, scrollbarVerticalBcr.right),
      `Horizontal scrollbar is not on the right side. (RTL) (Host: "${hostId}")`
    );
  } else {
    should.ok(
      plusMinusSame(hostBcr.right, scrollbarVerticalBcr.right),
      `Vertical scrollbar is not on the right side. (LTR) (Host: "${hostId}")`
    );
    should.ok(
      plusMinusSame(scrollbarHorizontalBcr.right, scrollbarVerticalBcr.left),
      `Horizontal scrollbar is not on the right side. (LTR) (Host: "${hostId}")`
    );
  }
};

const assertScrollbarClickStopsPropagation = (osInstance: OverlayScrollbars) => {
  const { host, scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
  const hostId = host === document.body ? 'body' : host.getAttribute('id');
  const isScrollbarElement = (
    element: EventTarget | null,
    scrollbarElements: CloneableScrollbarElements
  ) => {
    const { scrollbar, track, handle } = scrollbarElements;
    return element === scrollbar || element === track || element === handle;
  };
  addEventListener(
    document,
    'click',
    (e) => {
      if (
        !isScrollbarElement(e.target, scrollbarHorizontal) &&
        !isScrollbarElement(e.target, scrollbarVertical)
      ) {
        return;
      }

      setTimeout(() => {
        if (!e.defaultPrevented) {
          const error = new Error(`Host received unprevented click. (Host: "${hostId}")`);
          clickErrors.push(error);
          throw error;
        }
      }, 100);
    },
    {
      _capture: true,
    }
  );
  addEventListener(host, 'click', (e) => {
    if (
      !isScrollbarElement(e.target, scrollbarHorizontal) &&
      !isScrollbarElement(e.target, scrollbarVertical)
    ) {
      return;
    }
    const error = new Error(`Host received click event through scrollbar. (Host: "${hostId}")`);
    clickErrors.push(error);
    throw error;
  });
};

const assertScrollbarTheme = async (osInstance: OverlayScrollbars) => {
  const { scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
  if (noScrollbarHiding) {
    should.ok(
      scrollbarHorizontal.scrollbar.classList.contains('os-theme-none'),
      'No scrollbar hiding should result in theme none. (horizontal)'
    );
    should.ok(
      scrollbarVertical.scrollbar.classList.contains('os-theme-none'),
      'No scrollbar hiding should result in theme none. (vertical)'
    );
    return;
  }
};

const assertScrollCoordinates = (osInstance: OverlayScrollbars) => {
  const { target } = osInstance.elements();
  const hostId = target === document.body ? 'body' : target.getAttribute('id');

  const { scrollCoordinates, overflowAmount } = osInstance.state();
  const { start, end } = scrollCoordinates;

  should.equal(
    Math.abs(start.x + end.x),
    overflowAmount.x,
    `OverflowAmountX and ScrollCoordinatesX matches for "${hostId}".`
  );
  should.equal(
    Math.abs(start.y + end.y),
    overflowAmount.y,
    `OverflowAmountY and ScrollCoordinatesY matches for "${hostId}".`
  );
};

const runBlock = async () => {
  await runScrollInstancesAfterHiddenContentScrollDirectionChange();

  await assertScrollbarDirection(osInstanceA, directionRTL);
  await assertScrollbarDirection(osInstanceB, true); // instanceB has direction:rtl style

  await assertScrollbarDirection(osInstanceC, directionRTL);
  await assertScrollbarDirection(osInstanceD, true); // instanceC has direction:rtl style

  await assertScrollbarDirection(osInstanceBody, directionRTL);

  await resizeStageResizer();

  await assertScrollbarTheme(osInstanceBody);
  await assertScrollbarTheme(osInstanceA);
  await assertScrollbarTheme(osInstanceB);
  await assertScrollbarTheme(osInstanceC);
  await assertScrollbarTheme(osInstanceD);

  stageResizer!.removeAttribute('style');
};

const runScrollCoordinates = () => {
  [osInstanceBody, osInstanceA, osInstanceB, osInstanceC, osInstanceD].forEach(
    assertScrollCoordinates
  );
};

const runScrollCoordinatesAfterHidden = async () => {
  updateInstances();
  document.documentElement.style.display = 'none';
  updateInstances();
  await timeout(100);
  document.documentElement.style.display = '';
  await timeout(100);

  runScrollCoordinates();
};

const runScrollInstancesAfterHiddenContentScrollDirectionChange = async () => {
  const wasFlexReverse = document.body.classList.contains('flexReverse');

  hideContent();
  if (wasFlexReverse) {
    document.body.classList.remove('flexReverse');
  } else {
    document.body.classList.add('flexReverse');
  }
  await timeout(100);

  showContent();

  await timeout(100);
  runScrollCoordinates();

  if (wasFlexReverse) {
    document.body.classList.add('flexReverse');
  } else {
    document.body.classList.remove('flexReverse');
  }

  updateInstances();
  await scrollInstances();
};

const runUpdateAndScrollInstances = async () => {
  const checkInstance = async (osInstance: OverlayScrollbars) => {
    let scrolled = false;
    const listener = () => {
      scrolled = true;
    };
    const { target, scrollEventElement } = osInstance.elements();
    const hostId = target === document.body ? 'body' : target.getAttribute('id');

    scrollInstance(osInstance, 0);

    await timeout(100);

    scrollEventElement.addEventListener('scroll', listener);
    osInstance.update(true);
    scrollInstance(osInstance);

    await timeout(100);

    should.ok(scrolled, `Instance receives scroll event after update. (${hostId})`);
    osInstance.elements().scrollEventElement.removeEventListener('scroll', listener);
  };

  await timeout(100);

  await checkInstance(osInstanceBody);
  await checkInstance(osInstanceA);
  await checkInstance(osInstanceB);
  await checkInstance(osInstanceC);
  await checkInstance(osInstanceD);
};

directionRTLButton?.addEventListener('click', () => {
  if (directionRTL) {
    document.documentElement.style.direction = 'ltr';
    directionRTL = false;
  } else {
    document.documentElement.style.direction = 'rtl';
    directionRTL = true;
  }
});

flexReverseButton?.addEventListener('click', () => {
  if (flexReverse) {
    document.body.classList.remove('flexReverse');
    flexReverse = false;
  } else {
    document.body.classList.add('flexReverse');
    flexReverse = true;
  }

  updateInstances();
  scrollInstances();
});

toggleContentButton?.addEventListener('click', () => {
  toggleContent();
});

startButton?.addEventListener('click', async () => {
  setTestResult(null);

  try {
    await scrollInstances();

    runScrollCoordinates();

    // first block (ltr)
    await runBlock();

    // second block (rtl)
    directionRTLButton!.click();
    stageResizer!.removeAttribute('style');
    await timeout(100);
    await scrollInstances();
    await runBlock();

    await timeout(500);

    await runScrollCoordinatesAfterHidden();
    await scrollInstances();

    await runUpdateAndScrollInstances();

    if (clickErrors.length > 0) {
      setTestResult(false);
    } else {
      setTestResult(true);
    }
  } catch (e: any) {
    setTestResult(false);

    console.error(e.message, {
      expected: e.expected,
      actual: e.actual,
      operator: e.operator,
    });

    throw e;
  }
});

assertScrollbarClickStopsPropagation(osInstanceA);
assertScrollbarClickStopsPropagation(osInstanceB);
assertScrollbarClickStopsPropagation(osInstanceC);
assertScrollbarClickStopsPropagation(osInstanceD);
assertScrollbarClickStopsPropagation(osInstanceBody);

scrollInstances();
