import { useRef } from 'react';
import { describe, test, afterEach, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useOverlayScrollbars } from '../../src/overlayscrollbars-react';

describe('useOverlayScrollbars', () => {
  afterEach(() => cleanup());

  test('re-initialization', async () => {
    const Test = () => {
      const instanceRef = useRef<OverlayScrollbars | null>(null);
      const [initialize, instance] = useOverlayScrollbars();
      return (
        <button
          onClick={(event) => {
            initialize(event.target as HTMLElement);
            if (instanceRef.current) {
              expect(instanceRef.current).toBe(instance());
            }
            instanceRef.current = instance();
            expect(instanceRef.current).toBe(instance());
          }}
        >
          initialize
        </button>
      );
    };

    const { unmount } = render(<Test />);

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
