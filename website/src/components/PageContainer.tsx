import classnames from 'classnames';
import type { ReactNode } from 'react';

export interface PageContainerProps {
  children?: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => (
  <div className={classnames(className, 'sm:container')}>{children}</div>
);
