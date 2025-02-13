// import Link from 'next/link';
import type { ComponentProps } from 'react';

export interface HeadingProps extends ComponentProps<'h1'> {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = ({ id, tag: Tag, ...rest }: HeadingProps) => {
  if (id) {
    return (
      <>
        {/* <Link href={`/#${id}`} scroll={false}> */}
        {}
        <Tag {...rest} />
        {/* </Link> */}
      </>
    );
  }

  return <Tag {...rest} />;
};
