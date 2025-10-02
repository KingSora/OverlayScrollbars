import type { NodeElementTarget } from './types';
// import { getAttr, removeAttrs, setAttrs } from './attribute';

export const focusElement = (element: NodeElementTarget /*, forceTabIndex?: boolean*/) => {
  if (element && (element as HTMLElement).focus) {
    // const tabIndexStr = 'tabindex';
    // const originalTabIndex = getAttr(element as HTMLElement, tabIndexStr);
    // if (forceTabIndex) {
    //   setAttrs(element as HTMLElement, tabIndexStr, '-1');
    // }

    (element as HTMLElement).focus({
      preventScroll: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      focusVisible: false,
    });

    // if (forceTabIndex) {
    //   if (originalTabIndex) {
    //     setAttrs(element as HTMLElement, tabIndexStr, originalTabIndex);
    //   } else {
    //     removeAttrs(element as HTMLElement, tabIndexStr);
    //   }
    // }
  }
};
