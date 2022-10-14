import { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => (
  <div className="container">{children}</div>
);
