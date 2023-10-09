import {
  staticInitializationElement,
  dynamicInitializationElement,
  cancelInitialization,
} from '~/initialization';
import { getEnvironment } from '~/environment';
import type { Initialization } from '~/initialization';

jest.mock('~/environment', () => ({
  getEnvironment: jest.fn(() => jest.requireActual('~/environment').getEnvironment()),
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
        ] as const,
        null: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            null
          ),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ] as const,
        false: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            false
          ),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ] as const,
        undefined: [
          staticInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            undefined
          ),
          (result: HTMLElement) => expect(result).toBe(defaultElm),
        ] as const,
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
        ] as const,
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
        ] as const,
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
        ] as const,
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key as keyof typeof values];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key as keyof typeof fns];
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
        ] as const,
        null: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, null),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ] as const,
        false: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, false),
          (result: HTMLElement) => expect(result).toBe(fallbackElm),
        ] as const,
      };

      const fns = {
        elm: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elmFn),
          (result: HTMLElement) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
        null: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, nullFn),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(nullFn).toHaveBeenCalledTimes(1);
            expect(nullFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
        false: [
          staticInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, falseFn),
          (result: HTMLElement) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key as keyof typeof values];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key as keyof typeof fns];
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
        ] as const,
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            null
          ),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ] as const,
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            false
          ),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ] as const,
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            true
          ),
          (result: HTMLElement | false) => expect(result).toBe(fallbackElm),
        ] as const,
        undefined: [
          dynamicInitializationElement<[a: boolean, b: string]>(
            args,
            fallbackElmFn,
            defaultElm,
            undefined
          ),
          (result: HTMLElement | false) => expect(result).toBe(defaultElm),
        ] as const,
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
        ] as const,
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
        ] as const,
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
        ] as const,
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
        ] as const,
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key as keyof typeof values];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key as keyof typeof fns];
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
        ] as const,
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, null),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ] as const,
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, false),
          (result: HTMLElement | false) => expect(result).toBe(false),
        ] as const,
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, true),
          (result: HTMLElement | false) => expect(result).toBe(fallbackElm),
        ] as const,
      };

      const fns = {
        elm: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, elmFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(elm);
            expect(elmFn).toHaveBeenCalledTimes(1);
            expect(elmFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
        null: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, nullFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(nullFn).toHaveBeenCalledTimes(1);
            expect(nullFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
        false: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, falseFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(false);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
        true: [
          dynamicInitializationElement<[a: boolean, b: string]>(args, fallbackElmFn, trueFn),
          (result: HTMLElement | false) => {
            expect(result).toBe(fallbackElm);
            expect(falseFn).toHaveBeenCalledTimes(1);
            expect(falseFn).toHaveBeenLastCalledWith(...args);
          },
        ] as const,
      };

      Object.keys(values).forEach((key) => {
        const [result, assertion] = values[key as keyof typeof values];
        assertion(result);
      });

      Object.keys(fns).forEach((key) => {
        const [result, assertion] = fns[key as keyof typeof fns];
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
                ...jest.requireActual('~/environment').getEnvironment(),
                ...env,
                _getDefaultInitialization: () => ({
                  cancel: defaultCancelInitialization,
                }),
              }));
              const hasOverlaidScrollbars =
                env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
              const expected =
                hasOverlaidScrollbars &&
                (initializationValue.nativeScrollbarsOverlaid ??
                  defaultCancelInitialization.nativeScrollbarsOverlaid);

              expect(cancelInitialization(false, initializationValue)).toEqual(expected);
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
              ...jest.requireActual('~/environment').getEnvironment(),
              ...env,
              _getDefaultInitialization: () => ({
                cancel: defaultCancelInitialization,
              }),
            }));
            const hasOverlaidScrollbars =
              env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
            const expected =
              hasOverlaidScrollbars && defaultCancelInitialization.nativeScrollbarsOverlaid;

            expect(cancelInitialization(false)).toEqual(expected);
            expect(cancelInitialization(false, undefined)).toEqual(expected);
            expect(cancelInitialization(false, null)).toEqual(expected);
            expect(cancelInitialization(false, false)).toEqual(expected);
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
                      ...jest.requireActual('~/environment').getEnvironment(),
                      ...env,
                      _getDefaultInitialization: () => ({
                        cancel: defaultCancelInitialization,
                      }),
                    }));
                    const defaultBody = defaultCancelInitialization.body;
                    const bodyValue = initializationValue.body;
                    const finalBody = bodyValue === undefined ? defaultBody : bodyValue;
                    const expected =
                      isBody && (finalBody === null ? !env._nativeScrollbarsHiding : finalBody);

                    expect(cancelInitialization(isBody, initializationValue)).toEqual(expected);
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
                ...jest.requireActual('~/environment').getEnvironment(),
                ...env,
                _getDefaultInitialization: () => ({
                  cancel: defaultCancelInitialization,
                }),
              }));
              const defaultBody = defaultCancelInitialization.body;
              const expected =
                isBody && (defaultBody === null ? !env._nativeScrollbarsHiding : defaultBody);

              expect(cancelInitialization(isBody)).toEqual(expected);
              expect(cancelInitialization(isBody, undefined)).toEqual(expected);
              expect(cancelInitialization(isBody, null)).toEqual(expected);
              expect(cancelInitialization(isBody, false)).toEqual(expected);
            });
          });
        });
      });
    });
  });
});
