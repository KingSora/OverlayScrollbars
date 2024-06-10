import type { NodeElementTarget } from './types';

export const focusElement = (element: NodeElementTarget) => {
  if (element && (element as HTMLElement).focus) {
    (element as HTMLElement).focus({ preventScroll: true });
  }
};
