import { component$, useVisibleTask$ } from '@qwik.dev/core';
import { QwikRouterProvider, RouterOutlet, ServiceWorkerRegister } from '@qwik.dev/router';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { RouterHead } from './components/router-head/router-head';

import './global.css';
import 'overlayscrollbars/overlayscrollbars.css';

export default component$(() => {
  useVisibleTask$(
    () => {
      OverlayScrollbars.plugin(ClickScrollPlugin);
    },
    { strategy: 'document-ready' }
  );

  /**
   * The root of a QwikCity site always start with the <QwikRouterProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikRouterProvider data-overlayscrollbars-initialize="">
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body data-overlayscrollbars-initialize="" lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikRouterProvider>
  );
});
