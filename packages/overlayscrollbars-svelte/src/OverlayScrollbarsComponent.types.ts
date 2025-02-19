import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { Component, ComponentProps, Snippet } from 'svelte';

export type ValidSvelteHTMLTags = Extract<keyof SvelteHTMLElements, string>;
export type ValidSvelteComponent<E extends keyof SvelteHTMLElements = keyof SvelteHTMLElements> =
  Component<
    {
      children?: Snippet;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [prop: string | number | symbol]: any;
    },
    {
      getElement: () => SvelteHTMLElementFromHtmlAttributes<SvelteHTMLElements[E]> | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [prop: string | number | symbol]: any;
    }
  >;
export type ValidSvelteElement = ValidSvelteHTMLTags | ValidSvelteComponent;
export type ValidSvelteElementProps<T extends ValidSvelteElement = ValidSvelteElement> =
  T extends ValidSvelteComponent
    ? ComponentProps<T>
    : T extends keyof SvelteHTMLElements
      ? SvelteHTMLElements[T]
      : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        {};
export type ValidSvelteHTMLElement<T extends ValidSvelteElement = ValidSvelteElement> =
  T extends ValidSvelteComponent
    ? Exclude<ReturnType<ReturnType<T>['getElement']>, undefined>
    : T extends keyof SvelteHTMLElements
      ? SvelteHTMLElementFromHtmlAttributes<SvelteHTMLElements[T]>
      : HTMLElement;

type SvelteHTMLElementFromHtmlAttributes<E> =
  E extends HTMLAttributes<infer El> ? (EventTarget extends El ? HTMLElement : El) : HTMLElement;

export type OverlayScrollbarsComponentProps<T extends ValidSvelteElement = 'div'> =
  ValidSvelteElementProps<T> & {
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null;
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions;
  };

export interface OverlayScrollbarsComponentRef<T extends ValidSvelteElement = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): ValidSvelteHTMLElement<T> | null;
}
