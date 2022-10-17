import '~/assets/css/tailwind.css';
import '~/assets/css/styles.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { useEffect } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import Head from 'next/head';
import { MDXProvider } from '@mdx-js/react';
import favicon from '~/assets/favicon.ico';
import { Pre } from '~/components/md/Pre';
import { Heading } from '~/components/md/Heading';
import type { ComponentProps } from 'react';
import type { AppProps } from 'next/app';
import type { HeadingProps } from '~/components/md/Heading';

const generateHeading = (props: ComponentProps<'h1'>, tag: HeadingProps['tag']) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Heading {...props} tag={tag} />
);

const OverlayScrollbarsDocs = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const bodyInstance = OverlayScrollbars(document.body, {});
    // @ts-ignore
    window.osBody = bodyInstance;
  }, []);

  return (
    <MDXProvider
      components={{
        h1: (props) => generateHeading(props, 'h1'),
        h2: (props) => generateHeading(props, 'h2'),
        h3: (props) => generateHeading(props, 'h3'),
        h4: (props) => generateHeading(props, 'h4'),
        h5: (props) => generateHeading(props, 'h5'),
        h6: (props) => generateHeading(props, 'h6'),
        pre: Pre,
      }}>
      <div className="font-sans font-normal text-primary-dark">
        <Head>
          <title key="title">OverlayScrollbars</title>
          <meta
            key="description"
            name="description"
            content="A javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling."
          />
          <link rel="icon" href={favicon.src} />
          <link rel="shortcut icon" type="image/x-icon" href={favicon.src} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="theme-color" content="#36befd" />
          <meta name="msapplication-TileColor" content="#36befd" />
          <meta name="msapplication-navbutton-color" content="#36befd" />
          <meta name="application-name" content="OverlayScrollbars" />
          <meta name="msapplication-tooltip" content="OverlayScrollbars" />
          <meta name="apple-mobile-web-app-title" content="OverlayScrollbars" />
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
        </Head>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </div>
    </MDXProvider>
  );
};

export default OverlayScrollbarsDocs;
