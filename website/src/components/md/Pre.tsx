import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { ComponentProps } from 'react';

export const Pre = ({ children }: ComponentProps<'pre'>) => (
  <OverlayScrollbarsComponent
    element="pre"
    options={{
      paddingAbsolute: true,
      scrollbars: { autoHide: 'leave' },
    }}>
    {children}
  </OverlayScrollbarsComponent>
);
