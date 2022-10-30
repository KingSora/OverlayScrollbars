import { describe, test, expect, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverlayScrollbars } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-react';
import type { RefObject } from 'react';
import type { OverlayScrollbarsComponentRef } from '~/overlayscrollbars-react';

describe('OverlayScrollbarsComponent', () => {
  describe('correct rendering', () => {
    test('correct root element', () => {
      const elementA = 'code';
      const elementB = 'span';
      const { container, rerender } = render(<OverlayScrollbarsComponent />);

      expect(container).not.toBeEmptyDOMElement();
      expect(container.querySelector('div')).toBe(container.firstElementChild); // default is div

      rerender(<OverlayScrollbarsComponent element={elementA} />);
      expect(container.querySelector(elementA)).toBe(container.firstElementChild);

      rerender(<OverlayScrollbarsComponent element={elementB} />);
      expect(container.querySelector(elementB)).toBe(container.firstElementChild);
    });

    test('children', () => {
      render(
        <OverlayScrollbarsComponent>
          hello <span>react</span>
        </OverlayScrollbarsComponent>
      );
      expect(screen.getByText(/hello/)).toBeInTheDocument();
      expect(screen.getByText(/react/)).toBeInTheDocument();
    });

    test('className', () => {
      const { container, rerender } = render(
        <OverlayScrollbarsComponent className="overlay scrollbars" />
      );

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars');

      rerender(<OverlayScrollbarsComponent className="overlay scrollbars react" />);

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars', 'react');
    });

    test('style', () => {
      const { container, rerender } = render(
        <OverlayScrollbarsComponent style={{ width: '22px' }} />
      );

      expect(container.firstElementChild).toHaveStyle({ width: '22px' });

      rerender(<OverlayScrollbarsComponent style={{ height: '33px' }} />);

      expect(container.firstElementChild).toHaveStyle({ height: '33px' });
    });
  });

  test('ref', () => {
    const ref: RefObject<OverlayScrollbarsComponentRef> = { current: null };
    const { container } = render(<OverlayScrollbarsComponent ref={ref} />);

    const { instance, target } = ref.current!;
    expect(instance).toBeTypeOf('function');
    expect(target).toBeTypeOf('function');
    expect(OverlayScrollbars.valid(instance())).toBe(true);
    expect(target()).toBe(container.firstElementChild);
  });

  test('options', () => {
    const ref: RefObject<OverlayScrollbarsComponentRef> = { current: null };
    const { rerender } = render(
      <OverlayScrollbarsComponent
        options={{ paddingAbsolute: true, overflow: { y: 'hidden' } }}
        ref={ref}
      />
    );

    const opts = ref.current!.instance()!.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    rerender(<OverlayScrollbarsComponent options={{ overflow: { x: 'hidden' } }} ref={ref} />);

    const newOpts = ref.current!.instance()!.options()!;
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
  });

  test('events', () => {
    const ref: RefObject<OverlayScrollbarsComponentRef> = { current: null };
    const onUpdatedInitial = vitest.fn();
    const onUpdated = vitest.fn();
    const { rerender } = render(
      <OverlayScrollbarsComponent events={{ updated: onUpdatedInitial }} ref={ref} />
    );

    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);

    rerender(<OverlayScrollbarsComponent events={{ updated: onUpdated }} ref={ref} />);

    expect(onUpdated).not.toHaveBeenCalled();

    ref.current!.instance()!.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    rerender(
      <OverlayScrollbarsComponent events={{ updated: [onUpdated, onUpdatedInitial] }} ref={ref} />
    );

    ref.current!.instance()!.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);

    // unregister works with `[]`, `null` or `undefined`
    rerender(<OverlayScrollbarsComponent events={{ updated: null }} ref={ref} />);

    ref.current!.instance()!.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);
  });
});
