export const on = (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject | null, options: AddEventListenerOptions): void => {

    

    target.addEventListener(type, listener, options);
};