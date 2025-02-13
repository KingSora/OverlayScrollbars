import { forwardRef } from 'react';
import cn from 'classnames';
import type { ComponentPropsWithoutRef } from 'react';

export interface IconProps extends ComponentPropsWithoutRef<'span'> {
  /** The url of the icon. */
  url: string;
  /** Whether the icon should be rendered monochrome. */
  monochrome?: boolean;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(props, ref) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: ___, className, monochrome = true, url, ...others } = props;
  return (
    <span
      ref={ref}
      style={
        monochrome
          ? {
              maskImage: `url(${url})`,
              WebkitMaskImage: `url(${url})`,
            }
          : { backgroundImage: `url(${url})` }
      }
      className={cn(
        'default:block default:flex-none',
        {
          'default:bg-current': monochrome,
          'mask-center mask-contain mask-no-repeat': monochrome,
          'bg-no-repeat bg-contain bg-center': !monochrome,
        },
        className
      )}
      {...others}
    />
  );
});
