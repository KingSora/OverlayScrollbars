import { vi, describe, test, beforeEach, expect } from 'vitest';
import { bind, debounce, selfClearTimeout } from '../../../../src/support/utils/function';
import { rAF, cAF, setT, clearT } from '../../../../src/support/utils/alias';

vi.useFakeTimers();
vi.mock(import('../../../../src/support/utils/alias'), async (importActual) => {
  const actualModule = await importActual();
  return {
    ...actualModule,
    // @ts-ignore
    rAF: vi.fn((arg) => setTimeout(arg, 0)) as any,
    // @ts-ignore
    cAF: vi.fn((...args) => clearTimeout(...args)),
    // @ts-ignore
    setT: vi.fn((...args) => setTimeout(...args)) as any,
    // @ts-ignore
    clearT: vi.fn((...args) => clearTimeout(...args)),
  };
});

describe('function', () => {
  beforeEach(() => {
    Object.values(vi.mocked({ rAF, cAF, setT, clearT })).forEach(({ mockClear }) => mockClear());
  });

  describe('debounce', () => {
    describe('trailing', () => {
      describe('debounce timing', () => {
        test('without debounce timing', () => {
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

        test('with debounce timing 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 0 }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();
          debouncedFn();
          expect(rAF).toHaveBeenCalledTimes(1);
          expect(setT).not.toHaveBeenCalled();
          expect(i).toBe(0);

          vi.advanceTimersByTime(0);

          expect(i).toBe(1);
        });

        test('with debounce timing 0 and multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 0 }
          );

          debouncedFn();
          expect(i).toBe(0);

          debouncedFn();
          expect(i).toBe(0);

          debouncedFn();
          expect(i).toBe(0);

          debouncedFn();
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(0);
          expect(i).toBe(1);
        });

        test('with debounce timing > 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 100 }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();
          debouncedFn();
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);

          expect(i).toBe(0);

          vi.advanceTimersByTime(100);

          expect(i).toBe(1);
        });

        test('with debounce timing > 0 and multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 200 }
          );

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(200);
          expect(i).toBe(1);
        });

        test('with debounce timing function', async () => {
          let i = 0;
          let timeoutMs = 200;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: () => timeoutMs }
          );

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(0);

          timeoutMs = 1000;

          debouncedFn();
          vi.advanceTimersByTime(500);
          expect(i).toBe(0);

          vi.advanceTimersByTime(500);
          expect(i).toBe(1);
        });
      });

      describe('max debounce timing', () => {
        test('without max debounce timing', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 100 }
          );
          debouncedFn();
          expect(i).toBe(0);

          vi.advanceTimersByTime(99);
          expect(i).toBe(0);

          vi.advanceTimersByTime(1);
          expect(i).toBe(1);
        });

        test('with max debounce timing and longer debounce timing', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 10000, _maxDebounceTiming: 100 }
          );
          debouncedFn();
          expect(i).toBe(0);

          vi.advanceTimersByTime(99);
          expect(i).toBe(0);

          vi.advanceTimersByTime(1);
          expect(i).toBe(1);

          vi.advanceTimersByTime(20000);
          expect(i).toBe(1);
        });

        test('with max debounce timing and shorter debounce timing with multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 200, _maxDebounceTiming: 500 }
          );
          debouncedFn();
          vi.advanceTimersByTime(150); // 150
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(150); // 300

          debouncedFn();
          vi.advanceTimersByTime(150); // 450
          expect(i).toBe(0);

          debouncedFn();
          vi.advanceTimersByTime(49); // 499
          expect(i).toBe(0);

          vi.advanceTimersByTime(1); // 500
          expect(i).toBe(1);
        });

        test('with max debounce timing function', async () => {
          let i = 0;
          let maxDelayMs = 300;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 400, _maxDebounceTiming: () => maxDelayMs }
          );
          debouncedFn();
          expect(i).toBe(0);
          vi.advanceTimersByTime(100); // 100

          debouncedFn();
          expect(i).toBe(0);
          vi.advanceTimersByTime(100); // 200

          maxDelayMs = 800; // this delay will be applied in the next cycle, not instantly

          debouncedFn();
          expect(i).toBe(0);
          vi.advanceTimersByTime(99); // 299
          expect(i).toBe(0);
          vi.advanceTimersByTime(1); // 300
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);
          vi.advanceTimersByTime(300); // 300

          debouncedFn();
          expect(i).toBe(1);
          vi.advanceTimersByTime(300); // 600

          debouncedFn();
          expect(i).toBe(1);
          vi.advanceTimersByTime(199); // 799
          expect(i).toBe(1);
          vi.advanceTimersByTime(1); // 800
          expect(i).toBe(2); // max delay 800 invoked here

          debouncedFn();
          expect(i).toBe(2);
          vi.advanceTimersByTime(399);
          debouncedFn();
          expect(i).toBe(2);
          vi.advanceTimersByTime(401);
          expect(i).toBe(3);
        });
      });

      describe('mergeParams', () => {
        test('with correct mergeParams function', async () => {
          let i = 0;
          const _mergeParams = vi.fn((prev: [number, number], curr: [number, number]) => {
            const [prevA, prevB] = prev;
            const [currA, currB] = curr;

            return [prevA + currA, prevB + currB] as [number, number];
          });
          const debouncedFn = debounce(
            (a: number, b: number) => {
              i += a * b;
            },
            { _debounceTiming: 200, _mergeParams }
          );
          debouncedFn(1, 1);
          expect(i).toBe(0);
          expect(_mergeParams).not.toHaveBeenCalled();

          vi.advanceTimersByTime(100); // 100

          debouncedFn(4, 4);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [4, 4]);

          vi.advanceTimersByTime(100); // 200

          debouncedFn(10, 10);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([5, 5], [10, 10]);

          vi.advanceTimersByTime(250); // 450

          expect(i).toBe(15 * 15);
        });

        test('without correct mergeParams function', async () => {
          let i = 0;
          const _mergeParams = vi.fn(() => null);
          const debouncedFn = debounce(
            (a, b) => {
              i += a * b;
            },
            { _debounceTiming: 200, _mergeParams }
          );
          debouncedFn(1, 1);
          expect(i).toBe(0);
          expect(_mergeParams).not.toHaveBeenCalled();

          vi.advanceTimersByTime(100); // 100

          debouncedFn(2, 2);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [2, 2]);

          vi.advanceTimersByTime(100); // 200

          debouncedFn(3, 3);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([2, 2], [3, 3]);

          vi.advanceTimersByTime(250); // 450

          expect(i).toBe(3 * 3);
        });
      });
    });

    describe('leading', () => {
      describe('debounce timing', () => {
        test('without debounce timing', () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            {
              _leading: true,
            }
          );
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();
          debouncedFn();
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();
          expect(i).toBe(1);
        });

        test('with debounce timing 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 0, _leading: true }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();

          debouncedFn();
          expect(rAF).toHaveBeenCalledTimes(1);
          expect(setT).not.toHaveBeenCalled();
          expect(i).toBe(1);

          vi.advanceTimersByTime(0);

          expect(i).toBe(1);
          expect(rAF).toHaveBeenCalledTimes(1);
          expect(setT).not.toHaveBeenCalled();
        });

        test('with debounce timing 0 and multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 0, _leading: true }
          );

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);

          vi.advanceTimersByTime(0);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);

          debouncedFn();
          expect(i).toBe(3);

          vi.advanceTimersByTime(0);
          expect(i).toBe(4);

          debouncedFn();
          expect(i).toBe(5);

          vi.advanceTimersByTime(0);
          expect(i).toBe(5);
        });

        test('with debounce timing > 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 100, _leading: true }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();

          debouncedFn();
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);
          expect(i).toBe(1);

          vi.advanceTimersByTime(100);

          expect(i).toBe(1);
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);
        });

        test('with debounce timing > 0 and multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 200, _leading: true }
          );

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();

          vi.advanceTimersByTime(200);
          expect(i).toBe(2);
          vi.advanceTimersByTime(200);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);

          vi.advanceTimersByTime(200);
          expect(i).toBe(3);

          debouncedFn();
          expect(i).toBe(4);
          vi.advanceTimersByTime(200);
          expect(i).toBe(4);
          vi.advanceTimersByTime(200);
          expect(i).toBe(4);
        });

        test('with debounce timing function', async () => {
          let i = 0;
          let timeoutMs = 200;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: () => timeoutMs, _leading: true }
          );

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(100);
          expect(i).toBe(1);

          timeoutMs = 1000;

          debouncedFn();
          vi.advanceTimersByTime(500);
          expect(i).toBe(1);

          vi.advanceTimersByTime(500);
          expect(i).toBe(2);
        });
      });

      describe('max debounce timing', () => {
        test('without max debounce timing', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 100, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(99);
          expect(i).toBe(1);

          vi.advanceTimersByTime(1);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          vi.advanceTimersByTime(100);

          debouncedFn();
          expect(i).toBe(4);
          vi.advanceTimersByTime(200);
          expect(i).toBe(4);
        });

        test('with maxDelay and longer timeout', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 10000, _maxDebounceTiming: 100, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(99);
          expect(i).toBe(1);

          vi.advanceTimersByTime(1);
          expect(i).toBe(2);

          vi.advanceTimersByTime(10000);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          vi.advanceTimersByTime(20000);
          expect(i).toBe(3);
        });

        test('with max debounce timing and shorter debounce timing with multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _debounceTiming: 200, _maxDebounceTiming: 500, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(150); // 150
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(150); // 300

          debouncedFn();
          vi.advanceTimersByTime(150); // 450
          expect(i).toBe(1);

          debouncedFn();
          vi.advanceTimersByTime(49); // 499
          expect(i).toBe(1);

          vi.advanceTimersByTime(1); // 500
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          vi.advanceTimersByTime(1000);
          expect(i).toBe(3);
        });
      });

      describe('mergeParams', () => {
        test('with correct mergeParams function', async () => {
          let i = 0;
          const _mergeParams = vi.fn((prev: [number, number], curr: [number, number]) => {
            const [prevA, prevB] = prev;
            const [currA, currB] = curr;

            return [prevA + currA, prevB + currB] as [number, number];
          });
          const debouncedFn = debounce(
            (a: number, b: number) => {
              i += a * b;
            },
            { _debounceTiming: 200, _mergeParams, _leading: true }
          );
          debouncedFn(1, 1);
          expect(i).toBe(1);
          expect(_mergeParams).not.toHaveBeenCalled();

          vi.advanceTimersByTime(100); // 100

          debouncedFn(4, 4);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [4, 4]);

          vi.advanceTimersByTime(100); // 200

          debouncedFn(10, 10);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([5, 5], [10, 10]);

          vi.advanceTimersByTime(250); // 450

          expect(i).toBe(15 * 15 + 1);
        });

        test('without correct mergeParams function', async () => {
          let i = 0;
          const _mergeParams = vi.fn(() => null);
          const debouncedFn = debounce(
            (a, b) => {
              i += a * b;
            },
            { _debounceTiming: 200, _mergeParams, _leading: true }
          );
          debouncedFn(1, 1);
          expect(i).toBe(1);
          expect(_mergeParams).not.toHaveBeenCalled();

          vi.advanceTimersByTime(100); // 100

          debouncedFn(2, 2);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [2, 2]);

          vi.advanceTimersByTime(100); // 200

          debouncedFn(3, 3);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([2, 2], [3, 3]);

          vi.advanceTimersByTime(250); // 450

          expect(i).toBe(3 * 3 + 1);
        });
      });
    });
  });

  test('bind', () => {
    const myFn = (a: number, b: number) => a + b;
    const boundFn = bind(myFn, 1);
    expect(typeof boundFn).toBe('function');
    expect(boundFn(1)).toBe(2);
    expect(boundFn(2)).toBe(3);
    expect(bind(myFn, 10, 1)()).toBe(11);
  });

  describe('selfClearTimeout', () => {
    test('without timeout', () => {
      let i = 0;
      const [timeout, clear] = selfClearTimeout();

      expect(rAF).not.toHaveBeenCalled();
      expect(cAF).not.toHaveBeenCalled();
      expect(setT).not.toHaveBeenCalled();
      expect(clearT).not.toHaveBeenCalled();

      timeout(() => {
        i += 1;
      });
      clear();

      expect(rAF).toHaveBeenCalledTimes(1);
      expect(cAF).toHaveBeenCalledTimes(2);
      expect(setT).not.toHaveBeenCalled();
      expect(clearT).not.toHaveBeenCalled();

      expect(i).toBe(0);
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      vi.runAllTimers();
      expect(i).toBe(1);
    });

    test('with timeout', () => {
      let i = 0;
      const [timeout, clear] = selfClearTimeout(100);

      expect(rAF).not.toHaveBeenCalled();
      expect(cAF).not.toHaveBeenCalled();
      expect(setT).not.toHaveBeenCalled();
      expect(clearT).not.toHaveBeenCalled();

      timeout(() => {
        i += 1;
      });
      clear();

      expect(rAF).not.toHaveBeenCalled();
      expect(cAF).not.toHaveBeenCalled();
      expect(setT).toHaveBeenCalledTimes(1);
      expect(clearT).toHaveBeenCalledTimes(2);

      expect(i).toBe(0);
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      vi.runAllTimers();
      expect(i).toBe(1);
    });

    test('with timeout function', () => {
      let i = 0;
      const [timeout, clear] = selfClearTimeout(() => 100);

      expect(rAF).not.toHaveBeenCalled();
      expect(cAF).not.toHaveBeenCalled();
      expect(setT).not.toHaveBeenCalled();
      expect(clearT).not.toHaveBeenCalled();

      timeout(() => {
        i += 1;
      });
      clear();

      expect(rAF).not.toHaveBeenCalled();
      expect(cAF).not.toHaveBeenCalled();
      expect(setT).toHaveBeenCalledTimes(1);
      expect(clearT).toHaveBeenCalledTimes(2);

      expect(i).toBe(0);
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      timeout(() => {
        i += 1;
      });
      vi.runAllTimers();
      expect(i).toBe(1);
    });
  });
});
