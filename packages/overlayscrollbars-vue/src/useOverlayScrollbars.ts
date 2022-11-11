import { shallowRef, unref, watch } from 'vue';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { Ref, UnwrapRef } from 'vue';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?:
    | OverlayScrollbarsComponentProps['options']
    | Ref<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?:
    | OverlayScrollbarsComponentProps['events']
    | Ref<OverlayScrollbarsComponentProps['events']>;
}

export type UseOverlayScrollbarsInitialization = (
  target: InitializationTarget
) => OverlayScrollbars;

export type UseOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['osInstance']
>;

/**
 * Composable for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams | Ref<UseOverlayScrollbarsParams | undefined>
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  let instance: ReturnType<UseOverlayScrollbarsInstance> = null;
  let options: UnwrapRef<UseOverlayScrollbarsParams['options']>;
  let events: UnwrapRef<UseOverlayScrollbarsParams['events']>;
  const paramsRef = shallowRef(params || {});

  watch(
    () => unref(paramsRef.value?.options),
    (currOptions) => {
      options = currOptions;

      if (OverlayScrollbars.valid(instance)) {
        instance.options(options || {}, true);
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => unref(paramsRef.value?.events),
    (currEvents) => {
      events = currEvents;

      if (OverlayScrollbars.valid(instance)) {
        instance.on(
          /* c8 ignore next */
          events || {},
          true
        );
      }
    },
    { deep: true, immediate: true }
  );

  return [
    (target: InitializationTarget): OverlayScrollbars => {
      // if already initialized return the current instance
      if (OverlayScrollbars.valid(instance)) {
        return instance;
      }

      return (instance = OverlayScrollbars(target, options || {}, events || {}));
    },
    () => instance,
  ];
};
