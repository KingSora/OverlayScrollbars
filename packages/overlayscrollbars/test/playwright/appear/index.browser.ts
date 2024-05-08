import '~/index.scss';
import './index.scss';
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
const targetAAppearCountSlot = document.querySelector<HTMLElement>('#targetAAppearCount')!;
const targetBAppearCountSlot = document.querySelector<HTMLElement>('#targetBAppearCount')!;
let targetAAppearCount = 0;
let targetBAppearCount = 0;
let appeared = false;
let wrapperHidden = false;

const updateAppearCounts = () => {
  targetAAppearCountSlot.textContent = String(targetAAppearCount);
  targetBAppearCountSlot.textContent = String(targetBAppearCount);
};

// @ts-ignore
const osInstanceA = (window.osA = OverlayScrollbars(
  targetAElement,
  {},
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetAAppearCount++;
        updateAppearCounts();
      }
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
  {},
  {
    updated: (_, { updateHints }) => {
      const { appear } = updateHints;
      if (appear) {
        targetBAppearCount++;
        updateAppearCounts();
      }
    },
  }
));

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

  should(scrollCoordinates.end.x).equal(
    overflowAmount.x,
    `Scroll Coordinates for EndX must equal overflow amount ${beforeAfter} appear. (${hostId})`
  );
  should(scrollCoordinates.end.y).equal(
    overflowAmount.y,
    `Scroll Coordinates for EndY must equal overflow amount ${beforeAfter} appear. (${hostId})`
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
  });

  checkInstanceState(osInstanceA);
  checkInstanceState(osInstanceB);

  await timeout(100);
};

startBtn.addEventListener('click', async () => {
  setTestResult(null);

  try {
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

    await runHideWrapper();

    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
