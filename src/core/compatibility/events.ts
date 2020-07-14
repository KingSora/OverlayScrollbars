export const mouseButton: (event: MouseEvent) => number = (event) => {
    const button: number = event.button;
    if (!event.which && button !== undefined)
        return (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    else
        return event.which;
}
