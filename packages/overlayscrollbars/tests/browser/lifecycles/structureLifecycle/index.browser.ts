import 'styles/overlayscrollbars.scss';
import './index.scss';
import { resize } from '@/testing-browser/Resize';
import { OverlayScrollbars } from 'overlayscrollbars';

const targetElm = document.querySelector('#target') as HTMLElement;
window.os = OverlayScrollbars({ target: targetElm, content: false });

resize(document.querySelector('#resize')!);
resize(document.querySelector('#target')!);
