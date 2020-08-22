export const mouseButton = (event: MouseEvent): number => {
  const { button } = event;
  if (!event.which && button !== undefined) {
    return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0; // eslint-disable-line no-bitwise
  }
  return event.which;
};
