import { vi, describe, test, expect } from 'vitest';
import type { Initialization } from '../../src/initialization';
import {
  staticInitializationElement,
  dynamicInitializationElement,
  cancelInitialization,
} from '../../src/initialization';
import { Env, getEnvironment } from '../../src/environment';

vi.mock(import('../../src/environment'), async (importActual) => {
  const actualModule = await importActual();
  const getEnvironment = vi.fn(actualModule.getEnvironment);

  return {
    ...actualModule,
    getEnvironment,
  };
});

const createDiv = () => document.createElement('div');

describe('initialization', () => {
  describe('staticInitializationElement', () => {
    test('defined', () => {
      const args: [a: boolean, b: string] = [true, ''];
      const fallbackElm = createDiv();
      const defaultElm = createDiv();
      const elm = createDiv();
      const fallbackElmFn = vi.fn(() => fallbackElm);
      const elmFn = vi.fn(() => elm);
      const nullFn = vi.fn(() => null);
      const falseFn = vi.fn<any>(() => false);

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
      const fallbackElmFn = vi.fn(() => fallbackElm);
      const elmFn = vi.fn(() => elm);
      const nullFn = vi.fn(() => null);
      const falseFn = vi.fn<any>(() => false);

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
      const fallbackElmFn = vi.fn(() => fallbackElm);
      const elmFn = vi.fn(() => elm);
      const snullFn = vi.fn(() => null);
      const falseFn = vi.fn<any>(() => false);
      const trueFn = vi.fn<any>(() => true);

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
      const fallbackElmFn = vi.fn(() => fallbackElm);
      const elmFn = vi.fn(() => elm);
      const nullFn = vi.fn(() => null);
      const falseFn = vi.fn<any>(() => false);
      const trueFn = vi.fn<any>(() => true);

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
      test('defined', async () => {
        const defaultInitializations: Initialization['cancel'][] = [
          {
            nativeScrollbarsOverlaid: false,
            body: false,
          },
          {
            nativeScrollbarsOverlaid: true,
            body: false,
          },
        ];
        const initializations: Partial<
          Pick<Initialization['cancel'], 'nativeScrollbarsOverlaid'>
        >[] = [
          { nativeScrollbarsOverlaid: false },
          { nativeScrollbarsOverlaid: true },
          { nativeScrollbarsOverlaid: undefined },
        ];
        const envs = [
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
        ];
        const testFn = async (
          defaultInitializationValue: Initialization['cancel'],
          initializationValue: Partial<Pick<Initialization['cancel'], 'nativeScrollbarsOverlaid'>>,
          env: Pick<Env, '_nativeScrollbarsOverlaid'>
        ) => {
          const actualModule =
            await vi.importActual<typeof import('../../src/environment')>('../../src/environment');
          vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(() => ({
            ...actualModule.getEnvironment(),
            ...env,
            _getDefaultInitialization: () => ({
              ...actualModule.getEnvironment()._getDefaultInitialization(),
              cancel: defaultInitializationValue,
            }),
          }));

          const hasOverlaidScrollbars =
            env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
          const expected =
            hasOverlaidScrollbars &&
            (initializationValue.nativeScrollbarsOverlaid ??
              defaultInitializationValue.nativeScrollbarsOverlaid);

          expect(cancelInitialization(false, initializationValue)).toEqual(expected);
        };

        await Promise.all(
          defaultInitializations
            .map((defaultInitialization) =>
              initializations.map((initialization) =>
                envs.map((env) => testFn(defaultInitialization, initialization, env))
              )
            )
            .flat(2)
        );
      });

      test('default', async () => {
        const defaultInitializations: Initialization['cancel'][] = [
          {
            nativeScrollbarsOverlaid: false,
            body: false,
          },
          {
            nativeScrollbarsOverlaid: true,
            body: false,
          },
        ];
        const envs = [
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
        ];
        const testFn = async (
          defaultInitializationValue: Initialization['cancel'],
          env: Pick<Env, '_nativeScrollbarsOverlaid'>
        ) => {
          const actualModule =
            await vi.importActual<typeof import('../../src/environment')>('../../src/environment');
          vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(() => ({
            ...actualModule.getEnvironment(),
            ...env,
            _getDefaultInitialization: () => ({
              ...actualModule.getEnvironment()._getDefaultInitialization(),
              cancel: defaultInitializationValue,
            }),
          }));

          const hasOverlaidScrollbars =
            env._nativeScrollbarsOverlaid.x || env._nativeScrollbarsOverlaid.y;
          const expected =
            hasOverlaidScrollbars && defaultInitializationValue.nativeScrollbarsOverlaid;

          expect(cancelInitialization(false)).toEqual(expected);
          expect(cancelInitialization(false, undefined)).toEqual(expected);
          expect(cancelInitialization(false, null)).toEqual(expected);
          expect(cancelInitialization(false, false)).toEqual(expected);
        };

        await Promise.all(
          defaultInitializations
            .map((defaultInitialization) => envs.map((env) => testFn(defaultInitialization, env)))
            .flat(2)
        );
      });
    });

    describe('body', () => {
      test('defined', async () => {
        const defaultInitializations: Initialization['cancel'][] = [
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
        ];
        const initializations: Partial<Pick<Initialization['cancel'], 'body'>>[] = [
          { body: false },
          { body: true },
          { body: null },
          { body: undefined },
        ];
        const envs = [{ _nativeScrollbarsHiding: false }, { _nativeScrollbarsHiding: true }];
        const isBodys = [false, true];
        const testFn = async (
          defaultInitializationValue: Initialization['cancel'],
          initializationValue: Partial<Pick<Initialization['cancel'], 'body'>>,
          env: Pick<Env, '_nativeScrollbarsHiding'>,
          isBody: boolean
        ) => {
          const actualModule =
            await vi.importActual<typeof import('../../src/environment')>('../../src/environment');
          vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(() => ({
            ...actualModule.getEnvironment(),
            ...env,
            _getDefaultInitialization: () => ({
              ...actualModule.getEnvironment()._getDefaultInitialization(),
              cancel: defaultInitializationValue,
            }),
          }));

          const defaultBody = defaultInitializationValue.body;
          const bodyValue = initializationValue.body;
          const finalBody = bodyValue === undefined ? defaultBody : bodyValue;
          const expected =
            isBody && (finalBody === null ? !env._nativeScrollbarsHiding : finalBody);

          expect(cancelInitialization(isBody, initializationValue)).toEqual(expected);
        };

        await Promise.all(
          defaultInitializations
            .map((defaultInitialization) =>
              initializations.map((initialization) =>
                envs.map((env) =>
                  isBodys.map((isBody) =>
                    testFn(defaultInitialization, initialization, env, isBody)
                  )
                )
              )
            )
            .flat(3)
        );
      });

      test('default', async () => {
        const defaultInitializations: Initialization['cancel'][] = [
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
        ];
        const envs = [{ _nativeScrollbarsHiding: false }, { _nativeScrollbarsHiding: true }];
        const isBodys = [false, true];
        const testFn = async (
          defaultInitializationValue: Initialization['cancel'],
          env: Pick<Env, '_nativeScrollbarsHiding'>,
          isBody: boolean
        ) => {
          const actualModule =
            await vi.importActual<typeof import('../../src/environment')>('../../src/environment');
          vi.mocked({ getEnvironment }).getEnvironment.mockImplementation(() => ({
            ...actualModule.getEnvironment(),
            ...env,
            _getDefaultInitialization: () => ({
              ...actualModule.getEnvironment()._getDefaultInitialization(),
              cancel: defaultInitializationValue,
            }),
          }));

          const defaultBody = defaultInitializationValue.body;
          const expected =
            isBody && (defaultBody === null ? !env._nativeScrollbarsHiding : defaultBody);

          expect(cancelInitialization(isBody)).toEqual(expected);
          expect(cancelInitialization(isBody, undefined)).toEqual(expected);
          expect(cancelInitialization(isBody, null)).toEqual(expected);
          expect(cancelInitialization(isBody, false)).toEqual(expected);
        };

        await Promise.all(
          defaultInitializations
            .map((defaultInitialization) =>
              envs.map((env) => isBodys.map((isBody) => testFn(defaultInitialization, env, isBody)))
            )
            .flat(2)
        );
      });
    });
  });
});
