import 'overlayscrollbars.scss';
import './index.scss';
import { OverlayScrollbars } from 'overlayscrollbars/OverlayScrollbars';

const targetElm = document.querySelector('#target') as HTMLElement;
OverlayScrollbars(targetElm);
