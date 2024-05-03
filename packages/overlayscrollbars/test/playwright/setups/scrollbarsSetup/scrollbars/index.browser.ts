import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { resize, setTestResult, timeout } from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin, SizeObserverPlugin } from '~/plugins';
import { addEventListener, animateNumber, convertScrollPosition, getStyles } from '~/support';
import should from 'should';
import type { CloneableScrollbarElements } from '~/overlayscrollbars';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

const startButton: HTMLElement | null = document.querySelector('#start');
const directionRTLButton: HTMLElement | null = document.querySelector('#directionRTL');
const stageResizer: HTMLElement | null = document.querySelector('#stageResizer');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
const targetC: HTMLElement | null = document.querySelector('#targetC');
const targetD: HTMLElement | null = document.querySelector('#targetD');
let directionRTL = false;
const clickErrors: Error[] = [];
const scrollInstance = (osInstance: OverlayScrollbars) => {
  const { overflowAmount, directionRTL: dirRTL } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  scrollOffsetElement.scrollTo({
    behavior: 'auto',
    left: convertScrollPosition(
      (Math.round(overflowAmount.x / overflowAmount.x) * overflowAmount.x) / 2,
      overflowAmount.x,
      dirRTL && OverlayScrollbars.env().rtlScrollBehavior
    ),
    top: (Math.round(overflowAmount.y / overflowAmount.y) * overflowAmount.y) / 2,
  });
};

resize(stageResizer!);

const osInstanceBody = OverlayScrollbars(document.body, {});

const osInstanceA = OverlayScrollbars(targetA!, {});
const osInstanceB = OverlayScrollbars(targetB!, {});
const osInstanceC = OverlayScrollbars(
  {
    target: targetC!,
    elements: {
      viewport: targetC!,
    },
  },
  {}
);
const osInstanceD = OverlayScrollbars(
  {
    target: targetD!,
    elements: {
      viewport: targetD!,
    },
  },
  {}
);

const scrollInstances = () => {
  scrollInstance(osInstanceA);
  scrollInstance(osInstanceB);
  scrollInstance(osInstanceC);
  scrollInstance(osInstanceD);
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
  const hostBcr = host.getBoundingClientRect();
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
      `Vertical scrollbar is not on the right side. (RTL) (Host: "${hostId}") [${hostBcr.left} vs ${scrollbarVerticalBcr.left}]`
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

const runBlock = async () => {
  await assertScrollbarDirection(osInstanceA, directionRTL);
  await assertScrollbarDirection(osInstanceB, true); // instanceB has direction:rtl style

  await assertScrollbarDirection(osInstanceC, directionRTL);
  await assertScrollbarDirection(osInstanceD, true); // instanceC has direction:rtl style

  await assertScrollbarDirection(osInstanceBody, directionRTL);

  await resizeStageResizer();

  stageResizer!.removeAttribute('style');
};

directionRTLButton?.addEventListener('click', () => {
  if (directionRTL) {
    document.body.style.direction = 'ltr';
    directionRTL = false;
  } else {
    document.body.style.direction = 'rtl';
    directionRTL = true;
  }
});

startButton?.addEventListener('click', async () => {
  setTestResult(null);

  await runBlock();

  directionRTLButton!.click();
  stageResizer!.removeAttribute('style');
  await timeout(100);
  scrollInstances();
  await timeout(1000);

  await runBlock();

  await timeout(1000);

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
