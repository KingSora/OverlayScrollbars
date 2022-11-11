import { createRenderEffect } from 'solid-js';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { Accessor } from 'solid-js';
import type { Store } from 'solid-js/store';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';

export interface CreateOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?:
    | OverlayScrollbarsComponentProps['options']
    | Accessor<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?:
    | OverlayScrollbarsComponentProps['events']
    | Accessor<OverlayScrollbarsComponentProps['events']>;
}

export type CreateOverlayScrollbarsInitialization = (
  target: InitializationTarget
) => OverlayScrollbars;

export type CreateOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['osInstance']
>;

const isAccessor = (obj: any): obj is Accessor<any> => typeof obj === 'function';
const unwrapAccessor = <T>(obj: Accessor<T> | T): T => (isAccessor(obj) ? obj() : obj);

export const createOverlayScrollbars = (
  params?:
    | CreateOverlayScrollbarsParams
    | Accessor<CreateOverlayScrollbarsParams | undefined>
    | Store<CreateOverlayScrollbarsParams | undefined>
): [CreateOverlayScrollbarsInitialization, CreateOverlayScrollbarsInstance] => {
  let instance: OverlayScrollbars | null = null;
  let options: OverlayScrollbarsComponentProps['options'];
  let events: OverlayScrollbarsComponentProps['events'];

  createRenderEffect(() => {
    options = unwrapAccessor(unwrapAccessor(params)?.options);

    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  });

  createRenderEffect(() => {
    events = unwrapAccessor(unwrapAccessor(params)?.events);

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events || {}, true);
    }
  });

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
