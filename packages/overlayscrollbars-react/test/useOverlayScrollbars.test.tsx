import { useRef } from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOverlayScrollbars } from '~/overlayscrollbars-react';
import type { OverlayScrollbars } from 'overlayscrollbars';

describe('useOverlayScrollbars', () => {
  test('re-initialization', () => {
    const Test = () => {
      const instanceRef = useRef<OverlayScrollbars | null>(null);
      const [initialize, instance] = useOverlayScrollbars();
      return (
        <>
          <button
            onClick={(event) => {
              const osInstance = initialize(event.target as HTMLElement);
              if (instanceRef.current) {
                expect(instanceRef.current).toBe(osInstance);
                expect(instanceRef.current).toBe(instance());
              }
              instanceRef.current = osInstance;
              expect(instanceRef.current).toBe(instance());
            }}
          >
            initialize
          </button>
        </>
      );
    };

    render(<Test />);

    const initializeBtn = screen.getByRole('button');
    userEvent.click(initializeBtn);
    // taking snapshot here wouldn't be equal because of "tabindex" attribute of the viewport element
    userEvent.click(initializeBtn);
    const snapshot = initializeBtn.innerHTML;
    userEvent.click(initializeBtn);

    expect(snapshot).toBe(initializeBtn.innerHTML);
  });
});
