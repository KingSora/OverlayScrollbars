'use client';
import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import UAParser from 'ua-parser-js';
import { Link } from '~/components/Link';
import { Pre } from '~/components/md/Pre';
import type { ComponentProps, ReactNode } from 'react';
import type { HeadingProps } from '../components/md/Heading';
import { Heading } from '../components/md/Heading';

const generateHeading = (props: ComponentProps<'h1'>, tag: HeadingProps['tag']) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Heading {...props} tag={tag} />
);

export const Root = ({ children }: { children: ReactNode }) => {
  const [initialize] = useOverlayScrollbars({ defer: true });

  useEffect(() => {
    const ua = new UAParser();
    const { type } = ua.getDevice();
    const cancelDevices = ['console', 'mobile', 'tablet', 'smarttv'];

    initialize({
      target: document.body,
      cancel: { nativeScrollbarsOverlaid: !!type && cancelDevices.includes(type) },
    });
  }, [initialize]);

  return (
    <MDXProvider
      components={{
        h1: (props) => generateHeading(props, 'h1'),
        h2: (props) => generateHeading(props, 'h2'),
        h3: (props) => generateHeading(props, 'h3'),
        h4: (props) => generateHeading(props, 'h4'),
        h5: (props) => generateHeading(props, 'h5'),
        h6: (props) => generateHeading(props, 'h6'),
        a: (props) => <Link {...(props as any)} external />,
        pre: Pre,
      }}
    >
      {children}
    </MDXProvider>
  );
};
