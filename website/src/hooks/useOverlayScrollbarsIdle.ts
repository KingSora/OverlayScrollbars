import { useMemo } from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type {
  UseOverlayScrollbarsParams,
  UseOverlayScrollbarsInitialization,
  UseOverlayScrollbarsInstance,
} from 'overlayscrollbars-react';
import type { InitializationTarget } from 'overlayscrollbars';

export const useOverlayScrollbarsIdle = (
  params?: UseOverlayScrollbarsParams
): [
  (...args: Parameters<UseOverlayScrollbarsInitialization>) => void,
  UseOverlayScrollbarsInstance
] => {
  const [initialize, instance] = useOverlayScrollbars(params);
  return useMemo(
    () => [
      (target: InitializationTarget) => {
        if (typeof window !== 'undefined' && window.requestIdleCallback) {
          window.requestIdleCallback(
            () => {
              initialize(target);
            },
            { timeout: 2000 }
          );
        } else {
          initialize(target);
        }
      },
      instance,
    ],
    [initialize, instance]
  );
};
