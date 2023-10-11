import { isBrowser } from '../compatibility/isBrowser';

export const wnd = (isBrowser && window) as typeof window;
