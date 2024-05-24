/* eslint-disable @typescript-eslint/no-unused-vars */
import '~/index.scss';
import './index.scss';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { resize, setTestResult, timeout, waitForOrFailTest } from '@~local/browser-testing';
import { animateNumber, getStyles, setStyles } from '~/support';

interface FramerateMeasurement {
  beginTime: number;
  endTime: number;
  framerate: number;
  frames: number;
}

interface FramerateResult {
  samples: number;
  fps: number;
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
const calculateRegressionSlope = (
  xValues: number[],
  xMean: number,
  yValues: number[],
  yMean: number
) => {
  let dividendSum = 0;
  let divisorSum = 0;
  for (let i = 0; i < xValues.length; i++) {
    dividendSum += (xValues[i] - xMean) * (yValues[i] - yMean);
    divisorSum += Math.pow(xValues[i] - xMean, 2);
  }
  return dividendSum / divisorSum;
};

const createFramerateMeasurer = () => {
  let _beginTime = 0;
  let _frames = 0;
  let _animationFrameId: number | undefined = undefined;

  const loop = () => {
    _frames++;
    _animationFrameId = requestAnimationFrame(loop);
  };

  return {
    start: () => {
      _beginTime = (performance || Date).now();
      _frames = 0;
      _animationFrameId = requestAnimationFrame(loop);
    },
    stop: (): FramerateMeasurement => {
      const endTime = (performance || Date).now();

      if (_animationFrameId) {
        cancelAnimationFrame(_animationFrameId);
      }

      return {
        beginTime: _beginTime,
        endTime,
        framerate: (_frames * 1000) / (endTime - _beginTime),
        frames: _frames,
      };
    },
  };
};

const createFramerateTest = (
  testCase: (onCompleted: () => void) => void,
  minSampleSize = 5,
  maxSampleSize = 10
) => {
  let _framerates: number[] = [];
  let _isRunning = false;

  const framerateMeasurer = createFramerateMeasurer();

  const stop = (): FramerateResult => {
    _isRunning = false;

    return {
      samples: _framerates.length,
      fps: calculateMean(_framerates),
    };
  };

  const getTestConfidence = () => {
    if (_framerates.length >= minSampleSize) {
      const indices = _framerates.map((_, index) => index);

      const regressionSlope = calculateRegressionSlope(
        indices,
        calculateMean(indices),
        _framerates,
        calculateMean(_framerates)
      );

      return regressionSlope >= 0;
    } else {
      return false;
    }
  };

  const runTest = (): Promise<FramerateResult> => {
    return new Promise<FramerateResult>((resolve) => {
      framerateMeasurer.start();

      testCase(() => {
        if (!_isRunning) {
          return;
        }

        const measurements = framerateMeasurer.stop();

        /*
        console.log(
          `${_framerates.length} – ${measurements.frames} frames, framerate: ${measurements.framerate}`
        );
        */

        _framerates.push(measurements.framerate);

        const isConfident = getTestConfidence();

        if (isConfident || _framerates.length >= maxSampleSize) {
          resolve(stop());
        } else {
          resolve(runTest());
        }
      });
    });
  };

  return {
    isRunning: () => _isRunning,
    run: (): Promise<FramerateResult> => {
      _framerates = [];
      _isRunning = true;

      return runTest().then((result) => timeout(500).then(() => result));
    },
    stop,
  };
};

startBtn.addEventListener('click', async () => {
  setTestResult(null);
  await timeout(1000);
  try {
    const wrapperResizeFpsTest = createFramerateTest(async (completed) => {
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;
      const animation = wrapper.animate(
        [
          { width: `${width}px`, height: `${height}px` },
          { width: '0px', height: '0px' },
        ],
        {
          duration: 2300,
          iterations: 1,
        }
      );

      animation.addEventListener('finish', async () => {
        await timeout(100);
        completed();
      });
    });
    const targetResizeFpsTest = createFramerateTest(async (completed) => {
      const width = target.offsetWidth;
      const height = target.offsetHeight;

      const widthAnimation = new Promise<void>((resolve) => {
        animateNumber(width, 0, 2300, (animatedWidth, _, complete) => {
          setStyles(target, { width: `${animatedWidth}px` });
          if (complete) {
            resolve();
          }
        });
      });
      const heightAnimation = new Promise<void>((resolve) => {
        animateNumber(height, 0, 2300, (animatedHeight, _, complete) => {
          setStyles(target, { height: `${animatedHeight}px` });
          if (complete) {
            resolve();
          }
        });
      });

      await Promise.all([widthAnimation, heightAnimation]).then(() => {
        setStyles(target, { width: `${width}px`, height: `${height}px` });
        return timeout(100);
      });

      completed();
    });
    const contentResizeFpsTest = createFramerateTest(async (completed) => {
      const width = content.offsetWidth;
      const height = content.offsetHeight;

      const widthAnimation = new Promise<void>((resolve) => {
        animateNumber(width, 0, 2300, (animatedWidth, _, complete) => {
          setStyles(content, { width: `${animatedWidth}px` });
          if (complete) {
            resolve();
          }
        });
      });
      const heightAnimation = new Promise<void>((resolve) => {
        animateNumber(height, 0, 2300, (animatedHeight, _, complete) => {
          setStyles(content, { height: `${animatedHeight}px` });
          if (complete) {
            resolve();
          }
        });
      });

      await Promise.all([widthAnimation, heightAnimation]).then(() => {
        setStyles(content, { width: `${width}px`, height: `${height}px` });
        return timeout(100);
      });

      completed();
    });
    const scrollAnimationFpsTest = createFramerateTest(async (completed) => {
      const { viewport } = osInstance.elements();
      const { scrollWidth, scrollHeight } = viewport;

      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;

      const leftAnimation = new Promise<void>((resolve) => {
        animateNumber(0, scrollWidth, 2300, (animatedLeft, _, complete) => {
          viewport.scrollLeft = animatedLeft;
          if (complete) {
            resolve();
          }
        });
      });
      const topAnimation = new Promise<void>((resolve) => {
        animateNumber(0, scrollHeight, 2300, (animatedTop, _, complete) => {
          viewport.scrollTop = animatedTop;
          if (complete) {
            resolve();
          }
        });
      });

      await Promise.all([leftAnimation, topAnimation]).then(() => {
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;

        return timeout(100);
      });

      completed();
    });

    const wrapperResizeTestResult = await wrapperResizeFpsTest.run();
    const targetResizeFpsTestResult = await targetResizeFpsTest.run();
    const contentResizeFpsTestResult = await contentResizeFpsTest.run();
    const scrollAnimationFpsTestResult = await scrollAnimationFpsTest.run();

    console.error(
      `Wrapper Resize: { samples: ${wrapperResizeTestResult.samples}, fps: ${wrapperResizeTestResult.fps} }`
    );
    console.error(
      `Target Resize: { samples: ${targetResizeFpsTestResult.samples}, fps: ${targetResizeFpsTestResult.fps} }`
    );
    console.error(
      `Content Resize: { samples: ${contentResizeFpsTestResult.samples}, fps: ${contentResizeFpsTestResult.fps} }`
    );
    console.error(
      `Scroll Animation: { samples: ${scrollAnimationFpsTestResult.samples}, fps: ${scrollAnimationFpsTestResult.fps} }`
    );

    setTestResult(true);
  } catch {
    setTestResult(false);
  }
});
