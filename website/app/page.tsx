'use client';
import classnames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { Link } from '~/components/Link';
import { Icon } from '~/components/Icon';
import IndexMdx from '~/components/index.mdx';
import { PageContainer } from '~/components/PageContainer';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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

const githubLink = 'https://github.com/KingSora/OverlayScrollbars';

const separator = (children: ReactNode) => (
  <div className="my-6 text-center font-medium text-sm uppercase relative">
    <span className="p-3 bg-slate-50">
      {children}
      <div className="absolute block top-1/2 left-1/2 w-full xs:w-[80%] border-t-[1px] border-slate-300 -translate-x-1/2 -translate-y-1/2 -z-10" />
    </span>
  </div>
);

const IndexPage = () => {
  return (
    <PageContainer>
      <div className="mt-8 flex justify-center items-center h-[33vh] min-h-32 max-h-40 xxs:max-h-44">
        <div
          className={classnames(
            'h-full relative',
            'before:content-[""] before:bg-[url(/OverlayScrollbars/img/logo.svg)] before:absolute before:left-0 before:w-full before:h-full before:bg-contain before:bg-center before:bg-no-repeat before:-z-10 before:[transform:translateZ(0)]',
            'before:[filter:blur(33px)_saturate(1.22)] before:opacity-50 before:top-2.5',
            'after:content-[""] after:bg-[url(/OverlayScrollbars/img/logo.svg)] after:absolute after:left-0 after:w-full after:h-full after:bg-contain after:bg-center after:bg-no-repeat after:-z-10 after:[transform:translateZ(0)]',
            'after:[filter:drop-shadow(0_6px_22px_#5242e3)_saturate(1.5)] after:opacity-10 after:top-0'
          )}
        >
          <img
            src="/OverlayScrollbars/img/logo.svg"
            className="h-full"
            alt="OverlayScrollbars Logo"
            width="200"
            height="200"
          />
        </div>
      </div>
      <h1 className="text-center xxs:text-4xl text-2xl font-bold my-11">
        Overlay
        <wbr />
        Scrollbars
      </h1>
      <p className="text-center mx-auto max-w-screen-sm my-11 font-medium">
        A javascript scrollbar plugin that hides native scrollbars, provides custom styleable
        overlay scrollbars and keeps the native functionality and feeling.
      </p>

      {separator('used by')}
      <OverlayScrollbarsComponent defer>
        <div className="flex justify-center">
          <div
            className={classnames(
              'inline-flex  items-center gap-6 py-6 opacity-60 [filter:brightness(0.8)_sepia(1)_saturate(1.44)_hue-rotate(175deg)]'
            )}
          >
            <div
              className="h-11 px-3 flex-grow flex-shrink-0"
              style={{ filter: 'brightness(0.35)' }}
            >
              <img className="h-full" src="/OverlayScrollbars/img/spotify-logo.svg" alt="" />
            </div>
            <div className="h-11 px-3 py-1.5 flex-grow flex-shrink-0">
              <img className="h-full" src="/OverlayScrollbars/img/storybook-logo.svg" alt="" />
            </div>
            <div className="h-11 p-3 flex-grow flex-shrink-0">
              <img className="h-full" src="/OverlayScrollbars/img/adminlte-logo.png" alt="" />
            </div>
          </div>
        </div>
      </OverlayScrollbarsComponent>
      {separator(
        <a href={githubLink} target="_blank" className="inline-block leading-[0] rounded-full">
          <Icon
            className="inline-block w-11 h-11 hover:scale-110 text-primary-dark hover:text-primary-blue1 active:text-primary-blue2 transition-transformColor ease-in-out duration-300"
            url="/OverlayScrollbars/icon/github.svg"
          />
          <span className="sr-only">OverlayScrollbars on Github</span>
        </a>
      )}

      <p className="text-center text-sm text-primary-gray2 mx-auto max-w-screen-sm my-11 font-medium">
        This page is a work in progress. For now refer to the TypeScript definitions for a more
        detailed documentation.
        <br />
        Looking for the v1 docs? <Link href="/v1">Follow this link</Link>.
      </p>
      <div className="mx-auto flex sm:flex-row justify-center gap-2 items-center flex-wrap">
        <a href="https://www.npmjs.com/package/overlayscrollbars" className="rounded-sm">
          <img
            className="min-h-[20px]"
            src="https://img.shields.io/npm/dm/overlayscrollbars.svg?style=flat-square"
            alt="Downloads"
          />
        </a>
        <a href="https://www.npmjs.com/package/overlayscrollbars" className="rounded-sm">
          <img
            className="min-h-[20px]"
            src="https://img.shields.io/npm/v/overlayscrollbars.svg?style=flat-square"
            alt="Version"
          />
        </a>
        <a
          href="https://github.com/KingSora/OverlayScrollbars/blob/master/LICENSE"
          className="rounded-sm"
        >
          <img
            className="min-h-[20px]"
            src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square"
            alt="License"
          />
        </a>
        <a href="https://app.codecov.io/gh/KingSora/OverlayScrollbars" className="rounded-sm">
          <img
            className="min-h-[20px]"
            src="https://img.shields.io/codecov/c/github/KingSora/OverlayScrollbars?style=flat-square"
            alt="Code Coverage"
          />
        </a>
        <a href="https://bundlephobia.com/package/overlayscrollbars" className="rounded-sm">
          <img
            className="min-h-[20px]"
            src="https://img.shields.io/bundlephobia/minzip/overlayscrollbars?label=max.%20bundle%20size&style=flat-square"
            alt="Max. Bundle Size"
          />
        </a>
      </div>

      <nav className="mx-auto my-6 text-lg flex sm:flex-row justify-center gap-2 items-center flex-wrap">
        <Link href={githubLink} target="_blank" external>
          GitHub
        </Link>
        <span>&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
        <Link href="/examples" target="_blank">
          Examples
        </Link>
      </nav>

      <main className="prose prose-primary mx-auto pb-32">
        <IndexMdx />
      </main>
    </PageContainer>
  );
};

export default IndexPage;
