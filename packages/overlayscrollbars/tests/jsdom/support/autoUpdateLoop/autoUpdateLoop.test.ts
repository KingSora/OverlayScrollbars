import { getAutoUpdateLoop } from 'autoUpdateLoop';
import { getEnvironment } from 'environment';

describe('autoUpdateLoop', () => {
  test('first creation', async () => {
    const deltas: number[] = [];
    const wait = 2700;
    const loop = getAutoUpdateLoop();
    const defaultInterval = loop._interval();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const added = Date.now();
    const remove = loop._add((delta) => {
      if (deltas.length === 0) {
        expect(Date.now() - added >= defaultInterval).toBe(true);
      }
      expect(delta >= defaultInterval).toBe(true);
      deltas.push(delta);
    });
    expect(getEnvironment()._autoUpdateLoop).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, wait));
    const elapsedDeltas = deltas.reduce((a, b) => a + b, 0);

    expect(wait - elapsedDeltas < defaultInterval * 2).toBe(true);

    remove();
    expect(getEnvironment()._autoUpdateLoop).toBe(false);
  });

  test('add multiple', async () => {
    const loop = getAutoUpdateLoop();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    const remove1 = loop._add(fn1);
    const remove2 = loop._add(fn2);
    const remove3 = loop._add(fn3);

    expect(getEnvironment()._autoUpdateLoop).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    expect(fn1).toHaveBeenCalledTimes(fn1.mock.calls.length);
    expect(fn2).toHaveBeenCalledTimes(fn1.mock.calls.length);
    expect(fn3).toHaveBeenCalledTimes(fn1.mock.calls.length);

    remove1();
    remove2();
    remove3();

    expect(getEnvironment()._autoUpdateLoop).toBe(false);
  });

  test('change interval', async () => {
    const loop = getAutoUpdateLoop();
    const defaultInterval = loop._interval();

    const remove10 = loop._interval(10);
    const remove5 = loop._interval(5);
    const remove3 = loop._interval(3);
    const remove8 = loop._interval(8);
    const remove15 = loop._interval(15);

    expect(loop._interval()).toBe(3);
    remove3();
    expect(loop._interval()).toBe(5);
    remove10();
    remove8();
    expect(loop._interval()).toBe(5);
    remove5();
    expect(loop._interval()).toBe(15);
    remove15();

    expect(loop._interval()).toBe(defaultInterval);
  });
});
