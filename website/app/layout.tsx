import './styles.css';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import { Html } from '~/components/Html';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#36befd',
};

export const metadata: Metadata = {
  title: 'OverlayScrollbars',
  description:
    'A javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling.',
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

const OverlayScrollbarsDocs = (props: { children: ReactNode }) => {
  return <Html {...props} />;
};

export default OverlayScrollbarsDocs;
