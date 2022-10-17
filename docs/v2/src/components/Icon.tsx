import classnames from 'classnames';
import { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  svg: { src: string; width: number; height: number };
  icon?: string;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ svg, icon, className, ...other }, ref) => {
    if (svg) {
      const { src, width, height } = svg;
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          ref={ref}
          width={width}
          className={classnames('default:fill-current', className)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...other}>
          {icon ? <use href={`${src}#${icon}`} /> : <image href={src} width="100%" height="100%" />}
        </svg>
      );
    }

    return null;
  }
);

export default Icon;
