import { OverlayScrollbarsClientComponent } from '~/components/OverlayScrollbarsClientComponent';
import type { ComponentProps } from 'react';

export const Pre = ({ children }: ComponentProps<'pre'>) => (
  <OverlayScrollbarsClientComponent
    defer
    element="pre"
    options={{
      paddingAbsolute: true,
      scrollbars: { autoHide: 'scroll', autoHideSuspend: true },
    }}
  >
    {children}
  </OverlayScrollbarsClientComponent>
);
