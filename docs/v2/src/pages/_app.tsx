import '~/assets/css/tailwind.css';
import '~/assets/css/styles.css';
import Head from 'next/head';
import favicon from '~/assets/favicon.ico';
import type { AppProps } from 'next/app';

const OverlayScrollbarsDocs = ({ Component, pageProps }: AppProps) => (
  <div className="font-sans font-normal">
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
);

export default OverlayScrollbarsDocs;
