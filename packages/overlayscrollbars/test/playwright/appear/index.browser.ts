import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout, waitForOrFailTest } from '@~local/browser-testing';
import should from 'should';
import { getStyles } from '~/support';

if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

const startBtn = document.querySelector<HTMLButtonElement>('#start')!;
const appearBtn = document.querySelector<HTMLButtonElement>('#appear')!;
const hideWrapperBtn = document.querySelector<HTMLButtonElement>('#hideWrapper')!;
const wrapperElement = document.querySelector<HTMLElement>('#wrapper')!;
const targetAElement = document.querySelector<HTMLElement>('#targetA')!;
const targetBElement = document.querySelector<HTMLElement>('#targetB')!;
const targetCElement = document.querySelector<HTMLElement>('#targetC')!;
const targetDElement = document.querySelector<HTMLElement>('#targetD')!;
const targetAAppearCountSlot = document.querySelector<HTMLElement>('#targetAAppearCount')!;
const targetBAppearCountSlot = document.querySelector<HTMLElement>('#targetBAppearCount')!;
const targetCAppearCountSlot = document.querySelector<HTMLElement>('#targetCAppearCount')!;
const targetDAppearCountSlot = document.querySelector<HTMLElement>('#targetDAppearCount')!;
const autoHideSuspend = document.body.classList.contains('autoHideSuspend');
let targetAAppearCount = 0;
let targetBAppearCount = 0;
let targetCAppearCount = 0;
let targetDAppearCount = 0;
let targetAScrollCount = 0;
let targetBScrollCount = 0;
let targetCScrollCount = 0;
let targetDScrollCount = 0;
let appeared = false;
let wrapperHidden = false;

const updateAppearCounts = () => {
  targetAAppearCountSlot.textContent = String(targetAAppearCount);
  targetBAppearCountSlot.textContent = String(targetBAppearCount);
  targetCAppearCountSlot.textContent = String(targetCAppearCount);
  targetDAppearCountSlot.textContent = String(targetDAppearCount);
};

// @ts-ignore
const osInstanceA = (window.osA = OverlayScrollbars(
  targetAElement,
  {
    scrollbars: {
      autoHide: 'scroll',
      autoHideSuspend,
    },
  },
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetAAppearCount++;
        updateAppearCounts();
      }
    },
    scroll: () => {
      targetAScrollCount++;
    },
  }
));
// @ts-ignore
const osInstanceB = (window.osB = OverlayScrollbars(
  {
    target: targetBElement,
    elements: {
      viewport: targetBElement,
    },
  },
  {
    scrollbars: {
      autoHide: 'move',
      autoHideSuspend,
    },
  },
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetBAppearCount++;
        updateAppearCounts();
      }
    },
    scroll: () => {
      targetBScrollCount++;
    },
  }
));
// @ts-ignore
const osInstanceC = (window.osC = OverlayScrollbars(
  targetCElement,
  {
    scrollbars: {
      autoHide: 'leave',
      autoHideSuspend,
    },
  },
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetCAppearCount++;
        updateAppearCounts();
      }
    },
    scroll: () => {
      targetCScrollCount++;
    },
  }
));
// @ts-ignore
const osInstanceD = (window.osD = OverlayScrollbars(
  {
    target: targetDElement,
    elements: {
      viewport: targetDElement,
    },
  },
  {
    scrollbars: {
      autoHide: 'never',
      autoHideSuspend,
    },
  },
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetDAppearCount++;
        updateAppearCounts();
      }
    },
    scroll: () => {
      targetDScrollCount++;
    },
  }
));

const assertScrollbarVisibility = async (
  osInstance: OverlayScrollbars,
  visible: boolean,
  message: string
) => {
  await timeout(3000);

  const { host, scrollbarHorizontal, scrollbarVertical } = osInstance.elements();
  const hostId = host.id;

  const hStyles = getStyles(scrollbarHorizontal.scrollbar, ['visibility', 'opacity']);
  const vStyles = getStyles(scrollbarVertical.scrollbar, ['visibility', 'opacity']);

  if (visible) {
    should(hStyles.visibility).equal(
      'visible',
      `ScrollbarX visibility is visible. (${hostId}) [${message}]`
    );
    should(vStyles.visibility).equal(
      'visible',
      `ScrollbarY visibility is visible. (${hostId}) [${message}]`
    );

    should(hStyles.opacity).equal('1', `ScrollbarX opacity is 1. (${hostId}) [${message}]`);
    should(vStyles.opacity).equal('1', `ScrollbarY opacity is 1. (${hostId}) [${message}]`);
  } else {
    should(hStyles.visibility).equal(
      'hidden',
      `ScrollbarX visibility is hidden. (${hostId}) [${message}]`
    );
    should(vStyles.visibility).equal(
      'hidden',
      `ScrollbarY visibility is hidden. (${hostId}) [${message}]`
    );

    should(hStyles.opacity).equal('0', `ScrollbarX opacity is 0. (${hostId}) [${message}]`);
    should(vStyles.opacity).equal('0', `ScrollbarY opacity is 0. (${hostId}) [${message}]`);
  }
};

