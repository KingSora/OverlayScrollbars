import './index.scss';
import 'index.scss';
import { OverlayScrollbars } from 'overlayscrollbars';

// test with different cancel values for body

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});
// @ts-ignore
window.os = OverlayScrollbars({ target: document.body, cancel: { body: null } }, {});
