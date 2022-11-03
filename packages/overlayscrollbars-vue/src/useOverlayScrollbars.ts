import { shallowRef, unref, watch } from 'vue';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { Ref } from 'vue';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';

type Options = OverlayScrollbarsComponentProps['options'];
type Events = OverlayScrollbarsComponentProps['events'];

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?: Options | Ref<Options | undefined>;
  /** OverlayScrollbars events. */
  events?: Events | Ref<Events | undefined>;
}

export type UseOverlayScrollbarsInitialization = (
  target: InitializationTarget
) => OverlayScrollbars;

export type UseOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['instance']
>;

/**
 * Composable for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams | Ref<UseOverlayScrollbarsParams>
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  const paramsRef = shallowRef(params || {});
  const variables = shallowRef<{
    instance: ReturnType<UseOverlayScrollbarsInstance>;
    options?: Options;
    events?: Events;
  }>({
    instance: null,
  });

  watch(
    () => unref(paramsRef.value.options),
    () => {
      const {
        value: { options: rawOptions },
      } = paramsRef;
      const {
        value: { instance },
      } = variables;
      const options = unref(rawOptions);

      variables.value.options = options;

      if (OverlayScrollbars.valid(instance)) {
        instance.options(options || {}, true);
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => unref(paramsRef.value.events),
    () => {
      const {
        value: { events: rawEvents },
      } = paramsRef;
      const {
        value: { instance },
      } = variables;
      const events = unref(rawEvents);

      variables.value.events = events;

      if (OverlayScrollbars.valid(instance)) {
        instance.on(events || {}, true);
      }
    },
    { deep: true, immediate: true }
  );

  return [
    (target: InitializationTarget): OverlayScrollbars => {
      // if already initialized return the current instance
      const {
        value: { instance, options, events },
      } = variables;
      if (OverlayScrollbars.valid(instance)) {
        return instance;
      }

      const currOptions = options || {};
      const currEvents = events || {};
      const osInstance = (variables.value.instance = OverlayScrollbars(
        target,
        currOptions,
        currEvents
      ));

      return osInstance;
    },
    () => variables.value.instance,
  ];
};
