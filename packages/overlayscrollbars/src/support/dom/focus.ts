export const focusElement = (element: Element | false | null | undefined) => {
  if (element && (element as HTMLElement).focus) {
    (element as HTMLElement).focus({ preventScroll: true });
  }
};
