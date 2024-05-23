import { bind, debounce, selfClearTimeout } from '~/support/utils/function';
import { rAF, cAF, setT, clearT } from '~/support/utils/alias';

jest.useFakeTimers();

jest.mock('~/support/utils/alias', () => {
  const originalModule = jest.requireActual('~/support/utils/alias');
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

describe('function', () => {
  describe('debounce', () => {
    describe('trailing', () => {
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

          jest.advanceTimersByTime(0);

          expect(i).toBe(1);
        });

        test('with timeout > 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 100 }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();
          debouncedFn();
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);

          expect(i).toBe(0);

          jest.advanceTimersByTime(100);

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
          jest.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(200);
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
          jest.advanceTimersByTime(100);
          expect(i).toBe(0);

          timeoutMs = 1000;

          debouncedFn();
          jest.advanceTimersByTime(500);
          expect(i).toBe(0);

          jest.advanceTimersByTime(500);
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

          jest.advanceTimersByTime(99);
          expect(i).toBe(0);

          jest.advanceTimersByTime(1);
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

          jest.advanceTimersByTime(99);
          expect(i).toBe(0);

          jest.advanceTimersByTime(1);
          expect(i).toBe(1);

          jest.advanceTimersByTime(20000);
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
          jest.advanceTimersByTime(150); // 150
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(150); // 300

          debouncedFn();
          jest.advanceTimersByTime(150); // 450
          expect(i).toBe(0);

          debouncedFn();
          jest.advanceTimersByTime(49); // 499
          expect(i).toBe(0);

          jest.advanceTimersByTime(1); // 500
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
          jest.advanceTimersByTime(100); // 100

          debouncedFn();
          expect(i).toBe(0);
          jest.advanceTimersByTime(100); // 200

          maxDelayMs = 800; // this delay will be applied in the next cycle, not instantly

          debouncedFn();
          expect(i).toBe(0);
          jest.advanceTimersByTime(99); // 299
          expect(i).toBe(0);
          jest.advanceTimersByTime(1); // 300
          expect(i).toBe(1);

          debouncedFn();
          expect(i).toBe(1);
          jest.advanceTimersByTime(300); // 300

          debouncedFn();
          expect(i).toBe(1);
          jest.advanceTimersByTime(300); // 600

          debouncedFn();
          expect(i).toBe(1);
          jest.advanceTimersByTime(199); // 799
          expect(i).toBe(1);
          jest.advanceTimersByTime(1); // 800
          expect(i).toBe(2); // max delay 800 invoked here

          debouncedFn();
          expect(i).toBe(2);
          jest.advanceTimersByTime(399);
          debouncedFn();
          expect(i).toBe(2);
          jest.advanceTimersByTime(401);
          expect(i).toBe(3);
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

          jest.advanceTimersByTime(100); // 100

          debouncedFn(4, 4);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [4, 4]);

          jest.advanceTimersByTime(100); // 200

          debouncedFn(10, 10);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([5, 5], [10, 10]);

          jest.advanceTimersByTime(250); // 450

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

          jest.advanceTimersByTime(100); // 100

          debouncedFn(2, 2);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [2, 2]);

          jest.advanceTimersByTime(100); // 200

          debouncedFn(3, 3);
          expect(i).toBe(0);
          expect(_mergeParams).toHaveBeenLastCalledWith([2, 2], [3, 3]);

          jest.advanceTimersByTime(250); // 450

          expect(i).toBe(3 * 3);
        });
      });
    });

    describe('leading', () => {
      describe('timeout', () => {
        test('without timeout', () => {
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

        test('with timeout 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 0, _leading: true }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();

          debouncedFn();
          expect(rAF).toHaveBeenCalledTimes(1);
          expect(setT).not.toHaveBeenCalled();
          expect(i).toBe(1);

          jest.advanceTimersByTime(0);

          expect(i).toBe(1);
          expect(rAF).toHaveBeenCalledTimes(1);
          expect(setT).not.toHaveBeenCalled();
        });

        test('with timeout > 0', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 100, _leading: true }
          );

          expect(rAF).not.toHaveBeenCalled();
          expect(setT).not.toHaveBeenCalled();

          debouncedFn();
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);
          expect(i).toBe(1);

          jest.advanceTimersByTime(100);

          expect(i).toBe(1);
          expect(rAF).not.toHaveBeenCalled();
          expect(setT).toHaveBeenCalledTimes(1);
        });

        test('with timeout > 0 and multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 200, _leading: true }
          );

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(1);

          debouncedFn();

          jest.advanceTimersByTime(200);
          expect(i).toBe(2);
          jest.advanceTimersByTime(200);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);

          jest.advanceTimersByTime(200);
          expect(i).toBe(3);

          debouncedFn();
          expect(i).toBe(4);
          jest.advanceTimersByTime(200);
          expect(i).toBe(4);
          jest.advanceTimersByTime(200);
          expect(i).toBe(4);
        });

        test('with timeout function', async () => {
          let i = 0;
          let timeoutMs = 200;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: () => timeoutMs, _leading: true }
          );

          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(100);
          expect(i).toBe(1);

          timeoutMs = 1000;

          debouncedFn();
          jest.advanceTimersByTime(500);
          expect(i).toBe(1);

          jest.advanceTimersByTime(500);
          expect(i).toBe(2);
        });
      });

      describe('maxDelay', () => {
        test('without maxDelay', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 100, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(99);
          expect(i).toBe(1);

          jest.advanceTimersByTime(1);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          jest.advanceTimersByTime(100);

          debouncedFn();
          expect(i).toBe(4);
          jest.advanceTimersByTime(200);
          expect(i).toBe(4);
        });

        test('with maxDelay and longer timeout', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 10000, _maxDelay: 100, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(99);
          expect(i).toBe(1);

          jest.advanceTimersByTime(1);
          expect(i).toBe(2);

          jest.advanceTimersByTime(10000);
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          jest.advanceTimersByTime(20000);
          expect(i).toBe(3);
        });

        test('with maxDelay and shorter timeout with multiple calls', async () => {
          let i = 0;
          const debouncedFn = debounce(
            () => {
              i += 1;
            },
            { _timeout: 200, _maxDelay: 500, _leading: true }
          );
          debouncedFn();
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(150); // 150
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(150); // 300

          debouncedFn();
          jest.advanceTimersByTime(150); // 450
          expect(i).toBe(1);

          debouncedFn();
          jest.advanceTimersByTime(49); // 499
          expect(i).toBe(1);

          jest.advanceTimersByTime(1); // 500
          expect(i).toBe(2);

          debouncedFn();
          expect(i).toBe(3);
          jest.advanceTimersByTime(1000);
          expect(i).toBe(3);
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
            { _timeout: 200, _mergeParams, _leading: true }
          );
          debouncedFn(1, 1);
          expect(i).toBe(1);
          expect(_mergeParams).not.toHaveBeenCalled();

          jest.advanceTimersByTime(100); // 100

          debouncedFn(4, 4);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [4, 4]);

          jest.advanceTimersByTime(100); // 200

          debouncedFn(10, 10);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([5, 5], [10, 10]);

          jest.advanceTimersByTime(250); // 450

          expect(i).toBe(15 * 15 + 1);
        });

        test('without correct mergeParams function', async () => {
          let i = 0;
          const _mergeParams = jest.fn(() => null);
          const debouncedFn = debounce(
            (a, b) => {
              i += a * b;
            },
            { _timeout: 200, _mergeParams, _leading: true }
          );
          debouncedFn(1, 1);
          expect(i).toBe(1);
          expect(_mergeParams).not.toHaveBeenCalled();

          jest.advanceTimersByTime(100); // 100

          debouncedFn(2, 2);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([1, 1], [2, 2]);

          jest.advanceTimersByTime(100); // 200

          debouncedFn(3, 3);
          expect(i).toBe(1);
          expect(_mergeParams).toHaveBeenLastCalledWith([2, 2], [3, 3]);

          jest.advanceTimersByTime(250); // 450

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
      jest.runAllTimers();
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
      jest.runAllTimers();
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
      jest.runAllTimers();
      expect(i).toBe(1);
    });
  });
});
