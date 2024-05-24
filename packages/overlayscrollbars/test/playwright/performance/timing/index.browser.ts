/* eslint-disable @typescript-eslint/no-unused-vars */
import '~/index.scss';
import './index.scss';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { resize, setTestResult, timeout, waitForOrFailTest } from '@~local/browser-testing';
import { animateNumber, getStyles, setStyles } from '~/support';

interface TimingResult {
  samples: number;
  timeMs: number;
}

if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

const startBtn = document.querySelector<HTMLButtonElement>('#start')!;
const wrapper = document.querySelector<HTMLElement>('#wrapper')!;
const content = document.querySelector<HTMLElement>('#content')!;
const target = document.querySelector<HTMLElement>('#target')!;
const resizeInstance = resize(wrapper!);
let updatesCount = 0;
const osInstance = OverlayScrollbars(
  target,
  {},
  {
    updated() {
      updatesCount++;
    },
  }
);

const calculateMean = (samples: number[]) => {
  const total = samples.reduce((curr, x) => {
    curr += x;
    return curr;
  }, 0);

  return total / samples.length;
};
const createTimingTest = (testCase: (onCompleted: () => void) => void, maxSamples = 13) => {
  let _times: number[] = [];

  const runTest = (): Promise<TimingResult> => {
    return new Promise<TimingResult>((resolve) => {
      const startTime = (performance || Date).now();

      testCase(() => {
        const stopTime = (performance || Date).now();

        _times.push(stopTime - startTime);

        if (_times.length >= maxSamples) {
          resolve({
            samples: _times.length,
            timeMs: calculateMean(_times),
          });
        } else {
          resolve(timeout(1).then(runTest));
        }
      });
    });
  };

  return {
    run: () => {
      _times = [];
      return runTest().then((result) => timeout(500).then(() => result));
    },
  };
};

startBtn.addEventListener('click', async () => {
  setTestResult(null);
  await timeout(1000);
  try {
    const noForceUpdateTest = createTimingTest((completed) => {
      for (let i = 0; i < 10000; i++) {
        osInstance.update();
      }
      completed();
    });
    const noForceUpdateTestResult = await noForceUpdateTest.run();

    const forceUpdateTest = createTimingTest((completed) => {
      for (let i = 0; i < 1000; i++) {
        osInstance.update(true);
      }
      completed();
    });
    const forceUpdateTestResult = await forceUpdateTest.run();

    console.error(
      `No Force Update (10k runs / sample): { samples: ${noForceUpdateTestResult.samples}, timeMs: ${noForceUpdateTestResult.timeMs} }`
    );
    console.error(
      `Force Update (1k runs / sample): { samples: ${forceUpdateTestResult.samples}, timeMs: ${forceUpdateTestResult.timeMs} }`
    );

    setTestResult(true);
  } catch {
    setTestResult(false);
  }
});