const appear = async () => {
  targetAElement.classList.add('appear');
  targetBElement.classList.add('appear');
};

const disappear = () => {
  targetAElement.classList.remove('appear');
  targetBElement.classList.remove('appear');
};

const hideWrapper = () => {
  wrapperElement.style.display = 'none';
};

const showWrapper = () => {
  wrapperElement.style.display = '';
};

appearBtn.addEventListener('click', () => {
  if (appeared) {
    disappear();
    appeared = false;
  } else {
    appear();
    appeared = true;
  }
});

hideWrapperBtn.addEventListener('click', () => {
  if (wrapperHidden) {
    showWrapper();
    wrapperHidden = false;
  } else {
    hideWrapper();
    wrapperHidden = true;
  }
});

const updateInstances = (force?: boolean) => {
  osInstanceA.update(force);
  osInstanceB.update(force);
};

const checkInstanceState = (osInstance: OverlayScrollbars, before?: boolean) => {
  const { host } = osInstance.elements();
  const { scrollCoordinates, overflowAmount, hasOverflow } = osInstance.state();
  const { start, end } = scrollCoordinates;
  const beforeAfter = before ? 'before' : 'after';
  const hostId = host.id;

  if (!before) {
    should(overflowAmount.x).greaterThan(
      0,
      `Scroll AmountX must be greater than 0 ${beforeAfter} appear. (${hostId})`
    );
    should(overflowAmount.y).greaterThan(
      0,
      `Scroll AmountY must be greater than 0 ${beforeAfter} appear. (${hostId})`
    );
    should(hasOverflow.x).equal(
      true,
      `Scroll OverflowX must be true ${beforeAfter} appear. (${hostId})`
    );
    should(hasOverflow.y).equal(
      true,
      `Scroll OverflowY must be true ${beforeAfter} appear. (${hostId})`
    );
  }

  should(Math.abs(start.x + end.x)).equal(
    overflowAmount.x,
    `ScrollCoordinatesX must equal overflowAmountX ${beforeAfter} appear. (${hostId})`
  );
  should(Math.abs(start.y + end.y)).equal(
    overflowAmount.y,
    `ScrollCoordinatesY must equal overflowAmountY ${beforeAfter} appear. (${hostId})`
  );
};

const runAppear = async (expectedAppearCount: number) => {
  should(getStyles(targetAElement, ['display']).display).equal(
    'none',
    `Target A is hidden with a simple class selector.`
  );
  should(getStyles(targetBElement, ['display']).display).equal(
    'none',
    `Target B is hidden with a simple class selector.`
  );

  const firstAppear = expectedAppearCount === 0;
  const appearCountABefore = targetAAppearCount;
  const appearCountBBefore = targetBAppearCount;

  should.ok(
    appearCountABefore === expectedAppearCount,
    `Appear count must be ${expectedAppearCount} before appear. (TargetA)`
  );
  should.ok(
    appearCountBBefore === expectedAppearCount,
    `Appear count must be ${expectedAppearCount} before appear. (TargetB)`
  );

  if (firstAppear) {
    checkInstanceState(osInstanceA, true);
    checkInstanceState(osInstanceB, true);
  }

  await appear();

  await waitForOrFailTest(async () => {
    should.ok(
      appearCountABefore === targetAAppearCount - 1,
      'Appear count must change +1 on appear. (TargetA)'
    );
    should.ok(
      appearCountBBefore === targetBAppearCount - 1,
      'Appear count must change +1 on appear. (TargetB)'
    );
  });

  checkInstanceState(osInstanceA);
  checkInstanceState(osInstanceB);

  await timeout(100);
};

