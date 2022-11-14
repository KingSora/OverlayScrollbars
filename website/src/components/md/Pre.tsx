import { useEffect, useRef } from 'react';
import { useOverlayScrollbarsIdle } from '~/hooks/useOverlayScrollbarsIdle';
import type { ComponentProps } from 'react';

export const Pre = ({ children }: ComponentProps<'pre'>) => {
  const ref = useRef(null);
  const [initialize, instance] = useOverlayScrollbarsIdle({
    options: {
      paddingAbsolute: true,
      scrollbars: { autoHide: 'leave' },
    },
  });

  useEffect(() => {
    if (ref.current) {
      initialize(ref.current);
      return () => instance()?.destroy();
    }
  }, []);

  return (
    <pre ref={ref} data-overlayscrollbars-initialize>
      {children}
    </pre>
  );
};
