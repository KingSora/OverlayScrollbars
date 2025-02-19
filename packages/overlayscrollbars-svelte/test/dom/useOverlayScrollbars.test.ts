import { describe, test, afterEach, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import type {
  UseOverlayScrollbarsInitialization,
  UseOverlayScrollbarsInstance,
} from '../../src/useOverlayScrollbars.svelte';
import TestUseOverlayScrollbarsInitialize from './TestUseOverlayScrollbarsInitialize.svelte';

describe('useOverlayScrollbars', () => {
  afterEach(() => cleanup());

  test('re-initialization', async () => {
    const { unmount } = render(TestUseOverlayScrollbarsInitialize, {
      // @ts-ignore
      props: {
        click: (
          initialize: UseOverlayScrollbarsInitialization,
          instance: UseOverlayScrollbarsInstance,
          instanceRef: { current: OverlayScrollbars | null },
          target: HTMLElement
        ) => {
          initialize(target);
          if (instanceRef.current) {
            expect(instanceRef.current).toBe(instance());
          }
          instanceRef.current = instance();
          expect(instanceRef.current).toBe(instance());
        },
      },
    });

    const initializeBtn = screen.getByRole('button');
    await userEvent.click(initializeBtn);
    // taking snapshot here wouldn't be equal because of "tabindex" attribute of the viewport element
    await userEvent.click(initializeBtn);
    const snapshot = initializeBtn.innerHTML;
    await userEvent.click(initializeBtn);

    expect(snapshot).toBe(initializeBtn.innerHTML);

    expect(OverlayScrollbars(initializeBtn)).toBeDefined();

    unmount();

    expect(OverlayScrollbars(initializeBtn)).toBeUndefined();
  });
});