const runHideWrapper = async () => {
  appear();

  await timeout(100);

  should(getStyles(targetAElement, ['display']).display).not.equal(
    'none',
    `Target A must not be hidden for wrapper test.`
  );
  should(getStyles(targetBElement, ['display']).display).not.equal(
    'none',
    `Target B must not be hidden for wrapper test.`
  );

  const appearCountABefore = targetAAppearCount;
  const appearCountBBefore = targetBAppearCount;
  const appearCountCBefore = targetCAppearCount;
  const appearCountDBefore = targetDAppearCount;

  hideWrapper();
  await timeout(100);
  showWrapper();
  await timeout(100);

  await waitForOrFailTest(async () => {
    should.ok(
      appearCountABefore === targetAAppearCount - 1,
      'Appear count must change +1 on wrapper show. (TargetA)'
    );
    should.ok(
      appearCountBBefore === targetBAppearCount - 1,
      'Appear count must change +1 on wrapper show. (TargetB)'
    );
    should.ok(
      appearCountCBefore === targetCAppearCount - 1,
      'Appear count must change +1 on wrapper show. (TargetC)'
    );
    should.ok(
      appearCountDBefore === targetDAppearCount - 1,
      'Appear count must change +1 on wrapper show. (TargetD)'
    );
  });

  checkInstanceState(osInstanceA);
  checkInstanceState(osInstanceB);
  checkInstanceState(osInstanceC);
  checkInstanceState(osInstanceD);

  await timeout(100);

  const msg = 'AutoHideSuspend works correctly on appear.';
  await Promise.all([
    assertScrollbarVisibility(osInstanceA, autoHideSuspend, msg),
    assertScrollbarVisibility(osInstanceB, autoHideSuspend, msg),
    assertScrollbarVisibility(osInstanceC, autoHideSuspend, msg),
    assertScrollbarVisibility(osInstanceD, true, msg),
  ]);

  await timeout(100);

  if (autoHideSuspend) {
    const msg2 = 'AutoHideSuspend works correctly after interaction.';
    [osInstanceA, osInstanceB, osInstanceC, osInstanceD].forEach((osInstance) => {
      osInstance.elements().scrollOffsetElement.scrollLeft = 9999;
      osInstance.elements().scrollOffsetElement.scrollTop = 9999;
    });

    await Promise.all([
      assertScrollbarVisibility(osInstanceA, false, msg2),
      assertScrollbarVisibility(osInstanceB, false, msg2),
      assertScrollbarVisibility(osInstanceC, false, msg2),
      assertScrollbarVisibility(osInstanceD, true, msg2),
    ]);
  }
};

const runAppeared = async () => {
  should(getStyles(targetCElement, ['display']).display).not.equal('none', `Target C is visible.`);
  should(getStyles(targetDElement, ['display']).display).not.equal('none', `Target D is visible.`);

  should(targetCAppearCount).equal(1, `Appear count is 1 after initialization. (Target C)`);
  should(targetDAppearCount).equal(1, `Appear count is 1 after initialization. (Target D)`);

  checkInstanceState(osInstanceC);
  checkInstanceState(osInstanceD);

  const msg = 'AutoHideSuspned works correctly on initialization';

  await Promise.all([
    assertScrollbarVisibility(osInstanceC, autoHideSuspend, msg),
    assertScrollbarVisibility(osInstanceD, true, msg),
  ]);
};

startBtn.addEventListener('click', async () => {
  setTestResult(null);

  try {
    // check whether scroll event was fired during init
    await timeout(100);
    should.equal(targetAScrollCount, 0, `TargetA scroll count should be 0. (start)`);
    should.equal(targetBScrollCount, 0, `TargetB scroll count should be 0. (start)`);
    should.equal(targetCScrollCount, 0, `TargetC scroll count should be 0. (start)`);
    should.equal(targetDScrollCount, 0, `TargetD scroll count should be 0. (start)`);

    await runAppeared();
    await runAppear(0);

    disappear();
    await timeout(100);
    updateInstances();
    await timeout(100);

    await runAppear(1);

    disappear();
    await timeout(100);
    updateInstances(true);
    await timeout(100);

    await runAppear(2);

    // check whether scroll event was fired during updates
    await timeout(100);
    should.equal(targetAScrollCount, 0, `TargetA scroll count should be 0. (end)`);
    should.equal(targetBScrollCount, 0, `TargetB scroll count should be 0. (end)`);
    should.equal(targetCScrollCount, 0, `TargetC scroll count should be 0. (end)`);
    should.equal(targetDScrollCount, 0, `TargetD scroll count should be 0. (end)`);

    // does scrolling if `autoHideSuspend` is true
    await runHideWrapper();

    setTestResult(true);
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
