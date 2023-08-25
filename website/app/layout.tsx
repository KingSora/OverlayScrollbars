'use client';
import './styles.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import UAParser from 'ua-parser-js';
import { Link } from '~/components/Link';
import type { Metadata } from 'next';
import type { ComponentProps, ReactNode } from 'react';
import type { HeadingProps } from '../components/md/Heading';
import { Heading } from '../components/md/Heading';
import { Pre } from '../components/md/Pre';

export const metadata: Metadata = {
  title: 'OverlayScrollbars',
  description:
    'A javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling.',
  themeColor: '#36befd',
  keywords: [
    'OverlayScrollbars',
    'Overlay',
    'Scroll',
    'Bar',
    'Custom',
    'Scrollbar',
    'React',
    'Vue',
    'Angular',
    'Solid',
    'Solidjs',
    'Svelte',
    'JavaScript',
    'TypeScript',
    'Plugin',
    'Library',
  ],
  authors: [
    { name: 'Rene Haas', url: 'https://github.com/KingSora' },
    { name: 'KingSora', url: 'https://github.com/KingSora' },
  ],
  creator: 'Rene Haas',
  publisher: 'Rene Haas',
  twitter: {
    title: 'OverlayScrollbars',
    description:
      'A javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling.',
  },
};

const generateHeading = (props: ComponentProps<'h1'>, tag: HeadingProps['tag']) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Heading {...props} tag={tag} />
);

const OverlayScrollbarsDocs = ({ children }: { children: ReactNode }) => {
  const [initialize, instance] = useOverlayScrollbars({ defer: true });

  useEffect(() => {
    const ua = new UAParser();
    const { type } = ua.getDevice();
    const cancelDevices = ['console', 'mobile', 'tablet', 'smarttv'];

    initialize({
      target: document.body,
      cancel: { nativeScrollbarsOverlaid: !!type && cancelDevices.includes(type) },
    });
    return () => instance()?.destroy();
  }, []);

  return (
    <html lang="en" className="w-full h-full font-sans font-normal text-primary-dark bg-slate-50">
      <body className="w-full h-full">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'SoftwareSourceCode',
              url: 'https://kingsora.github.io/OverlayScrollbars',
              name: 'OverlayScrollbars',
              description:
                'A javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling.',
              license: 'https://en.wikipedia.org/wiki/MIT_License',
              keywords:
                'js,javascript,typescript,overlayscrollbars,overlay,scrollbars,custom,scrollbar,plugin,react,vue,angular,treeshaking',
              isAccessibleForFree: true,
              image:
                'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png',
              codeRepository: 'https://github.com/KingSora/OverlayScrollbars',
              runtimePlatform: 'browser',
              maintainer: {
                '@type': 'Person',
                name: 'Rene Haas',
                additionalName: 'KingSora',
                url: 'https://github.com/KingSora',
              },
              programmingLanguage: {
                '@type': 'ComputerLanguage',
                name: 'javascript',
                alternateName: 'js',
              },
            }),
          }}
        />
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
      </body>
    </html>
  );
};

export default OverlayScrollbarsDocs;
