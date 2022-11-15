import { useEffect, useMemo } from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type {
  UseOverlayScrollbarsParams,
  UseOverlayScrollbarsInitialization,
  UseOverlayScrollbarsInstance,
} from 'overlayscrollbars-react';
import type { InitializationTarget } from 'overlayscrollbars';

type Defer = [
  request: (callback: () => any, options?: IdleRequestOptions) => void,
  clear: () => void
];

const createDefer = (idle?: boolean): Defer => {
  let id: number;
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    const setTFn = idle ? window.requestIdleCallback : window.requestAnimationFrame;
    const clearTFn = idle ? window.cancelIdleCallback : window.cancelAnimationFrame;
    return [
      (callback: () => any, options?: IdleRequestOptions) => {
        clearTFn(id);
        id = setTFn(callback, options);
      },
      () => clearTFn(id),
    ];
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return [(callback: () => any) => callback(), () => {}];
};

export const useOverlayScrollbarsIdle = (
  params?: UseOverlayScrollbarsParams
): [
  (...args: Parameters<UseOverlayScrollbarsInitialization>) => void,
  UseOverlayScrollbarsInstance
] => {
  const [requestIdle, clearIdle] = useMemo<Defer>(() => createDefer(true), []);
  const [requestRAF, clearRAF] = useMemo<Defer>(() => createDefer(), []);
  const [initialize, instance] = useOverlayScrollbars(params);

  useEffect(() => {
    return () => {
      clearRAF();
      clearIdle();
      instance()?.destroy();
    };
  }, []);

  return useMemo(
    () => [
      (target: InitializationTarget) => {
        requestIdle(
          () => {
            requestRAF(() => {
              initialize(target);
            });
          },
          { timeout: 2000 }
        );
      },
      instance,
    ],
    [initialize, instance]
  );
};
