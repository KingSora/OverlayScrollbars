import { noop, debounce } from 'support/utils/function';
import { rAF, setT } from 'support/compatibility/apis';

jest.mock('support/compatibility/apis', () => {
  const originalModule = jest.requireActual('support/compatibility/apis');
  return {
    ...originalModule,
    rAF: jest.fn().mockImplementation((...args) => originalModule.rAF(...args)),
    setT: jest.fn().mockImplementation((...args) => originalModule.setT(...args)),
  };
});

// eslint-disable-next-line no-return-await
const timeout = async (timeoutMs = 100) => {
  const result = await new Promise((r) => {
    setTimeout(r, timeoutMs);
  });
  return result;
};

describe('function', () => {
  test('noop', () => {
    expect(typeof noop).toBe('function');
    expect(noop()).toBe(undefined);
  });

  describe('debounce', () => {
    describe('timeout', () => {
      test('without timeout', () => {
        let i = 0;
        const debouncedFn = debounce(() => {
          i += 1;
        });
        expect(rAF).not.toHaveBeenCalled();
        expect(setT).not.toHaveBeenCalled();
        debouncedFn();
        expect(rAF).not.toHaveBeenCalled();
        expect(setT).not.toHaveBeenCalled();
        expect(i).toBe(1);
      });

      test('with timeout 0', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 0 }
        );

        expect(rAF).not.toHaveBeenCalled();
        expect(setT).not.toHaveBeenCalled();
        debouncedFn();
        expect(rAF).toHaveBeenCalledTimes(1);
        expect(setT).not.toHaveBeenCalled();
        expect(i).toBe(0);

        await timeout();

        expect(i).toBe(1);
      });

      test('with timeout > 0', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 1 }
        );

        expect(rAF).not.toHaveBeenCalled();
        expect(setT).not.toHaveBeenCalled();
        debouncedFn();
        expect(rAF).not.toHaveBeenCalled();
        expect(setT).toHaveBeenCalledTimes(1);

        expect(i).toBe(0);
        await timeout();
        expect(i).toBe(1);
      });

      test('with timeout > 0 and multiple calls', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 200 }
        );

        debouncedFn();
        await timeout();
        expect(i).toBe(0);

        debouncedFn();
        await timeout();
        expect(i).toBe(0);

        debouncedFn();
        await timeout();
        expect(i).toBe(0);

        debouncedFn();
        await timeout();
        expect(i).toBe(0);

        debouncedFn();
        await timeout(300);
        expect(i).toBe(1);
      });

      test('with timeout function', async () => {
        let i = 0;
        let timeoutMs = 200;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: () => timeoutMs }
        );

        debouncedFn();
        await timeout();
        expect(i).toBe(0);

        timeoutMs = 1000;

        debouncedFn();
        await timeout(500);
        expect(i).toBe(0);

        await timeout(500);
        expect(i).toBe(1);
      });
    });

    describe('maxDelay', () => {
      test('without maxDelay', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 100 }
        );
        debouncedFn();
        expect(i).toBe(0);

        await timeout(150);

        expect(i).toBe(1);
      });

      test('with maxDelay and longer timeout', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 10000, _maxDelay: 100 }
        );
        debouncedFn();
        expect(i).toBe(0);

        await timeout(150);

        expect(i).toBe(1);
      });

      test('with maxDelay and shorter timeout with multiple calls', async () => {
        let i = 0;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 200, _maxDelay: 500 }
        );
        debouncedFn();
        await timeout(150);
        expect(i).toBe(0);

        debouncedFn();
        await timeout(150);

        debouncedFn();
        await timeout(150);
        expect(i).toBe(0);

        debouncedFn();
        await timeout(150);
        expect(i).toBe(1);
      });

      test('with maxDelay function', async () => {
        let i = 0;
        let maxDelayMs = 300;
        const debouncedFn = debounce(
          () => {
            i += 1;
          },
          { _timeout: 400, _maxDelay: () => maxDelayMs }
        );
        debouncedFn();
        expect(i).toBe(0);

        await timeout();

        debouncedFn();
        expect(i).toBe(0);

        await timeout();

        maxDelayMs = 800; // this delay will be applied in the next cycle, not instantly

        debouncedFn();
        expect(i).toBe(0);

        await timeout();

        debouncedFn();
        expect(i).toBe(1); // max delay 300 invoked here

        await timeout(300);

        debouncedFn();
        expect(i).toBe(1);

        await timeout(300);

        debouncedFn();
        expect(i).toBe(1);

        await timeout(300);

        debouncedFn();
        expect(i).toBe(2); // max delay 800 invoked here
      });
    });

    describe('mergeParams', () => {
      test('with correct mergeParams function', async () => {
        let i = 0;
        const _mergeParams = jest.fn((prev: [number, number], curr: [number, number]) => {
          const [prevA, prevB] = prev;
          const [currA, currB] = curr;

          return [prevA + currA, prevB + currB] as [number, number];
        });
        const debouncedFn = debounce(
          (a: number, b: number) => {
            i += a * b;
          },
          { _timeout: 200, _mergeParams }
        );
        debouncedFn(1, 1);
        expect(i).toBe(0);
        expect(_mergeParams).not.toHaveBeenCalled();

        await timeout();

        debouncedFn(4, 4);
        expect(i).toBe(0);
        expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [4, 4]);

        await timeout();

        debouncedFn(10, 10);
        expect(i).toBe(0);
        expect(_mergeParams).toHaveBeenLastCalledWith([5, 5], [10, 10]);

        await timeout(250);

        expect(i).toBe(15 * 15);
      });

      test('without correct mergeParams function', async () => {
        let i = 0;
        const _mergeParams = jest.fn(() => null);
        const debouncedFn = debounce(
          (a, b) => {
            i += a * b;
          },
          { _timeout: 200, _mergeParams }
        );
        debouncedFn(1, 1);
        expect(i).toBe(0);
        expect(_mergeParams).not.toHaveBeenCalled();

        await timeout();

        debouncedFn(2, 2);
        expect(i).toBe(0);
        expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [2, 2]);

        await timeout();

        debouncedFn(3, 3);
        expect(i).toBe(0);
        expect(_mergeParams).toHaveBeenLastCalledWith([2, 2], [3, 3]);

        await timeout(250);

        expect(i).toBe(3 * 3);
      });
    });
  });
});
