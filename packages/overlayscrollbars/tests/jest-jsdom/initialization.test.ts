import {
  staticInitializationElement,
  dynamicInitializationElement,
  cancelInitialization,
  Initialization,
} from 'initialization';
import { getEnvironment } from 'environment';

jest.mock('environment', () => ({
  getEnvironment: jest.fn(() => jest.requireActual('environment').getEnvironment()),
}));

const createDiv = () => document.createElement('div');

describe('initialization', () => {
  describe('staticInitializationElement', () => {
    test('defined', () => {
      const args: [a: boolean, b: string] = [true, ''];
      const fallbackElm = createDiv();
      const defaultElm = createDiv();
      const elm = createDiv();
      const fallbackElmFn = jest.fn(() => fallbackElm);
      const elmFn = jest.fn(() => elm);
      const nullFn = jest.fn(() => null);
      const falseFn = jest.fn<false, any[]>(() => false);

      const values = {
        elm: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            elm
          ),
          (result: HTMLElement) => expect(result).toBe(elm),
        ],
        null: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            null
          ),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ],
        false: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            false
          ),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ],
        undefined: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            undefined
          ),
          (result: HTMLElement) => expect(result).toBe(defaultElm),
        ],
      };

      const fns = {
        elm: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            elmFn
          ),
          (result: HTMLElement) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        null: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            nullFn
          ),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(nullFn).toHaveBeenCalledTimes(1);
            expect(nullFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        false: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            falseFn
          ),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key];
        assertion(result);
      });
    });

    test('default', () => {
      const args: [a: boolean, b: string] = [true, ''];
      const fallbackElm = createDiv();
      const elm = createDiv();
      const fallbackElmFn = jest.fn(() => fallbackElm);
      const elmFn = jest.fn(() => elm);
      const nullFn = jest.fn(() => null);
      const falseFn = jest.fn<false, any[]>(() => false);

      const values = {
        elm: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elm),
          (result: HTMLElement) => expect(result).toBe(elm),
        ],
        null: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, null),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ],
        false: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, false),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ],
      };

      const fns = {
        elm: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elmFn),
          (result: HTMLElement) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        null: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, nullFn),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(nullFn).toHaveBeenCalledTimes(1);
            expect(nullFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        false: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, falseFn),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key];
        assertion(result);
      });
    });
  });

  describe('dynamicInitializationElement', () => {
    test('defined', () => {
      const args: [a: boolean, b: string] = [true, ''];
      const fallbackElm = createDiv();
      const defaultElm = createDiv();
      const elm = createDiv();
      const fallbackElmFn = jest.fn(() => fallbackElm);
      const elmFn = jest.fn(() => elm);
      const snullFn = jest.fn(() => null);
      const falseFn = jest.fn<false, any[]>(() => false);
      const trueFn = jest.fn<true, any[]>(() => true);

      const values = {
        elm: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            elm
          ),
          (result: HTMLElement | false) => expect(result).toBe(elm),
        ],
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            null
          ),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ],
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            false
          ),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ],
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            true
          ),
          (result: HTMLElement | false) => expect(result).toBe(fallbackElm),
        ],
        undefined: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            undefined
          ),
          (result: HTMLElement | false) => expect(result).toBe(defaultElm),
        ],
      };

      const fns = {
        elm: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            elmFn
          ),
          (result: HTMLElement | false) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            snullFn
          ),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(snullFn).toHaveBeenCalledTimes(1);
            expect(snullFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            falseFn
          ),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            trueFn
          ),
          (result: HTMLElement | false) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key];
        assertion(result);
      });
    });

    test('default', () => {
      const args: [a: boolean, b: string] = [true, ''];
      const fallbackElm = createDiv();
      const elm = createDiv();
      const fallbackElmFn = jest.fn(() => fallbackElm);
      const elmFn = jest.fn(() => elm);
      const nullFn = jest.fn(() => null);
      const falseFn = jest.fn<false, any[]>(() => false);
      const trueFn = jest.fn<true, any[]>(() => true);

      const values = {
        elm: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elm),
          (result: HTMLElement | false) => expect(result).toBe(elm),
        ],
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, null),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ],
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, false),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ],
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, true),
          (result: HTMLElement | false) => expect(result).toBe(fallbackElm),
        ],
      };

      const fns = {
        elm: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elmFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, nullFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(nullFn).toHaveBeenCalledTimes(1);
            expect(nullFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, falseFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, trueFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ],
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key];
        assertion(result);
      });
    });
  });

  describe('cancelInitialization', () => {
    describe('nativeScrollbarsOverlaid', () => {
      test('defined', () => {
        (
          [
            {
              nativeScrollbarsOverlaid: false,
              body: false,
            },
            {
              nativeScrollbarsOverlaid: true,
              body: false,
            },
          ] as Initialization['cancel'][]
        ).forEach((defaultCancelInitialization) => {
          [
            { nativeScrollbarsOverlaid: false },
            { nativeScrollbarsOverlaid: true },
            { nativeScrollbarsOverlaid: undefined },
          ].forEach((initializationValue) => {
            [
              {
                _nativeScrollbarsOverlaid: {
                  x: false,
                  y: false,
                },
              },
              {
                _nativeScrollbarsOverlaid: {
                  x: false,
                  y: true,
                },
              },
              {
                _nativeScrollbarsOverlaid: {
                  x: true,
                  y: true,
                },
              },
            ].forEach((env) => {
              (getEnvironment as jest.Mock).mockImplementation(() => ({
                ...jest.requireActual('environment').getEnvironment(),
                ...env,
              }));
              const hasOverlaidScrollbars =
                env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
              const expected =
                hasOverlaidScrollbars &&
                (initializationValue.nativeScrollbarsOverlaid ??
                  defaultCancelInitialization.nativeScrollbarsOverlaid);

              expect(
                cancelInitialization(false, defaultCancelInitialization, initializationValue)
              ).toEqual(expected);
            });
          });
        });
      });

      test('default', () => {
        (
          [
            {
              nativeScrollbarsOverlaid: false,
              body: false,
            },
            {
              nativeScrollbarsOverlaid: true,
              body: false,
            },
          ] as Initialization['cancel'][]
        ).forEach((defaultCancelInitialization) => {
          [
            {
              _nativeScrollbarsOverlaid: {
                x: false,
                y: false,
              },
            },
            {
              _nativeScrollbarsOverlaid: {
                x: false,
                y: true,
              },
            },
            {
              _nativeScrollbarsOverlaid: {
                x: true,
                y: true,
              },
            },
          ].forEach((env) => {
            (getEnvironment as jest.Mock).mockImplementation(() => ({
              ...jest.requireActual('environment').getEnvironment(),
              ...env,
            }));
            const hasOverlaidScrollbars =
              env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
            const expected =
              hasOverlaidScrollbars && defaultCancelInitialization.nativeScrollbarsOverlaid;

            expect(cancelInitialization(false, defaultCancelInitialization)).toEqual(expected);
            expect(cancelInitialization(false, defaultCancelInitialization, undefined)).toEqual(
              expected
            );
            expect(cancelInitialization(false, defaultCancelInitialization, null)).toEqual(
              expected
            );
            expect(cancelInitialization(false, defaultCancelInitialization, false)).toEqual(
              expected
            );
          });
        });
      });
    });

    describe('body', () => {
      test('defined', () => {
        (
          [
            {
              nativeScrollbarsOverlaid: false,
              body: false,
            },
            {
              nativeScrollbarsOverlaid: false,
              body: true,
            },
            {
              nativeScrollbarsOverlaid: false,
              body: null,
            },
          ] as Initialization['cancel'][]
        ).forEach((defaultCancelInitialization) => {
          [{ body: false }, { body: true }, { body: null }, { body: undefined }].forEach(
            (initializationValue) => {
              [{ _nativeScrollbarsHiding: false }, { _nativeScrollbarsHiding: true }].forEach(
                (env) => {
                  [false, true].forEach((isBody) => {
                    (getEnvironment as jest.Mock).mockImplementation(() => ({
                      ...jest.requireActual('environment').getEnvironment(),
                      ...env,
                    }));
                    const defaultBody = defaultCancelInitialization.body;
                    const bodyValue = initializationValue.body;
                    const finalBody = bodyValue === undefined ? defaultBody : bodyValue;
                    const expected =
                      isBody && (finalBody === null ? !env._nativeScrollbarsHiding : finalBody);

                    expect(
                      cancelInitialization(isBody, defaultCancelInitialization, initializationValue)
                    ).toEqual(expected);
                  });
                }
              );
            }
          );
        });
      });

      test('default', () => {
        (
          [
            {
              nativeScrollbarsOverlaid: false,
              body: false,
            },
            {
              nativeScrollbarsOverlaid: false,
              body: true,
            },
            {
              nativeScrollbarsOverlaid: false,
              body: null,
            },
          ] as Initialization['cancel'][]
        ).forEach((defaultCancelInitialization) => {
          [{ _nativeScrollbarsHiding: false }, { _nativeScrollbarsHiding: true }].forEach((env) => {
            [false, true].forEach((isBody) => {
              (getEnvironment as jest.Mock).mockImplementation(() => ({
                ...jest.requireActual('environment').getEnvironment(),
                ...env,
              }));
              const defaultBody = defaultCancelInitialization.body;
              const expected =
                isBody && (defaultBody === null ? !env._nativeScrollbarsHiding : defaultBody);

              expect(cancelInitialization(isBody, defaultCancelInitialization)).toEqual(expected);
              expect(cancelInitialization(isBody, defaultCancelInitialization, undefined)).toEqual(
                expected
              );
              expect(cancelInitialization(isBody, defaultCancelInitialization, null)).toEqual(
                expected
              );
              expect(cancelInitialization(isBody, defaultCancelInitialization, false)).toEqual(
                expected
              );
            });
          });
        });
      });
    });
  });
});
