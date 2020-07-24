export const offset = (elm: HTMLElement) => {
  const rect = elm.getBoundingClientRect();
  return {
    top: rect.top + window.pageXOffset,
    left: rect.left + window.pageYOffset,
  };
};

export const position = (elm: HTMLElement) => ({
  top: elm.offsetTop,
  left: elm.offsetLeft,
});
