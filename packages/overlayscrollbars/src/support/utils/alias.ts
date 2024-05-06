import { isBrowser } from '../compatibility/isBrowser';

export const wnd = (isBrowser ? window : {}) as typeof window;
export const mathMax = Math.max;
export const mathMin = Math.min;
export const mathRound = Math.round;
export const mathFloor = Math.floor;
export const mathCeil = Math.ceil;
export const mathAbs = Math.abs;
export const mathSign = Math.sign;
export const cAF = wnd.cancelAnimationFrame;
export const rAF = wnd.requestAnimationFrame;
export const setT = wnd.setTimeout;
export const clearT = wnd.clearTimeout;
