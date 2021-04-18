import 'styles/overlayscrollbars.scss';
import './index.scss';

import { resize } from '@/testing-browser/Resize';
import { OverlayScrollbars } from 'overlayscrollbars';
import { style } from 'support';

const targetElm = document.querySelector('#target') as HTMLElement;
const osInstance = (window.os = OverlayScrollbars({ target: targetElm, content: false }));

const target: HTMLElement | null = document.querySelector('#target');
const comparison: HTMLElement | null = document.querySelector('#comparison');
const targetRes: HTMLElement | null = document.querySelector('#target .resize');
const comparisonRes: HTMLElement | null = document.querySelector('#comparison .resize');

resize(target!).addResizeListener((width, height) => style(comparison, { width, height }));
//resize(comparison!).addResizeListener((width, height) => style(target, { width, height }));
resize(targetRes!).addResizeListener((width, height) => style(comparisonRes, { width, height }));
//resize(comparisonRes!).addResizeListener((width, height) => style(targetRes, { width, height }));

target!.querySelector('.os-viewport')?.addEventListener('scroll', (e) => {
  const viewport: HTMLElement | null = e.currentTarget as HTMLElement;
  comparison!.scrollLeft = viewport.scrollLeft;
  comparison!.scrollTop = viewport.scrollTop;
});
