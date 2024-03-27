import { describe, test, expect, afterEach, vi } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import Test from './Test.svelte';

const getComputedStyleOriginal = window.getComputedStyle;
vi.stubGlobal(
  'getComputedStyle',
  vi.fn(function (...args: Parameters<typeof getComputedStyleOriginal>) {
    const result: CSSStyleDeclaration = getComputedStyleOriginal.apply(
      // @ts-ignore
      this,
      args
    );
    const getPropertyValueOriginal = result.getPropertyValue;
    result.getPropertyValue = function (prop: string) {
      if (prop === 'scrollbar-width' || prop === 'scrollbarWidth') {
        return 'none';
      }
      return getPropertyValueOriginal.call(this, prop);
    };
    return result;
  })
);

describe('OverlayScrollbarsComponent', () => {
  afterEach(() => cleanup());

  test('body', async () => {
    const htmlElement = document.documentElement;
    document.body.remove();

    const { unmount } = render(
      Test,
      {
        // @ts-ignore
        target: htmlElement,
        props: {
          element: 'body',
        },
      },
      {
        container: htmlElement,
      }
    );

    expect(htmlElement).toHaveAttribute('data-overlayscrollbars');
    expect(htmlElement.querySelector('body')).toHaveAttribute('data-overlayscrollbars-initialize');
    expect(htmlElement.querySelector('body')).not.toBeEmptyDOMElement();
    expect(htmlElement.querySelector('body')?.firstElementChild!.tagName).toBe('SECTION');
    expect(htmlElement.querySelector('body')?.firstElementChild).toHaveAttribute('id', 'body');

    unmount();
  });
});
