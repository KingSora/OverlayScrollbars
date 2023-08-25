import classnames from 'classnames';
import NextLink from 'next/link';
import { forwardRef, type ComponentPropsWithRef } from 'react';

export interface LinkProps extends ComponentPropsWithRef<typeof NextLink> {
  external?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ external, ...props }, ref) => {
  const className = classnames(
    'no-underline text-primary-blue2 font-medium rounded-sm [background:linear-gradient(0deg,currentColor,currentColor)_no-repeat_right_bottom_/_0_2px]',
    '[transition:background-size_350ms] hover:[background-size:100%_2px] hover:[background-position-x:left]',
    props.className
  );

  return external ? (
    <a {...(props as any)} ref={ref} className={className} />
  ) : (
    <NextLink {...props} ref={ref} className={className} />
  );
});
