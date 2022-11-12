import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';

// Use "$" at the end so the type doesn't collide with generated type by svelte
export interface OverlayScrollbarsComponentProps$ {
  element?: string;
  options?: PartialOptions | false | null;
  events?: EventListeners | false | null;
}

export interface OverlayScrollbarsComponentRef {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): HTMLElement | null;
}
