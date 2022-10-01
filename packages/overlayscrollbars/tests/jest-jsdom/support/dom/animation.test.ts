import { animateNumber } from '~/support/dom/animation';

jest.useFakeTimers();

jest.mock('~/support/compatibility/apis', () => {
  const originalModule = jest.requireActual('~/support/compatibility/apis');
  const mockRAF = (arg: any) => setTimeout(arg, 0);
  return {
    ...originalModule,
    // @ts-ignore
    rAF: jest.fn().mockImplementation((...args) => mockRAF(...args)),
    // @ts-ignore
    cAF: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
    // @ts-ignore
    setT: jest.fn().mockImplementation((...args) => setTimeout(...args)),
    // @ts-ignore
    clearT: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
  };
});

describe('dom animation', () => {
  describe('animateNumber', () => {
    test('animate 0 to 1', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 1, 500, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(0, 0, false);

      jest.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(252);
      expect(onFrame).toHaveBeenLastCalledWith(0.5, 0.5, false);

      jest.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(1, 1, true);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(502);
    });

    test('animate 1 to 0', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(1, 0, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(1, 0, false);

      jest.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(0.5, 0.5, false);

      jest.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(1002);
      expect(onFrame).toHaveBeenLastCalledWith(0, 1, true);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1002);
    });

    test('animate duration 0', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 100, 0, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(100, 1, true);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate negative duration', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 100, -100, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(100, 1, true);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate with easing and fractions', () => {
      const onFrame = jest.fn();
      const onFrameB = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();
      expect(onFrameB).not.toHaveBeenCalled();

      animateNumber(25.2, 55.5, 1000, onFrame, (percent) => percent);
      animateNumber(25.2, 55.5, 1000, onFrameB);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrameB).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(25.2, 0, false);
      expect(onFrameB).toHaveBeenLastCalledWith(25.2, 0, false);

      jest.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(252);
      expect(onFrameB).toHaveBeenCalledTimes(252);
      expect(onFrame).toHaveBeenLastCalledWith(32.775, 0.25, false);
      expect(onFrameB).toHaveBeenLastCalledWith(32.775, 0.25, false);

      jest.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrameB).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(40.35, 0.5, false);
      expect(onFrameB).toHaveBeenLastCalledWith(40.35, 0.5, false);

      jest.advanceTimersByTime(100);

      expect(onFrame).toHaveBeenCalledTimes(602);
      expect(onFrameB).toHaveBeenCalledTimes(602);
      expect(onFrame).toHaveBeenLastCalledWith(43.379999999999995, 0.6, false);
      expect(onFrameB).toHaveBeenLastCalledWith(43.379999999999995, 0.6, false);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1002);
      expect(onFrameB).toHaveBeenCalledTimes(1002);
      expect(onFrame).toHaveBeenLastCalledWith(55.5, 1, true);
      expect(onFrameB).toHaveBeenLastCalledWith(55.5, 1, true);
    });

    test('animate and stop animation', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      const stop = animateNumber(1, 0, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(1, 0, false);

      stop();

      expect(onFrame).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate and stop animation with complete', () => {
      const onFrame = jest.fn();
      expect(onFrame).not.toHaveBeenCalled();

      const stop = animateNumber(0, 5555, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(0, 0, false);

      stop(true);

      expect(onFrame).toHaveBeenCalledTimes(2);
      expect(onFrame).toHaveBeenLastCalledWith(5555, 1, true);

      jest.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(2);

      jest.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(2);
    });
  });
});
