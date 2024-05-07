import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { resize, setTestResult, timeout } from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ClickScrollPlugin, ScrollbarsHidingPlugin, SizeObserverPlugin } from '~/plugins';
import {
  addEventListener,
  animateNumber,
  getElementScroll,
  getScrollCoordinatesPercent,
  getScrollCoordinatesPosition,
  getStyles,
} from '~/support';
import should from 'should';
import type { InstancePlugin } from '~/plugins';
import type { PartialOptions } from '~/options';
import type { CloneableScrollbarElements } from '~/overlayscrollbars';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

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

const options: PartialOptions = {
  scrollbars: {
    clickScroll: true,
  },
};
const startButton: HTMLElement | null = document.querySelector('#start');
const directionRTLButton: HTMLElement | null = document.querySelector('#directionRTL');
const flexReverseButton: HTMLElement | null = document.querySelector('#flexReverse');
const stageResizer: HTMLElement | null = document.querySelector('#stageResizer');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
const targetC: HTMLElement | null = document.querySelector('#targetC');
const targetD: HTMLElement | null = document.querySelector('#targetD');
let directionRTL = false;
let flexReverse = false;
const clickErrors: Error[] = [];
const scrollInstance = (osInstance: OverlayScrollbars) => {
  const { scrollCoordinates } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  const { x, y } = getScrollCoordinatesPosition(
    {
      _start: scrollCoordinates.start,
      _end: scrollCoordinates.end,
    },
    {
      x: 0.5,
      y: 0.5,
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
const osInstanceBody = (window.osBody = OverlayScrollbars(document.body, options));

// @ts-ignore
const osInstanceA = (window.osA = OverlayScrollbars(targetA!, options));
// @ts-ignore
const osInstanceB = (window.osB = OverlayScrollbars(targetB!, options));
// @ts-ignore
const osInstanceC = (window.osC = OverlayScrollbars(
  {
    target: targetC!,
    elements: {
      viewport: targetC!,
    },
  },
  options
));
// @ts-ignore
const osInstanceD = (window.osD = OverlayScrollbars(
  {
    target: targetD!,
    elements: {
      viewport: targetD!,
    },
  },
  options
));

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
    const tollerance = isBody ? 0.1 : 0.001;

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
    await Promise.all([createMeasurePromise('width'), createMeasurePromise('height')]);
  } catch (error: unknown) {
    setTestResult(false);
    throw error;
  }
};

const assertScrollbarDirection = async (osInstance: OverlayScrollbars, directionIsRTL: boolean) => {
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

const assetScrollbarClickStopsPropagation = (osInstance: OverlayScrollbars) => {
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

const assertScrollCoordinates = (osInstance: OverlayScrollbars) => {
  const { target } = osInstance.elements();
  const { end } = osInstance.state().scrollCoordinates;
  const hostId = target === document.body ? 'body' : target.getAttribute('id');

  should(end.x).not.equal(0, `Scroll Coordinate EndX is incorrect for "${hostId}".`);
  should(end.y).not.equal(0, `Scroll Coordinate EndY is incorrect for "${hostId}".`);
};

const runBlock = async () => {
  await assertScrollbarDirection(osInstanceA, directionRTL);
  await assertScrollbarDirection(osInstanceB, true); // instanceB has direction:rtl style

  await assertScrollbarDirection(osInstanceC, directionRTL);
  await assertScrollbarDirection(osInstanceD, true); // instanceC has direction:rtl style

  await assertScrollbarDirection(osInstanceBody, directionRTL);

  await resizeStageResizer();

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
  document.documentElement.style.display = '';
  osInstanceBody.update(); // body has no appear detection because viewport is target

  await timeout(500);

  runScrollCoordinates();
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

startButton?.addEventListener('click', async () => {
  setTestResult(null);

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

  if (clickErrors.length > 0) {
    setTestResult(false);
  } else {
    setTestResult(true);
  }
});

assetScrollbarClickStopsPropagation(osInstanceA);
assetScrollbarClickStopsPropagation(osInstanceB);
assetScrollbarClickStopsPropagation(osInstanceC);
assetScrollbarClickStopsPropagation(osInstanceD);
assetScrollbarClickStopsPropagation(osInstanceBody);
scrollInstances();
