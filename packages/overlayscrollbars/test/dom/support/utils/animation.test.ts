import { vi, describe, test, expect } from 'vitest';
import { animateNumber } from '../../../../src/support/utils/animation';

vi.useFakeTimers();
vi.mock(import('../../../../src/support/utils/alias'), async (importActual) => {
  const actualModule = await importActual();
  return {
    ...actualModule,
    // @ts-ignore
    rAF: vi.fn((arg) => setTimeout(arg, 0)) as any,
    // @ts-ignore
    cAF: vi.fn((...args) => clearTimeout(...args)),
  };
});

describe('dom animation', () => {
  describe('animateNumber', () => {
    test('animate 0 to 1', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 1, 500, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(0, 0, false);

      vi.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(252);
      expect(onFrame).toHaveBeenLastCalledWith(0.5, 0.5, false);

      vi.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(1, 1, true);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(502);
    });

    test('animate 1 to 0', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(1, 0, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(1, 0, false);

      vi.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(0.5, 0.5, false);

      vi.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(1002);
      expect(onFrame).toHaveBeenLastCalledWith(0, 1, true);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1002);
    });

    test('animate duration 0', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 100, 0, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(100, 1, true);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate negative duration', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      animateNumber(0, 100, -100, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(100, 1, true);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate with easing and fractions', () => {
      const onFrame = vi.fn();
      const onFrameB = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();
      expect(onFrameB).not.toHaveBeenCalled();

      animateNumber(25.2, 55.5, 1000, onFrame, (percent) => percent);
      animateNumber(25.2, 55.5, 1000, onFrameB);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrameB).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(25.2, 0, false);
      expect(onFrameB).toHaveBeenLastCalledWith(25.2, 0, false);

      vi.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(252);
      expect(onFrameB).toHaveBeenCalledTimes(252);
      expect(onFrame).toHaveBeenLastCalledWith(32.775, 0.25, false);
      expect(onFrameB).toHaveBeenLastCalledWith(32.775, 0.25, false);

      vi.advanceTimersByTime(250);

      expect(onFrame).toHaveBeenCalledTimes(502);
      expect(onFrameB).toHaveBeenCalledTimes(502);
      expect(onFrame).toHaveBeenLastCalledWith(40.35, 0.5, false);
      expect(onFrameB).toHaveBeenLastCalledWith(40.35, 0.5, false);

      vi.advanceTimersByTime(100);

      expect(onFrame).toHaveBeenCalledTimes(602);
      expect(onFrameB).toHaveBeenCalledTimes(602);
      expect(onFrame).toHaveBeenLastCalledWith(43.379999999999995, 0.6, false);
      expect(onFrameB).toHaveBeenLastCalledWith(43.379999999999995, 0.6, false);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1002);
      expect(onFrameB).toHaveBeenCalledTimes(1002);
      expect(onFrame).toHaveBeenLastCalledWith(55.5, 1, true);
      expect(onFrameB).toHaveBeenLastCalledWith(55.5, 1, true);
    });

    test('animate and stop animation', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      const stop = animateNumber(1, 0, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(1, 0, false);

      stop();

      expect(onFrame).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(1);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    test('animate and stop animation with complete', () => {
      const onFrame = vi.fn();
      expect(onFrame).not.toHaveBeenCalled();

      const stop = animateNumber(0, 5555, 1000, onFrame);

      expect(onFrame).toHaveBeenCalledTimes(1);
      expect(onFrame).toHaveBeenLastCalledWith(0, 0, false);

      stop(true);

      expect(onFrame).toHaveBeenCalledTimes(2);
      expect(onFrame).toHaveBeenLastCalledWith(5555, 1, true);

      vi.advanceTimersByTime(500);

      expect(onFrame).toHaveBeenCalledTimes(2);

      vi.runAllTimers();

      expect(onFrame).toHaveBeenCalledTimes(2);
    });
  });
});
