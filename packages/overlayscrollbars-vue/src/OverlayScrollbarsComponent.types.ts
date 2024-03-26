import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import type { Component } from 'vue';

export interface OverlayScrollbarsComponentProps {
  /** Tag of the root element. */
  element?: string | Component;
  /** OverlayScrollbars options. */
  options?: PartialOptions | false | null;
  /** OverlayScrollbars events. */
  events?: EventListeners | false | null;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: boolean | IdleRequestOptions;
}

export interface OverlayScrollbarsComponentRef {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): HTMLElement | null;
}
