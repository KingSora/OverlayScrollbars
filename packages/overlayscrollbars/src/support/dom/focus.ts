import type { NodeElementTarget } from './types';

export const focusElement = (element: NodeElementTarget) => {
  if (element && (element as HTMLElement).focus) {
    (element as HTMLElement).focus({
      preventScroll: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      focusVisible: false,
    });
  }
};
