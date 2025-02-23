/* eslint-disable @typescript-eslint/no-unused-vars */
import '~/index.scss';
import './index.scss';
import './handleEnvironment';
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

const nonDefaultScrollDirection = document.body.classList.contains('ndsd');
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
const createTimingTest = (testCase: (onCompleted: () => void) => void, maxSamples: number) => {
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
    const noForceUpdateTest5k = createTimingTest((completed) => {
      osInstance.update();
      completed();
    }, 5000);
    const noForceUpdateTest5kResult = await noForceUpdateTest5k.run();

    const forceUpdateTest5k = createTimingTest((completed) => {
      osInstance.update(true);
      completed();
    }, 5000);
    const forceUpdateTest5kResult = await forceUpdateTest5k.run();

    const noForceUpdate10kIterationsTest = createTimingTest((completed) => {
      for (let i = 0; i < 10000; i++) {
        osInstance.update();
      }
      completed();
    }, 10);
    const noForceUpdateTest10kPerSampleResult = await noForceUpdate10kIterationsTest.run();

    const forceUpdate1kPerSampleTest = createTimingTest((completed) => {
      for (let i = 0; i < 1000; i++) {
        osInstance.update(true);
      }
      completed();
    }, 10);
    const forceUpdate1kPerSampleTestResult = await forceUpdate1kPerSampleTest.run();
    const scrollDirectionStr = nonDefaultScrollDirection ? 'non-default' : 'default';

    console.error(
      `[ScrollDirection: ${scrollDirectionStr}] [force: false]: { samples: ${
        noForceUpdateTest5kResult.samples
      }, Avg. exec. time: ${noForceUpdateTest5kResult.timeMs.toFixed(3)} }`
    );
    console.error(
      `[ScrollDirection: ${scrollDirectionStr}] [force: true]: { samples: ${
        forceUpdateTest5kResult.samples
      }, Avg. exec. time: ${forceUpdateTest5kResult.timeMs.toFixed(3)} }`
    );
    console.error(
      `[ScrollDirection: ${scrollDirectionStr}] [force: false]: (10k runs / sample): { samples: ${
        noForceUpdateTest10kPerSampleResult.samples
      }, Avg. exec. time: ${noForceUpdateTest10kPerSampleResult.timeMs.toFixed(3)} }`
    );
    console.error(
      `[ScrollDirection: ${scrollDirectionStr}] [force: true]: (1k runs / sample): { samples: ${
        forceUpdate1kPerSampleTestResult.samples
      }, Avg. exec. time: ${forceUpdate1kPerSampleTestResult.timeMs.toFixed(3)} }`
    );

    setTestResult(true);
  } catch {
    setTestResult(false);
  }
});
