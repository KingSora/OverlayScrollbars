'use client';
import { useEffect } from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { UAParser } from 'ua-parser-js';
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';
import type { ComponentPropsWithoutRef } from 'react';

OverlayScrollbars.plugin(ClickScrollPlugin);

export const Html = ({ children }: ComponentPropsWithoutRef<'html'>) => {
  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        clickScroll: true,
      },
    },
  });

  useEffect(() => {
    const ua = new UAParser();
    const { type } = ua.getDevice();
    const cancelDevices = ['console', 'mobile', 'tablet', 'smarttv'];
    const scrollbarWidthSupported = !!window
      .getComputedStyle(document.body)
      .getPropertyValue('scrollbar-width');

    initialize({
      target: document.body,
      cancel: {
        nativeScrollbarsOverlaid:
          !scrollbarWidthSupported && !!type && cancelDevices.includes(type),
      },
    });
  }, [initialize]);

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
        {children}
      </body>
    </html>
  );
};
