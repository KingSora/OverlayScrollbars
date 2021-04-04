import { getEnvironment } from 'environment';
import { OverlayScrollbars } from 'overlayscrollbars/overlayscrollbars';

export default () => {
  return [getEnvironment(), OverlayScrollbars(document.body)];
};
