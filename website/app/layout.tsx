import './styles.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { Root } from '~/components/Root';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

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

const OverlayScrollbarsDocs = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="en"
      className="w-full h-full font-sans font-medium text-primary-dark bg-slate-50"
      data-overlayscrollbars-initialize=""
    >
      <body className="w-full h-full" data-overlayscrollbars-initialize="">
        {/*
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3339885551695153"
          crossOrigin="anonymous"
        ></script>
        */}
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
        <Root>{children}</Root>
      </body>
    </html>
  );
};

export default OverlayScrollbarsDocs;
