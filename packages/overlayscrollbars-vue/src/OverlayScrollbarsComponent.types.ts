import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';

export interface OverlayScrollbarsComponentProps {
  element?: string;
  options?: PartialOptions | false | null;
  events?: EventListeners | false | null;
  defer?: boolean | IdleRequestOptions;
}

export interface OverlayScrollbarsComponentRef {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): HTMLElement | null;
}
