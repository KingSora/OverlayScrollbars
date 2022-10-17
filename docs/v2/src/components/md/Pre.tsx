import { useEffect, useRef } from 'react';
import { OverlayScrollbars } from '@~package/overlayscrollbars';
import type { ComponentProps } from 'react';

export const Pre = ({ children }: ComponentProps<'pre'>) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const instance = OverlayScrollbars(ref.current, {
        paddingAbsolute: true,
        scrollbars: { autoHide: 'leave' },
      });
      return () => instance.destroy();
    }
  });
  return <pre ref={ref}>{children}</pre>;
};
