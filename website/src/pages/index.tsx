import classnames from 'classnames';
import { useEffect, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import { PageContainer } from '~/components/PageContainer';
import { Icon } from '~/components/Icon';
import logo from '~/assets/img/logo.svg';
import spotifyLogo from '~/assets/img/spotify-logo.svg';
import storybookLogo from '~/assets/img/storybook-logo.svg';
import adminlteLogo from '~/assets/img/adminlte-logo.png';
import githubIcon from '~/assets/icon/github.svg';
import IndexMdx from '~/components/index.mdx';
import styles from './index.module.scss';
import type { ReactNode } from 'react';
import type { NextPage } from 'next';

const separator = (children: ReactNode) => (
  <div className="my-6 text-center font-medium text-sm uppercase relative">
    <span className="p-3 bg-white">
      {children}
      <div className="absolute block top-1/2 left-1/2 w-[100%] xs:w-[80%] border-t-[1px] border-slate-300 translate-x-[-50%] translate-y-[-50%] z-[-1]" />
    </span>
  </div>
);

const IndexPage: NextPage = () => {
  const usedByRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (usedByRef.current) {
      const instance = OverlayScrollbars(usedByRef.current, {});
      return () => instance.destroy();
    }
  }, []);

  return (
    <PageContainer className="px-6">
      <div className="mt-8 flex justify-center items-center h-[33vh] min-h-32 max-h-40 xxs:max-h-44">
        <div className={classnames('h-full', styles.logo)}>
          <img src={logo.src} className="h-full" alt="Overlay Scrollbars Logo" />
        </div>
      </div>
      <h1 className="text-center xxs:text-4xl text-2xl font-bold my-11">Overlay Scrollbars</h1>
      <p className="text-center mx-auto max-w-screen-sm my-11 font-medium">
        A javascript scrollbar plugin that hides native scrollbars, provides custom styleable
        overlay scrollbars and keeps the native functionality and feeling.
      </p>
      {separator('used by')}
      <div ref={usedByRef}>
        <div className="flex my-7 justify-center">
          <div className={classnames('inline-flex  items-center gap-6 py-4', styles.usedBy)}>
            <div
              className="h-11 px-3 flex-grow flex-shrink-0"
              style={{ filter: 'brightness(0.35)' }}>
              <img className="h-full" src={spotifyLogo.src} alt="" />
            </div>
            <div className="h-11 px-3 py-1.5 flex-grow flex-shrink-0">
              <img className="h-full" src={storybookLogo.src} alt="" />
            </div>
            <div className="h-11 p-3 flex-grow flex-shrink-0">
              <img className="h-full" src={adminlteLogo.src} alt="" />
            </div>
          </div>
        </div>
      </div>

      {separator(
        <a href="https://github.com/KingSora/OverlayScrollbars" target="_blank" rel="noreferrer">
          <Icon
            className="inline-block w-11 hover:scale-110 text-primary-dark hover:text-primary-blue1 active:text-primary-blue2 transition-transformColor ease-in-out duration-300"
            svg={githubIcon}
            icon="github"
          />
          <span className="sr-only">OverlayScrollbars on Github</span>
        </a>
      )}
      <p className="text-center text-sm text-primary-gray2 mx-auto max-w-screen-sm my-11 font-medium">
        This page is a work in progress. For now refer to the TypeScript definitions for a more
        detailed documentation.
        <br />
        Looking for the v1 docs?{' '}
        <a href="/v1" className="text-primary-blue2 underline">
          Follow this link
        </a>
        .
      </p>
      <div className="mx-auto flex sm:flex-row justify-center gap-2 items-center flex-wrap">
        <a href="https://www.npmjs.com/package/overlayscrollbars">
          <img
            src="https://img.shields.io/npm/dm/overlayscrollbars.svg?style=flat-square"
            alt="Downloads"
          />
        </a>
        <a href="https://www.npmjs.com/package/overlayscrollbars">
          <img
            src="https://img.shields.io/npm/v/overlayscrollbars.svg?style=flat-square"
            alt="Version"
          />
        </a>
        <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/LICENSE">
          <img
            src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square"
            alt="License"
          />
        </a>
        <a href="https://app.codecov.io/gh/KingSora/OverlayScrollbars">
          <img
            src="https://img.shields.io/codecov/c/github/KingSora/OverlayScrollbars?style=flat-square"
            alt="Code Coverage"
          />
        </a>
        <a href="https://bundlephobia.com/package/overlayscrollbars">
          <img
            src="https://img.shields.io/bundlephobia/minzip/overlayscrollbars?label=max.%20bundle%20size&style=flat-square"
            alt="Max. Bundle Size"
          />
        </a>
      </div>
      <div className="mt-11 prose prose-primary mx-auto pb-32">
        <IndexMdx />
      </div>
    </PageContainer>
  );
};

export default IndexPage;
